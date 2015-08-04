Template.floor_set.helpers({
  currentProject: function(){
    return Session.get('current_project');
  }
});
Template.setFloorForm.helpers({
  setFloorFormSchema: function() {
    return SetFloorSchema;
  },
  floors: function(){
    return Projects.find({_id: Template.currentProject},{fields: {floors: 1}});
  },
  floorsOptions: function() {
    var floorsWithLabels = [];
    var allFloors = Projects.find({_id: Session.get('current_project')},{fields: {floors: 1}}).fetch();
    allFloors.forEach(function(floor){
      floor.floors.forEach(function (floorName) {
        floorsWithLabels.push({label: floorName, value: floorName});
      });
    });
    return floorsWithLabels;
  }
});

AutoForm.hooks({
  setFloorForm: {
    onSubmit: function (doc) {
      if (doc != null) {
        // is the value associated with the label displayed
        var selectedFloorValue = doc.name;
      	console.log('set current floor to ' + selectedFloorValue);
    	Session.set('current_floor', selectedFloorValue);
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      // event prevent default
      return false;
    }
  }
});
