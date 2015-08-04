Template.sign_add.helpers({
  activeFloor: function(){
    return Session.get('current_floor');
  },
  isOwner: function () {
      return this.owner === Meteor.userId();
  },
  isIdentified: function () {
    return Meteor.userId() != null;
  },
  isDevice: function() {
    return Meteor.isCordova;
  },
  settings: function() {
    return {
      position: Session.get("position"),
      limit: 10,
      rules: [
        {
          // token: '',
          collection: Projects.find({_id: Session.get('current_project')},{fields: {floors: 1}}).fetch(),
          field: 'floor.name',//scope of search
          matchAll: true,
          template: Template.floorSuggestions
        }
      ]
    };
  },
  floors: function() {
    return Projects.find({_id: Session.get('current_project')},{fields: {floors: 1}}).fetch();
  }
});

Template.sign_add.onCreated(function(){
  this.sign_picture = new ReactiveVar(null);
  this.indoorMap = null;
  // Meteor.call("addFloor", "RDC", "REZ DE CHAUSSEE", "demoProject");
  // Meteor.call("addFloor", "FL2", "2nd Floor", "demoProject");
});

Template.sign_add.onRendered(function(){
  this.indoorMap = new FloorCanvasMap();
  this.indoorMap.init('floorDemoCanvas', false);
});

Template.sign_add.onDestroyed(function(){
  this.indoorMap.destroy();
});

Template.sign_add.events({
  "autocompleteselect input": function(event, template, doc) {
    console.log("floor was selected ", doc);
  },
  "reset .new-sign": function (event, template) {
    clearFormData(event.target, template);
  },
  "submit .new-sign": function (event, template) {
    var requiredFieldsPopulated = new ReactiveVar(true);
    var markerCoordinates;
    
    try
    {
      var TextPopulated = Match.Where(function (text) {
        check(text, String);
        return text.length > 0;
      });

      var CoordinatePopulated = Match.Where(function (number) {
        check(number, Number);
        return number.toString().length > 0;
      });

      check(event.target.sign_type.value, TextPopulated);
      check(event.target.sign_room.value, TextPopulated);
      check(template.sign_picture.get(), TextPopulated);

      markerCoordinates = template.indoorMap.getCreatedPinCoordinates();
      check(markerCoordinates.left, CoordinatePopulated);
      check(markerCoordinates.top, CoordinatePopulated);
    }
    catch (err)
    {
      event.preventDefault();
      requiredFieldsPopulated.set(false);
      console.log('Not all required fields are populated');
    }

    if (requiredFieldsPopulated.get())
    {
      Meteor.call("addSign", event.target.sign_type.value, template.activeFloor, event.target.sign_room.value, event.target.sign_details.value, template.sign_picture.get(), markerCoordinates);

      clearFormData(event.target, template);
    }

    return false;
  }
});

Template.take_camera_picture.events({
  'click button': function (event, template) {
    getSignPicture({
      width: 350,
      height: 350,
      quality: 75
    }, template);
  }
});

Template.browse_library_pictures.events({
  'click button': function (event, template) {
    if (Meteor.isCordova) {
      getSignPicture({
        width: 350,
        height: 350,
        quality: 75,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      }, template);
    } else {
      alert('Cordova only feature.');
    }
  }
});

Template.show_sign_picture.helpers({
  sign_picture: function() {
    return Template.instance().closestInstance("sign_add").sign_picture.get();
  }
});

function getSignPicture(options, template) {
  MeteorCamera.getPicture(options, function(err, data) {
    if (err) {
      console.log('error', err);
    }
    if (data) {
      var parent = template.closestInstance("sign_add");
      parent.sign_picture.set(data);
    }
  });
};

function clearFormData(form, template){
  form.sign_type.value = "";
  form.sign_floor.value = "";
  form.sign_room.value = "";
  form.sign_details.value = "";
  template.sign_picture.set(null);
};