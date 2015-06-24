/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  addSign: function (type, floor, room, details) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (type != null && floor != null && room != null)
    {
      Signs.insert({
      	type: type,
      	floor: floor,
      	room: room,
      	details: details
      });

      console.log('A new sign was successfully added');
    }
  }
});
