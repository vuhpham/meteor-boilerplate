/// Fixtures

if (!Meteor.users.findOne()) {
	Meteor.users.insert({
		name: "Robot",
		email: "robot@website.com",
		profile: {
			name: "Robot"
		},
		createdAt: new Date()
	});
}

if (!Posts.findOne()) {
	Posts.insert({title: "Post 1", content: "This is post 1", authorId: Meteor.users.findOne()._id, createdAt: new Date()});
	Posts.insert({title: "Post 2", content: "This is post 2", authorId: Meteor.users.findOne()._id, createdAt: new Date()});
	Posts.insert({title: "Post 3", content: "This is post 3", authorId: Meteor.users.findOne()._id, createdAt: new Date()});
}