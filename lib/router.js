Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	controller: 'layoutController'
});

Router.route('/', {name: 'home', controller: HomeController});
Router.route('/posts', {name: 'posts', controller: PostListController});
Router.route('/post/:_id', {name: 'postDetail', controller: PostDetailController});
Router.route('/signin', {name: 'signin', controller: SigninController});
Router.route('/profile', {name: 'profile', controller: ProfileController});

Router.onBeforeAction(function() {
	if (! Meteor.userId()) {
		Router.go('signin');

	}
	this.next();
});