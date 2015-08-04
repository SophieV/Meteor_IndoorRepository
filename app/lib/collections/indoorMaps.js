IndoorMaps = new FS.Collection("indoorMaps", {
  stores: [new FS.Store.GridFS("indoorMaps", {path: "~/uploads"})]
});

IndoorMaps.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  download: function(userId) {
    return true;
  }
});