Template.MasterLayout.helpers({
	currentProject: function(){
		return Session.get('current_project');
	},
	isActive: function(routeName){
		var classValue = '';
		if (routeName != null && Router.current.route != null && Router.current().route.getName().toLowerCase() === routeName.toLowerCase())
		{
			classValue = "active";
		}
		
		return classValue;
	},
	noProject: function(){
		return (Session.get('current_project')!=null);
	},
	noProjectDisabledClass: function(){
		return (Session.get('current_project')==null?'disabled':'');
	}
});

Template.MasterLayout.events({
});
