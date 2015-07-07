Signs = new Mongo.Collection("signs");
SignsSchema = new SimpleSchema({
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
  type: {
    type: Number,
    label: "Type",
    max: 5
  },
  floor: {
    type: Number,
    label: "Floor",
    max: 5
  },
  room: {
    type: Number,
    label: "Room",
    max: 5
  },
  image: {
    type: String,
    label: "Picture",
    max: 1000
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
  details: {
    type: String,
    label: "Notes",
    optional: true,
    max: 2000
  },
  location: {
  		type: Object
     },
  location.left: {
  	type: Number
  },
  location.top: {
  	type: Number
  }
});
Signs.attachSchema(SignsSchema);