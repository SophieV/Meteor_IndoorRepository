Template.signs_list.helpers({
  isIdentified: function () {
    return Meteor.userId() != null;
  }
});