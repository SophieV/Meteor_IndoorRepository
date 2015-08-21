HomeController = RouteController.extend({
  layoutTemplate: 'MasterLayout',

  subscriptions: function() {
  },

  action:  function() {
	  	this.wait([Meteor.subscribe('all_userProjectAssigned_publication', {
	      onReady: function () { console.log("onReady - items ready", arguments); },
	      onError: function () { console.log("onError", arguments); }
	  }),Meteor.subscribe('all_projects_publication', {
	      onReady: function () { console.log("onReady - items ready", arguments); },
	      onError: function () { console.log("onError", arguments); }
	  })]);
	  	if (this.ready()) 
		{
			this.render('Home', {data: Projects.find({})});
		} 
		else 
		{
			this.render('Loading');
		}
	}
});