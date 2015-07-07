SetProjectSchema = new SimpleSchema({
  id: {
    type: Number,
    label: "ID",
    max: 200,
    autoform: {
     omit: true
    }
  },
  name: {
    type: String,
    label: "Name",
    max: 200
  }
});