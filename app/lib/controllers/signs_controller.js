SignsController = RouteController.extend({
  layoutTemplate: 'MasterLayout',

  subscriptions: function() {
  },

  index: function() {
  	this.wait([Meteor.subscribe('all_signs_publication', {
      onReady: function () { console.log("onReady - items ready", arguments); },
      onError: function () { console.log("onError", arguments); }
    }), Meteor.subscribe('all_projects_publication', {
      onReady: function () { console.log("onReady - items ready", arguments); },
      onError: function () { console.log("onError", arguments); }
    }), Meteor.subscribe('all_indoorMaps_publication', {
      onReady: function () { console.log("onReady - items ready", arguments); },
      onError: function () { console.log("onError", arguments); }
    })]);

	if (this.ready()) 
	{
		this.render('signs_list', {data: Signs.find({})});
	} 
	else 
	{
		this.render('Loading');
	}
  },
  add: function() {
    this.wait([Meteor.subscribe('all_signs_publication', {
      onReady: function () { console.log("onReady - items ready", arguments); },
      onError: function () { console.log("onError", arguments); }
    }), Meteor.subscribe('all_projects_publication', {
      onReady: function () { console.log("onReady - items ready", arguments); },
      onError: function () { console.log("onError", arguments); }
    }), Meteor.subscribe('all_indoorMaps_publication', {
      onReady: function () { console.log("onReady - items ready", arguments); },
      onError: function () { console.log("onError", arguments); }
    })]);

    if (this.ready()) 
    {
      this.render('sign_add', {data: Signs.find({})});
    } 
    else 
    {
      this.render('Loading');
    }
  }
});
