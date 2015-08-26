Signs = new Mongo.Collection("signs");
SignSchema = new SimpleSchema({
	image: {
    type: String,
    label: 'Sign Picture',
    autoform: {
      afFieldInput: {
        type: 'takePicture'
      }
    }
  },
  type: {
    type: Object,
    label: "Sign Family"
  },
  "type.name": {
    type: String
  },
  project: {
    type: String,
    label: "Project Id",
    max: 200,
    autoform: {
      omit: true
    }
  },
  projectName: {
    type: String,
    label: "Project Name",
    max: 200,
    autoform: {
    	omit: true
    }
  },
  floor: {
    type: String,
    label: "Floor",
    max: 200,
    autoform: {
    	omit: true
    }
  },
  room: {
    type: String,
    label: "Room",
    max: 200
  },
  details: {
    type: String,
    label: "Details",
    max: 500
  },
  createdBy: {
    type: String,
    label: "Created By",
    autoform: {
    	omit: true
    },
    autoValue: function () {
        if (this.isInsert) {
          return Meteor.user().emails[0].address;
        } else {
          this.unset();
        }
    }
  },
  createdOn: {
    type: Date,
    label: "Created On",
    autoform: {
    	omit: true
    },
    autoValue: function () {
        if (this.isInsert) {
          return new Date;
        } else {
          this.unset();
        }
    }
  },
  geoPoint: {
		type: Object,
		label: "Indoor Location",
		autoform: {
          type: 'selectIndoorLocation'
      }
  },
  'geoPoint.left': {
    type: String
  },
  'geoPoint.top': {
    type: String
  }
});
Signs.attachSchema(SignSchema);

Signs.allow({
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
