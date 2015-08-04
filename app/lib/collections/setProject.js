SetProjectSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 200
  }
});

UserProjectAssigned = new Mongo.Collection("userProjectAssigned");
// UserProjectAssignedSchema = new SimpleSchema({
// 	userId: {
//     type: String,
//     unique: true,
//     max: 200
//   },
//   projectId: {
//     type: String,
//     max: 200
//   }
// });

// UserProjectAssigned.attachSchema(UserProjectAssignedSchema);

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