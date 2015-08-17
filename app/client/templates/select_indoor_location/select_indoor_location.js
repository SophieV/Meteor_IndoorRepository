Template.select_indoor_location.events({
  'click button': function (event, template) {
    // prevent submitting form
    event.preventDefault();

    if (event.currentTarget.id === 'download_canvas') {
      downloadCanvas('floorDemoCanvas');
    }
  }
});

function downloadCanvas(canvasId) {
  window.open(document.getElementById(canvasId).toDataURL());
}

Template.select_indoor_location.onCreated(function(){
  this.geoCoordinates = new ReactiveVar(null);
  this.indoorMap = null;
});

Template.select_indoor_location.onRendered(function(){
  var self = this;

  self.indoorMap = new FloorCanvasMap();
  self.indoorMap.init('floorDemoCanvas', (Iron.Location.get().path === '/sign-add'?false:true));

  var signsData = Signs.find({}).fetch();
  _.each(signsData, function(sign){
    console.log('adding disabled pin [' + sign.geoPoint.left + ', ' + sign.geoPoint.top + ']' );
    var pinIndex = self.indoorMap.addDisabledPinOnGrid(sign.geoPoint.left, sign.geoPoint.top);
    console.log('pin was added at index ' + pinIndex);
  });

  Signs.find({}).observe({
    added: function (document) {
      if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {
        // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
        self.indoorMap.addDisabledPinOnGrid(document.geoPoint.left, document.geoPoint.top);
      }
    },
    changed: function (newDocument, oldDocument) {
      // for now coordinates cannot be edited
      // and coordinates is the only interesting change to this view
    },
    removed: function (document) {
      if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {
        // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
        self.indoorMap.removePin(document.geoPoint.left, document.geoPoint.top);
      }
    }
  });
});

Template.select_indoor_location.onDestroyed(function(){
  this.indoorMap.destroy();
});