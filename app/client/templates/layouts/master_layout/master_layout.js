Template.MasterLayout.helpers({
	isActive: function(routeName){
		var classValue = '';
		if (Router.current().route.getName().toLowerCase() === routeName.toLowerCase())
		{
			classValue = "active";
		}
		
		return classValue;
	}
});

Template.MasterLayout.events({
});
