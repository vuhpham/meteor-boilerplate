PostListController = LayoutController.extend({
	template: 'postList',
	data: function() {
		return {
			posts: Posts.find({}, {sort: {createdAt: -1}})
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
	template: 'postDetail',
	data: function() {
		return {
			post: Posts.findOne()
		};
	},
	subscriptions: function() {
		return [
			Meteor.subscribe("postDetail", this.params._id)
		];
	}
});