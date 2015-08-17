Template.select_indoor_location.helpers({
	reportingMode: function () {
		return isReportingMode();
	},
	currentProject: function(){
		return Session.get('current_project_name');
	},
	activeFloor: function(){
	    return Session.get('current_floor');
	},
	signs: function() {
		return signsWithPinIndex();
	}
});

Template.select_indoor_location.events({
  'click button': function (event, template) {
    // prevent submitting form
    event.preventDefault();

    if (event.currentTarget.id === 'download_canvas') {
      downloadCanvas('floorDemoCanvas');
    }
  }
});

function signsWithPinIndex() {
	var signsWithIndex = [];
	var signIndex = 0;
	var signsData = Signs.find().fetch();
	signsData = _.sortBy(signsData, function(sign) {
	  	return sign.type;
	});
	_.each(signsData, function(signData, index){
		if (signData.geoPoint.left != null) {
			signIndex++;
			signsWithIndex.push({pinIndex: signIndex, type: signData.type, floor: signData.floor, room: signData.room, geoPoint: signData.geoPoint});
		}
	});
	return signsWithIndex;
}

function downloadCanvas(canvasId) {
  window.open(document.getElementById(canvasId).toDataURL());
}

function isReportingMode() {
	return (Iron.Location.get().path === '/sign-add'?false:true);
}

Template.select_indoor_location.onCreated(function(){
  this.geoCoordinates = new ReactiveVar(null);
  this.indoorMap = null;
});

Template.select_indoor_location.onRendered(function(){
  var self = this;

  self.indoorMap = new FloorCanvasMap();
  self.indoorMap.init('floorDemoCanvas', isReportingMode());

  var signsData = Signs.find({}).fetch();
  signsData = _.sortBy(signsData, function(sign) {
  	return sign.type;
  });
  _.each(signsData, function(sign, index){
  	if (sign.geoPoint.left != null) {
	    // console.log('adding disabled pin [' + sign.geoPoint.left + ', ' + sign.geoPoint.top + ']' );
	    // console.log('pin will be added at index ' + index);
	    self.indoorMap.addDisabledPinOnGrid(sign.geoPoint.left, sign.geoPoint.top);
	}
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