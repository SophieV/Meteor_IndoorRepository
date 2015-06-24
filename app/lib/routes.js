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
  where: 'client',
  data: function () { 
    return Signs.find();//$sort: { createdAt: -1 } 
  },
  waitOn: function() {
    return Meteor.subscribe('signs');
  }
});

Router.route('/sign-add', {
  name: 'sign-add',
  controller: 'SignsController',
  action: 'add',
  where: 'client'
});
