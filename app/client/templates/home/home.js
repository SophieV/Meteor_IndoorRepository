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
	var projectAssignedToCurrentUser = UserProjectAssigned.find({}, {$where: "userId == " + Meteor.userId()});
	if (projectAssignedToCurrentUser.count() > 0)
	{
		var currentProjectId = projectAssignedToCurrentUser.fetch()[0].projectId;
    var currentFloor = projectAssignedToCurrentUser.fetch()[0].floor;
		var mappedName = Projects.find({_id: currentProjectId}).fetch();

		console.log('restpre current proj to ' + mappedName[0].name);
      	Session.set('current_project', currentProjectId);
        Session.set('current_project_name', mappedName[0].name);
    console.log('restpre current floor to ' + currentFloor);
    Session.set('current_floor', currentFloor);
	}
});