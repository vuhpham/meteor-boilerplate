PostListController = LayoutController.extend({
	template: 'postList',
	data: function() {
		return {
			posts: Posts.find()
		};
	},
	findOptions: function(){
		return {};
	},
	subscriptions: function() {
		return [
			Meteor.subscribe("posts", this.findOptions())
		];
	}
});

PostDetailController = LayoutController.extend({

});