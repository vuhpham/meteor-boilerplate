Template.layout.helpers({
	currentUser: function(){
		return Meteor.user();
	}
});

Template.layout.events({
	'click #logout': function(event, template){
		Meteor.logout(function(err){
			if (err) {
				throw new Meteor.Error("Logout failed");
			}
		});
	}
});

Template.layout.rendered = function() {
	$(document).ready(function(){
		$('.dropdown-button').dropdown({
				inDuration: 300,
				outDuration: 225,
				constrain_width: false, // Does not change width of dropdown to that of the activator
				hover: true, // Activate on hover
				gutter: 0, // Spacing from edge
				belowOrigin: false // Displays dropdown below the button
			}
		);
	});
};