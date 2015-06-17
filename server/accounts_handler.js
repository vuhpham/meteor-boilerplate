PendingMelds = new Mongo.Collection("pendingMelds");

var origUpdateOrCreateUserFromExternalService =
	Accounts.updateOrCreateUserFromExternalService;

updateOrCreateUserFromExternalService = function(serviceName, serviceData, options) {
	var currentUser = Meteor.user();
	if (currentUser) {
		// Click on meld button
		//TODO::
	}
	else {
		// From login page, automatically merge or create new account if it doesn't match any existing emails
		var serviceEmail = null;
		var user = null;
		switch (serviceName) {
			case "azureAd":
				serviceEmail = serviceData.mail;
				if (!serviceEmail) throw new Meteor.Error("Failed on get email of Azure AD service");
				user = Meteor.users.findOne({"profile.email": serviceEmail});
				if (!options.email) options.email = serviceData.mail;
				if (user){
					// There is already an user with the same email (User logged in by Xbox Live service)
					if (user.services[serviceName]) {
						// Resume login
						return origUpdateOrCreateUserFromExternalService.apply(this, arguments);
					}
					else {
						// Merge existing user to current service
						PendingMelds.insert({serviceId: serviceData.id, mergedId: user._id});
					}
				}
				else {
					// Just simple continue
					return origUpdateOrCreateUserFromExternalService.apply(this, arguments);
				}
				break;
			case "facebook": {
				serviceEmail = serviceData.email;
				if (!serviceEmail) throw new Meteor.Error("Failed on get email of Facebook service");
				user = Meteor.users.findOne({"profile.email": serviceEmail});
				if (!options.email) options.email = serviceData.email;
				if (user){
					// There is already an user with the same email (User logged in by Xbox Live service)
					if (user.services[serviceName]) {
						// Resume login
						return origUpdateOrCreateUserFromExternalService.apply(this, arguments);
					}
					else {
						// Merge existing user to current service
						PendingMelds.insert({serviceId: serviceData.id, mergedId: user._id});
					}
				}
				else {
					// Just simple continue
					return origUpdateOrCreateUserFromExternalService.apply(this, arguments);
				}
				break;
			}
		}
	}
	return origUpdateOrCreateUserFromExternalService.apply(this, arguments);
};

Accounts.updateOrCreateUserFromExternalService =
	updateOrCreateUserFromExternalService;

UserUtilities = function(_id){
	var currentUser = Meteor.users.findOne(_id);
	var self = this;
	
	this.mergeUser = function(sourceUser){
		if (!sourceUser) {
			console.log("This is a pending merge action but not existing the merged user");
		}
		else {
			var services = currentUser.services;
			delete services.resume;
			var modifier = {
				createdAt: sourceUser.createdAt
			};

			for (var key in sourceUser.services){
				if (sourceUser.services.hasOwnProperty(key) && key !== "resume") {
					modifier["services." + key] = sourceUser.services[key];
				}
			}

			for (key in sourceUser.profile){
				if (sourceUser.profile.hasOwnProperty(key) && sourceUser.profile[key]){
					modifier["profile." + key] = sourceUser.profile[key];
				}
			}

			for (key in currentUser.profile){
				if (currentUser.profile.hasOwnProperty(key) && currentUser.profile[key] && !sourceUser.profile[key]){
					modifier["profile." + key] = currentUser.profile[key];
				}
			}

			Meteor.users.remove(sourceUser._id);
			Meteor.users.update(
				{_id: currentUser._id},
				{
					$set: modifier
				}
			);
		}
	};
};

var firstTimeLoggedIn = false;

Accounts.onLogin(function(result){
	// Call async update avatar
	if (!firstTimeLoggedIn) return;

	var currentUser = result.user;
	var userUtilities = new UserUtilities(currentUser._id);

	// Check if this user has pending meld status
	var pMeld = PendingMelds.findOne({serviceId: _.values(currentUser.services)[0].id});
	if (pMeld) {
		// Basic merge user
		var source = Meteor.users.findOne(pMeld.mergedId);
		userUtilities.mergeUser(source);
		// Remove pending melds
		PendingMelds.remove(pMeld._id);
	}

	firstTimeLoggedIn = false;
});

Accounts.onCreateUser(function(options, user) {
	var userProperties = {
		profile: options.profile || {}
	};

	user = _.extend(user, userProperties);
	if (options.email)
		user.profile.email = options.email;

	firstTimeLoggedIn = true;
	return user;
});