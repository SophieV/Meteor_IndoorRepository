Floors = new Mongo.Collection("floors");
FloorsSchema = new SimpleSchema({
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
  indoorMap: {
  	type: String,
  	label: "Indoor Plan"
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
  }
});
Floors.attachSchema(FloorsSchema);