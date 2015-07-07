Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});

Router.route('/signs', {
  name: 'signs',
  controller: 'SignsController',
  action: 'index',
  where: 'client'
});

Router.route('/sign-add', {
  name: 'sign-add',
  controller: 'SignsController',
  action: 'add',
  where: 'client'
});

Router.route('/projects', {
  name: 'projects',
  controller: 'ProjectsController',
  action: 'index',
  where: 'client'
});

Router.route('/project-add', {
  name: 'project-add',
  controller: 'ProjectsController',
  action: 'add',
  where: 'client'
});

Router.route('/project-set', {
  name: 'project-set',
  controller: 'ProjectsController',
  action: 'set',
  where: 'client'
});
