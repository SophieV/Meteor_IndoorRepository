Template.project_set.helpers({
});
Template.setProjectForm.helpers({
  setProjectFormSchema: function() {
    return SetProjectSchema;
  },
  projects: function(){
    return Projects.find();
  },
  projectsOptions: function() {
    var projectsWithLabels = [];
    var allProjects = Projects.find();
    allProjects.forEach(function(project){
      projectsWithLabels.push({label: project.name, value: project._id});
    });
    return projectsWithLabels;
  }
});

AutoForm.hooks({
  setProjectForm: {
    onSubmit: function (doc) {
      if (doc != null) {
        // is the value associated with the label displayed
        var selectedProjectValue = doc.name;
        var mappedName = Projects.find({_id: selectedProjectValue}).fetch();

        Meteor.call("assignProjectToUser", Meteor.userId(), selectedProjectValue);

      	console.log('set current proj to ' + mappedName[0].name);
      	Session.set('current_project', selectedProjectValue);
        Session.set('current_project_name', mappedName[0].name);

        console.log('reset active floor');
        Session.set('current_floor', null);
        
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      // event prevent default
      return false;
    }
  }
});
