Template.projects_list.helpers({
	projects: function(){
		return Projects.find();
	},
	beforeRemove: function () {
      return function (collection, id) {
        var doc = collection.findOne(id);
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