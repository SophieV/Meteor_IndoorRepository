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
    return Signs.find({},{fields: {floor: 1}});
  },
  floorsOptions: function() {
    var floorsWithLabels = [];
    var inProjectCondition = "_id == " + Session.get('current_project');
    var allFloors = Signs.find({},{fields: {floor: 1}}).fetch();
    allFloors.forEach(function(floor){
      floorsWithLabels.push({label: floor.floor, value: floor.floor});
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
