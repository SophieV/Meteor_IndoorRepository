var timer;
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
	signsInRows: function() {
		return prepareForBootstrapGrid(signsWithPinIndex(), 4);
	},
  categoriesWithColor: function() {
    return prepareForBootstrapGrid(Template.instance().categories.get(), 6);
  },
  // activeIndoorMap: function(){
  //   var indoorMap;
  //     console.log('current session is ' + Session.get('current_floor'));
  //   var projectWithFloors = Projects.find({_id: Session.get('current_project'), "floors.name": Session.get('current_floor')},{fields: {floors: 1}}).fetch();
  //   if (projectWithFloors.length > 0) {
  //     var floors = projectWithFloors[0].floors;
  //     if (floors.length > 0)
  //     {
  //       //find the right floor
  //       var selectedFloor = _.filter(floors, function(floor){
  //         return floor.name === Session.get('current_floor');
  //       });

  //       if (selectedFloor.length > 0) {
  //         var indoorMapId = selectedFloor[0].indoorMap;
  //         // console.log('indoor map id ' + indoorMapId);
  //         var indoorMaps = IndoorMaps.find({_id: indoorMapId}).fetch();
  //         if (indoorMaps.length > 0) {
  //           indoorMap = indoorMaps[0];//.copies.indoorMaps;
  //         }
  //       }
  //      }
  //     return indoorMap;
  //   }
  // },
  // indoorMapInstance: function() {
  //   return Template.instance().indoorMap.get();
  // },
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
      rowsPerPage: 1000, // we need to always show all since we parse the UI for pin numbers
      showFilter: true,
      showNavigation: 'never',
      fields: 
      [
        {
          fieldId: "signKeyNumber",
          key: 'signkeynumber',
          label: 'Key Sign Number',
          fn: function (value, object) { return object.type + "_" + object.floor + "_" + object.room; }
        },
        {
          fieldId: "pinNumber",
          key: 'pinnumber',
          label: 'Map Pin Number',
          fn: function (value, object) {
            var allWithPinNumbers = Session.get('signKeysWithIndex');
            var theOneWithPinNumber = _.filter(allWithPinNumbers, function(oneWithPinNumber){
              return oneWithPinNumber.key === object.type + "_" + object.floor + "_" + object.room;
            });
            return theOneWithPinNumber[0].pinIndex;
          }
        },
        {
          fieldId: "projectName",
          key: 'projectName',
          label: "Project Name"
        },
        {
          fieldId: "type",
          key: 'type',
          label: "Sign Family",
          fn: function (value, object) {
            var allCatColoured = Session.get('colouredCategories'); //Template.instance().categories.get();

            var colorOfCategory = _.filter(allCatColoured, function(catCol){
              return catCol.category === oneWithPinNumber.type.toLowerCase();
            });

            var bgColor;
            if (colorOfCategory.length > 0) {
              bgColor = colorOfCategory[0].color;
            }

            return  new Spacebars.SafeString('<span style="background:' + bgColor + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>' + object.type);
          }
        },
        {
          fieldId: "floor",
          key: 'floor',
          label: "Floor"
        },
        {
          fieldId: "room",
          key: 'room',
          label: "Room"
        }
      ] 
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

function prepareForBootstrapGrid(data, colCount) {
  var all = data;
    var chunks = [];
    var size = colCount;

    if (data != null) {
      while (all.length > size) {
        chunks.push({ row: all.slice(0, size)});
        all = all.slice(size);
      }
      chunks.push({row: all});
    }

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
    // template.indoorMap.get().toggleShowPinsOfCategory(event.currentTarget.name);
  },
  'click input.inc': function (event, template) {
      Signs.update(Session.get("selected_sign"));
    },
    'click .reactive-table tbody tr': function (event) {
      Session.set("selected_sign", this._id);
    },
    'keyup .reactive-table-filter': function(event, template) {
      if(timer) {
             clearTimeout(timer);
         };

      // the time out is used to debounce. making sure the filtering of data has been processed before we query the visible pins.
      timer = setTimeout(function() {
    // Will only execute 300ms after the last keypress.
    var indoorMap = template.indoorMap.get();
        if (indoorMap != null) {
          if (event.currentTarget.children[0].children[1].value === '')
          {
            indoorMap.toggleShowPins();
          }
          else
          {
            var allVisiblePinNumbersElements = $('td.pinnumber');
            var allVisiblePinNumbers = [];
            _.each(allVisiblePinNumbersElements, function(element){
              allVisiblePinNumbers.push(parseInt(element.innerHTML));
            });
            
            indoorMap.toggleShowPins(allVisiblePinNumbers);
          }
        }  
}, 300);
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
  this.indoorMap = new ReactiveVar();
  this.categories = new ReactiveVar();
  this.activeIndoorMap = new ReactiveVar();
});

Template.select_indoor_location.onRendered(function(){
  var self = this;

  self.autorun(function(){
    self.activeIndoorMap.set(function(){
    var indoorMap;
      console.log('current session is ' + Session.get('current_floor'));
    var projectWithFloors = Projects.find({_id: Session.get('current_project'), "floors.name": Session.get('current_floor')},{fields: {floors: 1}}).fetch();
    if (projectWithFloors.length > 0) {
      var floors = projectWithFloors[0].floors;
      if (floors.length > 0)
      {
        //find the right floor
        var selectedFloor = _.filter(floors, function(floor){
          return floor.name === Session.get('current_floor');
        });

        if (selectedFloor.length > 0) {
          var indoorMapId = selectedFloor[0].indoorMap;
          // console.log('indoor map id ' + indoorMapId);
          var indoorMaps = IndoorMaps.find({_id: indoorMapId}).fetch();
          if (indoorMaps.length > 0) {
            indoorMap = indoorMaps[0];//.copies.indoorMaps;
          }
        }
       }
      return indoorMap;
    }
  }());

  self.indoorMap.set(new FloorCanvasMap(self.activeIndoorMap.get().url()));
  self.indoorMap.get().init('floorDemoCanvas', isReportingMode());

  var signsData = Signs.find({}).fetch();
  signsData = _.sortBy(signsData, function(sign) {
    return sign.type;
  });
  _.each(signsData, function(sign, index){
    if (sign.geoPoint.left != null) {
      // console.log('adding disabled pin [' + sign.geoPoint.left + ', ' + sign.geoPoint.top + ']' );
      // console.log('pin will be added at index ' + index);
      self.indoorMap.get().addDisabledPinOnGrid(sign.geoPoint.left, sign.geoPoint.top, sign.type);
  }
  });

  self.categories.set(self.indoorMap.get().getAllCategories());
  Session.set('colouredCategories', self.categories.get());
  });

  

  Signs.find({}).observe({
    added: function (document) {
      if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {
        // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
        self.indoorMap.get().addDisabledPinOnGrid(document.geoPoint.left, document.geoPoint.top, document.type);
        self.categories.set(self.indoorMap.get().getAllCategories());
        Session.set('colouredCategories', self.categories.get());
      }
    },
    changed: function (newDocument, oldDocument) {
      // maybe the sign type was changed
    },
    removed: function (document) {
      if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {
        // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
        self.indoorMap.get().removePin(document.geoPoint.left, document.geoPoint.top);
      }
    }
  });
});

Template.select_indoor_location.onDestroyed(function(){
  this.indoorMap.get().destroy();
});