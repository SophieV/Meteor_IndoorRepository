/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  addSign: function (type, floor, room, details, pictureData) {
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
        'createdBy': Meteor.user().emails[0].address
      };
      var newSign = Signs.insert(sign);

      console.log('A new sign was successfully added ' + JSON.stringify(sign));

      return newSign;
    }
  }
});
