SignFamilies = new Mongo.Collection("signfamilies");
SignFamiliesSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
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
  }
});
SignFamilies.attachSchema(SignFamiliesSchema);

SignFamilies.allow({
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
