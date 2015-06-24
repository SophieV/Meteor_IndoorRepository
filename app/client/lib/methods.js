// extend Blaze.View prototype to mimick jQuery's closest for views
_.extend(Blaze.View.prototype,{
    closest:function(viewName){
        var view=this;
        while(view){
            if(view.name=="Template."+viewName){
                return view;
            }
            view=view.parentView;
        }
        return null;
    }
});

// extend Blaze.TemplateInstance to expose added Blaze.View functionalities
_.extend(Blaze.TemplateInstance.prototype,{
    closestInstance:function(viewName){
        var view=this.view.closest(viewName);
        return view?view.templateInstance():null;
    }
});