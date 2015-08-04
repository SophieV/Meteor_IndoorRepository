/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.created = function () {
};

Template.Home.rendered = function () {
};

Template.Home.destroyed = function () {
};

AutoForm.hooks({
  insertProjectForm: {
    onSubmit: function (doc) {
      // ProjectSchema.clean(doc);
      console.log("Project doc with auto values", doc);
      this.done();
      return false;
    }
  }
});

Template.Home.onCreated(function(){
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
        console.log('restpre current floor to ' + currentFloor.name);
        Session.set('current_floor', currentFloor.name);
      }
    }
	}
});