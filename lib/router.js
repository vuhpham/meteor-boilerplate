Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	controller: 'layoutController'
});

Router.route('/', {name: 'home', controller: HomeController});
Router.route('/posts', {name: 'posts', controller: PostListController});
Router.route('/post/:_id', {name: 'postDetail', controller: PostDetailController});