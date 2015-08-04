Template.signs_list.helpers({
	signs: function(){
		return Signs.find();
	},
	selectedSign: function(){
		var sign = Signs.findOne(Session.get("selected_sign"));
    	return sign;
	}
});

Template.signs_list.events({
	'click input.inc': function () {
      Signs.update(Session.get("selected_sign"));
    }
});

Template.sign_info.helpers({
	selected: function () {
	    return Session.equals("selected_sign", this._id) ? "selected" : '';
	},
	beforeRemove: function () {
      return function (collection, id) {
        var doc = collection.findOne(id);
        if (confirm('Really delete "' + doc.type + "_" + doc.floor + "_" + doc.room + '"?')) {
          this.remove();
        }
      };
    },
});

Template.sign_info.events({
    'click': function () {
      Session.set("selected_sign", this._id);
    }
});