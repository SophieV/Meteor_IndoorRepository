Template.sign_add.helpers({
  isOwner: function () {
      return this.owner === Meteor.userId();
  },
  isIdentified: function () {
    return Meteor.userId() != null;
  }
});

function clearFormData(form){
  form.sign_type.value = "";
  form.sign_floor.value = "";
  form.sign_room.value = "";
  form.sign_details.value = "";
};

Template.sign_add.events({
  "reset .new-sign": function (event, template) {
    clearFormData(event.target);
  },
  "submit .new-sign": function (event, template) {
    var requiredFieldsPopulated = new ReactiveVar(true);
    
    try
    {
      var TextPopulated = Match.Where(function (text) {
        check(text, String);
        return text.length > 0;
      });

      check(event.target.sign_type.value, TextPopulated);
      check(event.target.sign_floor.value, TextPopulated);
      check(event.target.sign_room.value, TextPopulated);
    }
    catch (err)
    {
      event.preventDefault();
      requiredFieldsPopulated.set(false);
      console.log('Not all required fields are populated');
    }

    if (requiredFieldsPopulated.get())
    {
      Meteor.call("addSign", event.target.sign_type.value, event.target.sign_floor.value, event.target.sign_room.value, event.target.sign_details.value);

      clearFormData(event.target);
    }

    return false;
  }
});