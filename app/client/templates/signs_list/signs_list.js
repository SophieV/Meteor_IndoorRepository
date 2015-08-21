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
      fields: [{
        key: 'signkeynumber',
        label: 'Key Sign Number',
        fn: function (value, object) { return object.type + "_" + object.floor + "_" + object.room; }
    }, 
    {
      key: 'projectName',
      label: "Project Name"
    },
    {
      key: 'type',
      label: "Sign Family"
    },
    {
      key: 'floor',
      label: "Floor"
    },
    {
      key: 'room',
      label: "Room"
    }] 
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
});

Template.signs_list.events({
	'click input.inc': function () {
      Signs.update(Session.get("selected_sign"));
    },
    'click .reactive-table tbody tr': function (event) {
      Session.set("selected_sign", this._id);
    }
});