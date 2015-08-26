var timer;

Template.select_indoor_location.helpers({
  optsAutocomplete: function() {
    return {
      instid: 'signFamilyAutocomplete',
      getPredictions: function(name, params) {
        var suggestions ={predictions:[]};
        var signTypes = SignFamilies.find({}).fetch();
        _.each(signTypes, function(signTypeObject){
          // make distinct manually
          var exists = _.filter(suggestions.predictions, function(prediction){return prediction.name.toUpperCase() === signTypeObject.name.toUpperCase();});

          if (exists.length == 0)
          {
            suggestions.predictions.push({
              value: signTypeObject._id,
              name: signTypeObject.name.toUpperCase()
            });
          }
        });
        
        return suggestions;
      }
    }
  },
  isIdentified: function () {
    return Meteor.userId() != null;
  },
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
		return prepareForBootstrapGrid(Session.get('signKeysWithIndex'), 4);
	},
  categoriesWithColor: function() {
    return prepareForBootstrapGrid(Session.get('colouredCategories'), 6);//Template.instance().categories.get(), 6);
  },
  signs: function(){
    return Signs.find({project: Session.get('current_project'), floor: Session.get('current_floor')});
  },
  selectedSign: function(){
    var sign = Signs.findOne(Session.get("selected_sign"));
      return sign;
  },
  settings: function () {
  return {
      collection: Signs.find({project: Session.get('current_project'), floor: Session.get('current_floor')}),
      rowsPerPage: 1000, // we need to always show all since we parse the UI for pin numbers
      showFilter: true,
      showNavigation: 'never',
      fields: 
      [
        {
          fieldId: "signKeyNumber",
          key: 'signkeynumber',
          label: 'Key Sign Number',
          fn: function (value, object) { return object.floor + "_" + object.room + "_" + object._id; }
        },
        {
          fieldId: "pinNumber",
          key: 'pinnumber',
          label: 'Map Pin Number',
          fn: function (value, object) {
            var value;
            var allWithPinNumbers = Session.get('signKeysWithIndex');
            var theOneWithPinNumber = _.filter(allWithPinNumbers, function(oneWithPinNumber){
              return oneWithPinNumber.key === object.floor + "_" + object.room + "_" + object._id;
            });
            if (theOneWithPinNumber.length > 0) {
              value = theOneWithPinNumber[0].pinIndex;
            }
            return value;
          }
        },
        {
          fieldId: "projectName",
          key: 'projectName',
          label: "Project Name"
        },
        {
          fieldId: "typeColor",
          label: "Sign Family",
          fn: function(value, object){
            var colorOfCategory = 'not ready';

              var allCatColoured = Session.get('colouredCategories');

              var colorsOfCategory = _.filter(allCatColoured, function(catCol){
                return catCol.category === object.type.name.toLowerCase();
              });

              if (colorsOfCategory.length > 0) {
                colorOfCategory = colorsOfCategory[0].color;
                colorOfCategory = new Spacebars.SafeString('<span style="background:' + colorOfCategory + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + object.type.name);
              }

              return colorOfCategory;
          }
        },
        {
          // search does not work on fn results
          fieldId: "type",
          key: 'type.name',
          label: "Sign Family",
          hidden: true
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
      if (confirm('Really delete "' + doc.floor + "_" + doc.room + '"?')) {
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
    // event.preventDefault();

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
        Session.set("selected_sign", null);

        var indoorMap = template.indoorMap;
        if (indoorMap != null) {
          if (event.currentTarget.children[0].children[1].value === '')
          {
            indoorMap.toggleShowPins('all');
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
	var signsData = Signs.find({project: Session.get('current_project'), floor: Session.get('current_floor')}).fetch();
	signsData = _.sortBy(signsData, function(sign) {
	  	return sign.type.name;
	});
	_.each(signsData, function(signData, index){
		if (signData.geoPoint.left != null) {
			signIndex++;
      signKeysWithIndex.push({key: signData.floor + "_" + signData.room + "_" + signData._id, pinIndex: signIndex});
			signsWithIndex.push({pinIndex: signIndex, type: signData.type.name, floor: signData.floor, room: signData.room, geoPoint: signData.geoPoint});
		}
	});
  Session.set('signKeysWithIndex', signKeysWithIndex);
	return signsWithIndex;
}

function downloadCanvas(canvasId) {
  window.open(document.getElementById(canvasId).toDataURL());
}

function isReportingMode() {
	return (Iron.Location.get().path === '/sign-add'?false:true);
}

function extractActiveMap() {
  var indoorMap = {};
  console.log('current session is ' + Session.get('current_floor'));
  var projectWithFloors = Projects.find({_id: Session.get('current_project'), "floors.name": Session.get('current_floor')},{fields: {floors: 1}}).fetch();
  
  if (projectWithFloors.length > 0)
  {
    var floors = projectWithFloors[0].floors;

    if (floors.length > 0)
    {
      //find the right floor
      var selectedFloor = _.filter(floors, function(floor){
        return floor.name === Session.get('current_floor');
      });

      if (selectedFloor.length > 0) 
      {
        var indoorMapId;
        if (isReportingMode())
        {
          indoorMapId = selectedFloor[0].indoorMapReporting;
        }
        else
        {
          indoorMapId = selectedFloor[0].indoorMap;
        }

        // console.log('indoor map id ' + indoorMapId);
        var indoorMaps = IndoorMaps.find({_id: indoorMapId}).fetch();

        if (indoorMaps.length > 0)
        {
          indoorMap.width = selectedFloor[0].width;
          indoorMap.height = selectedFloor[0].height;
          indoorMap.map = indoorMaps[0];//.copies.indoorMaps;
        }
      }
    }
  }

  return indoorMap;
}

Template.select_indoor_location.onCreated(function(){
  this.geoCoordinates = new ReactiveVar(null);
  this.indoorMap;// = new ReactiveVar();
  // this.categories = new ReactiveVar();
});

Template.select_indoor_location.onRendered(function(){
  var self = this;

  self.indoorMap = new FloorCanvasMap();

  self.autorun(function(){
    var indoorMapTemp = extractActiveMap();

    if (indoorMapTemp.map != null)
    {
      Session.set("selected_sign", null);

      self.indoorMap.init('floorDemoCanvas', isReportingMode(), indoorMapTemp.map.url(), indoorMapTemp.width, indoorMapTemp.height);

      // var signsData = Signs.find({project: Session.get('current_project'), floor: Session.get('current_floor')}).fetch();

      // signsData = _.sortBy(signsData, function(sign) {
      //   return sign.type;
      // });

      // _.each(signsData, function(sign, index){
      //   if (sign.geoPoint.left != null) {
      //     // console.log('adding disabled pin [' + sign.geoPoint.left + ', ' + sign.geoPoint.top + ']' );

      //     self.indoorMap.addDisabledPinOnGrid(sign.geoPoint.left, sign.geoPoint.top, sign.type);
      //   }
      // });

      // self.categories.set(self.indoorMap.getAllCategories());
      // Session.set('colouredCategories', self.indoorMap.getAllCategories());// self.categories.get());

      // share to session for use in reactive table
      // signsWithPinIndex();
      var signsWithIndex = [];
      var signKeysWithIndex = [];
      var signIndex = 0;

      // should not happen before background map set
      Signs.find({project: Session.get('current_project'), floor: Session.get('current_floor')}).observe({
        added: function (document) {
          if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {

          signIndex++;
          signKeysWithIndex.push({key: document.floor + "_" + document.room + "_" + document._id, pinIndex: signIndex});
          signsWithIndex.push({pinIndex: signIndex, type: document.type.name, floor: document.floor, room: document.room, geoPoint: document.geoPoint});
          Session.set('signKeysWithIndex', signKeysWithIndex);

            // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
            self.indoorMap.addDisabledPinOnGrid(document.geoPoint.left, document.geoPoint.top, document.type.name, signIndex);
            // self.categories.set(self.indoorMap.getAllCategories());
            Session.set('colouredCategories', self.indoorMap.getAllCategories());//self.categories.get());
          }
        },
        changed: function (document, oldDocument) {
          // sign type was changed, which means color has changed too
          // need to redraw the pin
          if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project')) {

            self.indoorMap.changeDisabledPinOnGrid(document.geoPoint.left, document.geoPoint.top, document.type.name);

            Session.set('colouredCategories', self.indoorMap.getAllCategories());
          }
        },
        removed: function (document) {
          if (document.floor === Session.get('current_floor') && document.project === Session.get('current_project'))
          {
              // console.log('adding disabled pin [' + document.geoPoint.left + ', ' + document.geoPoint.top + ']' );
              self.indoorMap.removePin(document.geoPoint.left, document.geoPoint.top);
          }
        }
      });
    }
  });
});