Projects = new Mongo.Collection("projects");
ProjectSchema = new SimpleSchema({
  name: {
    type: String,
    unique: true,
    label: "Name",
    max: 200
  },
  createdBy: {
    type: String,
    label: "Created By",
    autoform: {
    	omit: true
    },
    autoValue: function () {
        if (this.isInsert) {
          return Meteor.userId().toString();
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
  description: {
    type: String,
    label: "Brief Description",
    optional: true,
    max: 1000
  },
  floors: {
    type: Array,
    minCount: 1,
    maxCount: 50
   },
   "floors.$": {
      type: Object
  },
  "floors.$.name": {
    type: String
  },
  "floors.$.indoorMap": {
    type: String,
    label: 'Indoor Map with Room Numbers',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'IndoorMaps',
        accept: "image/*"
      }
    }
  },
  "floors.$.indoorMapReporting": {
    type: String,
    label: 'Same Indoor Map without Room Numbers',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'IndoorMaps',
        accept: "image/*"
      }
    }
  },
  "floors.$.width": {
    type: Number,
    label: 'Width (pixel)'
  },
  "floors.$.height": {
    type: Number,
    label: 'Height (pixel)'
  },
  location: {
  		type: Object,
  		// optional: true,
        autoform: {
            type: 'map',
            afFieldInput: {
                    geolocation: false,
                    searchBox: true,
                    autolocate: true
            }
        }
    },
    'location.lat': {
      type: String
    },
    'location.lng': {
      type: String
    }
});
Projects.attachSchema(ProjectSchema);

Projects.allow({
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

SimpleSchema.debug = true;