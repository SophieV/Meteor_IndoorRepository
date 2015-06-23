SignsController = RouteController.extend({
  layoutTemplate: 'MasterLayout',

  subscriptions: function() {
  },

  action: function() {
    this.render('signs-list');
  },
  add: function() {
    this.render('sign-add');
  }
});
