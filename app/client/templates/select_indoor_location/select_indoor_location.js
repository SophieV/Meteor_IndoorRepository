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
		return prepareForBootstrapGrid(signsWithPinIndex(), 4);
	},
  categoriesWithColor: function() {
    return prepareForBootstrapGrid(Template.instance().categories.get(), 6);
  }
});

function prepareForBootstrapGrid(data, colCount) {
  var all = data;
    var chunks = [];
    var size = colCount;
    while (all.length > size) {
        chunks.push({ row: all.slice(0, size)});
        all = all.slice(size);
    }
    chunks.push({row: all});
    return chunks;
}

Template.select_indoor_location.events({
  'click button': function (event, template) {
    // prevent submitting form
    event.preventDefault();

    if (event.currentTarget.id === 'download_canvas') {
      downloadCanvas('floorDemoCanvas');
    }
  },
  'click input': function(event, template) {
    template.indoorMap.toggleShowPinsOfCategory(event.currentTarget.name);
  }
});

function signsWithPinIndex() {
	var signsWithIndex = [];
  var signKeysWithIndex = [];
	var signIndex = 0;
	var signsData = Signs.find().fetch();
	signsData = _.sortBy(signsData, function(sign) {
	  	return sign.type;
	});
	_.each(signsData, function(signData, index){
		if (signData.geoPoint.left != null) {
			signIndex++;
      signKeysWithIndex.push({key: signData.type + "_" + signData.floor + "_" + signData.room, pinIndex: signIndex});
			signsWithIndex.push({pinIndex: signIndex, type: signData.type, floor: signData.floor, room: signData.room, geoPoint: signData.geoPoint});
		}
	});
  Session.set('signKeysWithIndex', signKeysWithIndex);
  console.log('session set signKeysWithIndex' + signKeysWithIndex);
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
  this.categories = new ReactiveVar();
});

Template.select_indoor_location.onRendered(function(){
  var self = this;

  self.indoorMap = new FloorCanvasMap('floor1.png');
  self.indoorMap.init('floorDemoCanvas', isReportingMode());

  var signsData = Signs.find({}).fetch();
  signsData = _.sortBy(signsData, function(sign) {
  	return sign.type;
  });
  _.each(signsData, function(sign, index){
  	if (sign.geoPoint.left != null) {
	    // console.log('adding disabled pin [' + sign.geoPoint.left + ', ' + sign.geoPoint.top + ']' );
	    // console.log('pin will be added at index ' + index);
	    self.indoorMap.addDisabledPinOnGrid(sign.geoPoint.left, sign.geoPoint.top, sign.type);
	}
  });

  self.categories.set(self.indoorMap.getAllCategories());

  Signs.find({}).observe({
    added: function (document) {
      if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {
        // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
        self.indoorMap.addDisabledPinOnGrid(document.geoPoint.left, document.geoPoint.top, document.type);
        self.categories.set(self.indoorMap.getAllCategories());
      }
    },
    changed: function (newDocument, oldDocument) {
      // maybe the sign type was changed
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