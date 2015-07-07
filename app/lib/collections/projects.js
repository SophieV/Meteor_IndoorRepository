Projects = new Mongo.Collection("projects");
ProjectSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Name",
    max: 200
  },
  createdBy: {
    type: String,
    label: "Created By",
    autoform: {
    	omit: true
    }
  },
  createdOn: {
    type: Date,
    label: "Created On",
    autoform: {
    	omit: true
    }
  },
  description: {
    type: String,
    label: "Brief description",
    optional: true,
    max: 1000
  },
  location: {
  		type: Object,
  		optional: true,
        autoform: {
            type: 'map',
            afFieldInput: {
                    geolocation: true,
                    searchBox: true,
                    autolocate: true
            }
        }
    }
});
Projects.attachSchema(ProjectSchema);