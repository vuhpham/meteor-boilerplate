Meteor.publishComposite('posts', function(options) {
	check(options, PublishValidator.postOptions);
	return {
		find: function(){
			return Posts.find()
		},
		children: [
			{
				find: function(post){
					return Meteor.users.find({_id: post.authorId});
				}
			}
		]
	}
});

Meteor.publishComposite('postDetail', function(_id) {
	check(_id, String);
	return {
		find: function(){
			return Posts.find(_id)
		},
		children: [
			{
				find: function(post){
					return Meteor.users.find({_id: post.authorId});
				}
			}
		]
	}
});