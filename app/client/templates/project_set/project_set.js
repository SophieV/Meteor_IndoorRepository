Template.setProjectForm.helpers({
  setProjectFormSchema: function() {
    return SetProjectSchema;
  },
  projectsOptions: function() {
  	// TO DO replace with data 
  	 return [
        {label: "2013", value: "a"},
        {label: "2014", value: "b"},
        {label: "2015", value: "c"}
    ];
  }
});

AutoForm.hooks({
  setProjectForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      if (insertDoc != null) {
      	console.log('set current proj to ' + selectedProjectName);
    	Session.set('current_project', selectedProjectName);
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      return false;
    }
  }
});
