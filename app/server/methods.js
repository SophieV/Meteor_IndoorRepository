/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  addSign: function (type, floor, room, details, pictureData, markerCoordinates) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (type != null && floor != null && room != null)
    {
      var sign = {
        'image': pictureData,
        'type': type,
        'floor': floor,
        'room': room,
        'details': details,
        'createdAt': Meteor.user().createdAt,
        'createdBy': Meteor.user().emails[0].address,
        'geoPoint': {
          'left': markerCoordinates.left,
          'top': markerCoordinates.top
        }
      };
      var newSign = Signs.insert(sign);

      console.log('A new sign was successfully added ' + JSON.stringify(sign));

      return newSign;
    }
  },
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
