Template.setProjectForm.helpers({
  setProjectFormSchema: function() {
    return SetProjectSchema;
  },
  projects: function(){
    return Projects.find();
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
    onSubmit: function (doc) {
      if (doc != null) {
        // is the value associated with the label displayed
        var selectedProjectValue = doc.name;
      	console.log('set current proj to ' + selectedProjectValue);
    	Session.set('current_project', selectedProjectValue);
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      // event prevent default
      return false;
    }
  }
});
