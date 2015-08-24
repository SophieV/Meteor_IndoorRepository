// custom input templates for autoform
AutoForm.addInputType("takePicture", {
  template: "show_sign_picture"
});
AutoForm.addInputType("selectIndoorLocation", {
  template: "select_indoor_location"
});

Template.sign_add.helpers({
  activeFloor: function(){
    return Session.get('current_floor');
  },
  activeIndoorMap: function(){
    var indoorMap;
      console.log('current session is ' + Session.get('current_floor'));
    var projectWithFloors = Projects.find({_id: Session.get('current_project'), "floors.name": Session.get('current_floor')},{fields: {floors: 1}}).fetch();
    if (projectWithFloors.length > 0) {
      var floors = projectWithFloors[0].floors;
      if (floors.length > 0)
      {
        //find the right floor
        var selectedFloor = _.filter(floors, function(floor){
          return floor.name === Session.get('current_floor');
        });

        if (selectedFloor.length > 0) {
          var indoorMapId = selectedFloor[0].indoorMap;
          // console.log('indoor map id ' + indoorMapId);
          var indoorMaps = IndoorMaps.find({_id: indoorMapId}).fetch();
          if (indoorMaps.length > 0) {
            indoorMap = indoorMaps[0];//.copies.indoorMaps;
          }
        }
       }
      return indoorMap;
    }
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
});

Template.take_camera_picture.events({
  'click button': function (event, template) {
    // prevent submitting form
    event.preventDefault();
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
}

AutoForm.hooks({
    insertSignForm: {
        before: {
            insert: function(doc) {
                //do something
                console.log('before hook');
                doc.project = Session.get('current_project');
                doc.projectName = Session.get('current_project_name');
                doc.floor = Session.get('current_floor');
                doc.geoPoint = {};
                doc.geoPoint.left = Session.get('customGeoPoint').left;
                doc.geoPoint.top = Session.get('customGeoPoint').top;
                return doc;
            }
        } 
    }
  });