Template.signs_list.helpers({
	signs: function(){
		return Signs.find();
	},
	selectedSign: function(){
		var sign = Signs.findOne(Session.get("selected_sign"));
    	return sign;
	},
  settings: function () {
  return {
      collection: Signs,
      rowsPerPage: 10,
      showFilter: true,
      fields: ['type', 'floor', 'room'] 
    }
  },
  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.type + "_" + doc.floor + "_" + doc.room + '"?')) {
        this.remove();
      }
    };
  }
  // selected: function () {
  //   return Session.equals("selected_sign", this._id) ? "selected" : '';
  // }
});

Template.signs_list.events({
	'click input.inc': function () {
      Signs.update(Session.get("selected_sign"));
    },
    'click .reactive-table tbody tr': function (event) {
      Session.set("selected_sign", this._id);
    }
});