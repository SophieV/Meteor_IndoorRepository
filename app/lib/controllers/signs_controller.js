SignsController = RouteController.extend({
  layoutTemplate: 'MasterLayout',

  subscriptions: function() {
  },

  index: function() {
    this.render('signs_list');
  },
  add: function() {
    this.render('sign_add');
  }
});
