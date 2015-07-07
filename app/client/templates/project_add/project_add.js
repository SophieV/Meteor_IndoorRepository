/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.project_add.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.project_add.created = function () {
};

Template.project_add.rendered = function () {
};

Template.project_add.destroyed = function () {
};

AutoForm.hooks({
  insertProjectForm: {
    onSubmit: function (doc) {
      ProjectSchema.clean(doc);
      console.log("Project doc with auto values", doc);
      this.done();
      return false;
    }
  }
});
