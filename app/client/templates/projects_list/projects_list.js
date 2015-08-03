Template.projects_list.helpers({
	projects: function(){
		return Projects.find();
	}
});

Template.projects_list.onCreated(function(){
});

Template.projects_list.events({
});