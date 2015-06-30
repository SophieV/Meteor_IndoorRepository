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
  addFloor: function(code, name, projectName)
  {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var newFloor = { 'name': name,
                    'code': code,
                    'project': projectName};

    var newFloor = Floors.insert(newFloor);

    console.log('A new floor was successfully added ' + JSON.stringify(newFloor));

    return newFloor;
  }
});
