/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  assignProjectToUser: function(userIdValue, projectIdValue)
  {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    //reset floor
    var assignment = { 'userId': userIdValue,
                    'project': projectIdValue,
                    'floor': null};

    var existingAssignment = UserProjectAssigned.find({userId: userIdValue});
    if (existingAssignment.count() > 0)
    {
      var assignmentDone = UserProjectAssigned.update({userId: userIdValue}, {$set: {projectId: projectIdValue}});
      console.log('A new assignment was successfully updated ' + JSON.stringify(assignment));
    }
    else
    {
      var assignmentDone = UserProjectAssigned.insert(assignment);
      console.log('A new assignment was successfully added ' + JSON.stringify(assignment));
    }

    return assignmentDone;
  },
  assignFloorToUser: function(userIdValue, floorNameValue)
  {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var assignment = { 'userId': userIdValue,
                    'floor': floorNameValue};

    var existingAssignment = UserProjectAssigned.find({userId: userIdValue});
    if (existingAssignment.count() > 0)
    {
      var assignmentDone = UserProjectAssigned.update({userId: userIdValue}, {$set: {floor: floorNameValue}});
      console.log('A new assignment was successfully updated ' + JSON.stringify(assignment));
    }

    return assignmentDone;
  }
});
