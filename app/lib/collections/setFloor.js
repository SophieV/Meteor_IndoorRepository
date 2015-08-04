SetFloorSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 200
  }
});

FloorsSchema = new SimpleSchema({
   floors: {
      type: Array,
      minCount: 1,
      maxCount: 50
   },
   "floors.$": {
      type: String
   }
});