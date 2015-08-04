Meteor.publish('all_signs_publication', function(id){
  return Signs.find({});
});

Meteor.publish('all_projects_publication', function(id){
  return Projects.find({});
});

Meteor.publish('all_userProjectAssigned_publication', function(id){
  return UserProjectAssigned.find({});
});
