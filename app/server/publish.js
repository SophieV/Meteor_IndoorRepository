Meteor.publish('all_signs_publication', function(id){
  return Signs.find({});
});

Meteor.publish('all_signfamilies_publication', function(id){
  return SignFamilies.find({});
});

Meteor.publish('all_projects_publication', function(id){
  return Projects.find({});
});

Meteor.publish('all_userProjectAssigned_publication', function(id){
  return UserProjectAssigned.find({});
});

Meteor.publish('all_images_publication', function(id){
  return Images.find({});
});

Meteor.publish('all_indoorMaps_publication', function(id){
  return IndoorMaps.find({});
});

