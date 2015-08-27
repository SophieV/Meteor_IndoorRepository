Template.projects_list.helpers({
	projects: function(){
		return Projects.find();
	},
  isIdentified: function () {
    return Meteor.userId() != null;
  },
	beforeRemove: function () {
      return function (projectCollection, id) {
        var doc = projectCollection.findOne(id);
        if (confirm('Really delete "' + doc.name + '"?')) {
          // this.remove();
          Meteor.call('deleteProjectAndAssociatedSigns', id, function (error, result) {
            if (error) {
              alert('failed');
            }
          });
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