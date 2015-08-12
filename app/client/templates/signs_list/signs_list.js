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
      fields: ['projectName', 'type', 'floor', 'room'] 
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
  'click #signs2PDF': function (event, template) {
    console.log('generate PDF');

    // var currentRoute = Router.current().route.getName();
    // Router.go('/zip');

  //   var opts = {};

  //   Meteor.call('generatePDF', opts, function (error, result) {
  //   if(error) {
  //     console.log(error.reason);
  //   } else {
  //     window.location = result.url;
  //   }
  // });
  },
  'click #signs2CSV': function (event, template) {
    // export table to Excel
    console.log('starting Export to CSV');

    // var result;
    // Meteor.call('exportAllSigns2CSV',function(e,r){
    //     if(e){
    //         console.log("error from server: "+e);
    //     }else{
    //         console.log("response from server: "+r);
    //         result = r;
    //     }
    // });

    //   console.log('generating zip client side');

    //   var base64ToBlob = function(base64String) {

    //     var byteCharacters = atob(base64String);
    //     var byteNumbers = new Array(byteCharacters.length);
    //     var i = 0;

    //     while (i < byteCharacters.length) {
    //       byteNumbers[i] = byteCharacters.charCodeAt(i);
    //       i++;
    //       byteArray = new Uint8Array(byteNumbers);
    //       return blob = new Blob([byteArray], {type: "zip"});
    //     }
    //   }

    //   blob = base64ToBlob(result);
    //   saveAs(blob, 'signsExport.zip');
  },
	'click input.inc': function () {
      Signs.update(Session.get("selected_sign"));
    },
    'click .reactive-table tbody tr': function (event) {
      Session.set("selected_sign", this._id);
    }
});