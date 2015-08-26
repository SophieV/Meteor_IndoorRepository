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
                if (Session.get('customGeoPoint') != null) {
                  doc.geoPoint.left = Session.get('customGeoPoint').left;
                  doc.geoPoint.top = Session.get('customGeoPoint').top;
                }

                var parent = Template.instance().closestInstance("sign_add");
                parent.sign_picture.set(null);

                return doc;
            }
        } 
    }
  });

Template.autoformAutocompleteBasic.helpers({
  optsAutocomplete: function() {
    return {
      instid: 'signFamilyAutocomplete',
      // multi: 1,
      // createNew: true,
      // newNamePrefix: '_',
      getPredictions: function(name, params) {
        var ret ={predictions:[]};
        var predictions1 = Signs.find({}, {fields: {type:1}}).fetch();
        ret.predictions = predictions1.map(function(obj) {
          return {
            value: obj,
            name: obj
          }
        });
        return ret;
      },
      // onUpdateVals: function(instid, val, params) {
      //   console.log(instid, val);
      // },
    }
  }
});