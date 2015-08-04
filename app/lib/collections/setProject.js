SetProjectSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 200
  }
});

UserProjectAssigned = new Mongo.Collection("userProjectAssigned");

UserProjectAssigned.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});