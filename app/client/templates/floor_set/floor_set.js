Template.floor_set.helpers({
  currentProject: function(){
    return Session.get('current_project');
  }
});
Template.setFloorForm.helpers({
  setFloorFormSchema: function() {
    return SetFloorSchema;
  },
  floorsOptions: function() {
    var floorsWithLabels = [];
    var allFloors = Projects.find({_id: Session.get('current_project')},{fields: {floors: 1}}).fetch();
    allFloors.forEach(function(floor){
      floor.floors.forEach(function (floorObject) {
        floorsWithLabels.push({label: floorObject.name, value: floorObject.name});
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

        Session.set('current_floor', selectedFloorValue);

        Meteor.call("assignFloorToUser", Meteor.userId(), selectedFloorValue);

      	console.log('set current floor to ' + selectedFloorValue);
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      // event prevent default
      return false;
    }
  }
});
