Template.MasterLayout.helpers({
	currentProject: function(){
		return Session.get('current_project_name');
	},
	currentFloor: function(){
		return Session.get('current_floor');
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

Template.MasterLayout.onCreated(function () {

  var instance = this;
  var projectsReady = false;
  var userAssignmentsReady = false;
  var hasBeenRestored = false;

  instance.autorun(function () {

  	if (!hasBeenRestored) {

	    // subscribe to the posts publication
	    var subscriptionUserToProject = instance.subscribe('all_userProjectAssigned_publication');
	    var subscriptionProjects = instance.subscribe('all_projects_publication');

	    // if subscription is ready, set limit to newLimit
	    if (subscriptionUserToProject.ready()) {
	    	userAssignmentsReady = true;
	      console.log("> Received user assignments. \n\n");
	    }

	     if (subscriptionProjects.ready()) {
	     	projectsReady = true;
	      console.log("> Received projects. \n\n");
	      console.log(Projects.find().fetch());
	    }

	    if (userAssignmentsReady && projectsReady) {

	    	var projectAssignedToCurrentUser = UserProjectAssigned.find({userId: Meteor.userId()});
			if (projectAssignedToCurrentUser.count() > 0)
			{
				var currentProjectId = projectAssignedToCurrentUser.fetch()[0].projectId;
			    var mappedProjectName = Projects.find({_id: currentProjectId}).fetch();

			    if(mappedProjectName.length > 0) {
			      
			      console.log('restpre current proj to ' + mappedProjectName[0].name);
			          Session.set('current_project', currentProjectId);
			          Session.set('current_project_name', mappedProjectName[0].name);

			      var currentFloor = projectAssignedToCurrentUser.fetch()[0].floor;
			      if(currentFloor != null)
			      {
			        console.log('restpre current floor to ' + currentFloor);
			        Session.set('current_floor', currentFloor);
			      }
			    }
			}

			hasBeenRestored = true;
	    }
  	}
  });
});

