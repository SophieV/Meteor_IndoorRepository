Meteor.publish('all_signs_publication', function(id){
  return Signs.find({});
});

Meteor.publish('all_floors_publication', function(id){
  return Floors.find({});
});
