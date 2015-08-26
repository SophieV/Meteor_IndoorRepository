Template.signfamilies_list.helpers({
	signfamilies: function(){
		return SignFamilies.find();
	},
	beforeRemove: function () {
    return function (signFamiliesCollection, id) {
      var doc = signFamiliesCollection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        this.remove();
      }
    };
  },
  makeUniqueID_Name: function () {
    return "update-project-name-" + this._id;
  },
  makeUniqueID_Desc: function () {
    return "update-project-desc-" + this._id;
  }
});