Projects = new Mongo.Collection("projects");
ProjectSchema = new SimpleSchema({
  id: {
    type: Number,
    label: "ID",
    max: 5,
    autoValue: function() {
      if (this.isInsert)
      {
        return 1;
      }
      else
      {
        this.unset();
      }
    },
    autoform: {
     omit: true
    }
  },
  name: {
    type: String,
    label: "Name",
    max: 200
  },
  createdBy: {
    type: String,
    label: "Created By",
    autoValue: function() {
      if (this.isInsert)
      {
        // TO DO check syntax
        return "Yeah";
      }
      else
      {
        this.unset();
      }
    },
    autoform: {
    	omit: true
    }
  },
  createdOn: {
    type: Date,
    label: "Created On",
    autoValue: function() {
      if (this.isInsert)
      {
        return new Date();
      }
      else
      {
        this.unset();
      }
    },
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