SigninController = LayoutController.extend({
	template: 'signin',
	onBeforeAction: function(){
		if (Meteor.userId())
			Router.go('home');
		this.next();
	}
});

SigninController.events({
	'click #azure': function(event, template) {
		Meteor.loginWithAzureAd({}, function(err){
			if (err) {
				throw new Meteor.Error("Microsoft Azure login failed");
			}
		});
	},
	'click #adfs': function(event, template) {
		Meteor.loginWithSaml({}, function(err){
			if (err) {
				throw new Meteor.Error("Microsoft Azure login failed");
			}
		});
	}
});