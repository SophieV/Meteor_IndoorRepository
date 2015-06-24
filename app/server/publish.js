Meteor.publish('all_signs_publication', function(id){
  return Signs.find({});
});
