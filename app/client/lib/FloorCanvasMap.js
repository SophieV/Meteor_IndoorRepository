FloorCanvasMap = function ()
{
    var self = this;
    self.scaledGridStep = self.GRID_STEP_GRANULARITY = 10;
    self.GRID_DIMENSIONS = 800;
    self.scaleFactorApplied = 1;
    self.currentCanvasScale = 1;
    self.SCALE_MULTIPLYING_FACTOR = 1.2;

    self.floorCanvas;

    self.pinsCount = 0;

    self.selectedPin;
    self.selectedOldScaleX;
    self.selectedOldScaleY;

    self.activePin;

    self.reportingMode = false;

    self.PIN_OBJECT_TYPE = "text";

    self.COLOR_CATEGORY_1 = '#00FF00';
    self.COLOR_CATEGORY_2 = '#FF99FF';
    self.COLOR_CATEGORY_3 = 'red';
    self.COLOR_TEXT_NUMBER = 'white';
    self.COLOR_TEXT_ACTIVE = 'black';
    self.RESERVED_DISABLED_COLOR = '#000';

    self.arrayOfPins = [];

    self.FLOOR1_IMAGE_PATH = 'floor1.png';
}

FloorCanvasMap.prototype.assignCustomIndoorMapUrl = function(imageUrl)
{
    self.FLOOR1_IMAGE_PATH = imageUrl;
}

FloorCanvasMap.prototype.init = function(domDestinationId, usedForReporting)
{
    var self = this;

    self.reportingMode = usedForReporting;

    self.floorCanvas = new fabric.Canvas(domDestinationId, { selection: false, stateful: false });

    // TODO : change image used to external dynamically supplied
    fabric.Image.fromURL(self.FLOOR1_IMAGE_PATH, function(indoorMapImage) {
          
          // the image should react as a background image
          // it is added as an object so that it can get scaled when zoomed in
          indoorMapImage.hasControls = false;
          indoorMapImage.lockMovementX = true;
          indoorMapImage.lockMovementY = true;
          indoorMapImage.selectable = false;

         self.floorCanvas.add(indoorMapImage);
         // otherwise pins added afterwards are not visible because of zIndex
         self.floorCanvas.sendToBack(indoorMapImage);

          self.floorCanvas.setDimensions({
                width: 800,
                height: 800
            });

          // everything else needs to be added AFTER IMAGE else not visible

        // create grid
        // var linesCount = self.GRID_DIMENSIONS / self.GRID_STEP_GRANULARITY;

        // for (var lineIndex = 0; lineIndex < linesCount; lineIndex++) 
        // {
        //     self.floorCanvas.add(new fabric.Line([ lineIndex * self.GRID_STEP_GRANULARITY, 0, lineIndex * self.GRID_STEP_GRANULARITY, self.GRID_DIMENSIONS], { stroke: '#ccc', selectable: false }));

        //     self.floorCanvas.add(new fabric.Line([ 0, lineIndex * self.GRID_STEP_GRANULARITY, self.GRID_DIMENSIONS, lineIndex * self.GRID_STEP_GRANULARITY], { stroke: '#ccc', selectable: false }));
        // }
    });

    // snap to grid
    self.floorCanvas.on('object:moving', function(options) {
        self.movePin(options.target, options.target.left, options.target.top);
    });

    self.floorCanvas.on('object:selected', function(options) {
        if (self.reportingMode)
        {
            // either other pin selected or selection cleared
            // selection:cleared will not happen because floor map will get selected
            self.resetSelectedPin();

            if (options.target.type === self.PIN_OBJECT_TYPE)
            {
                self.selectedPin = options.target;
                self.selectedOldScaleX = self.selectedPin.scaleX;
                self.selectedOldScaleY = self.selectedPin.scaleY;
                self.selectedPin.scaleX = 2;
                self.selectedPin.scaleY = 2;
                self.selectedPin.borderColor = 'blue';
            }
        }
    });

    self.floorCanvas.on('mouse:down', function(options) {
        var cellClickedLeft = Math.trunc(options.e.layerX / self.scaledGridStep) * self.scaledGridStep;
        var cellClickedTop = Math.trunc(options.e.layerY / self.scaledGridStep) * self.scaledGridStep;

        var objectsToDrag = self.getObjectsWithinCell(cellClickedLeft, cellClickedTop);

        var noExistingPinToMove = (objectsToDrag.length === 0);
        if (noExistingPinToMove)
        {
            if (!self.reportingMode)
            {
                if (self.activePin == null)
                {
                    self.addPinOnGrid(cellClickedLeft, cellClickedTop, self.COLOR_CATEGORY_1, self.COLOR_TEXT_ACTIVE);
                }
            }
        }
        else
        {
            if (objectsToDrag[0].fill !== self.RESERVED_DISABLED_COLOR)
            {
                self.changePinColor(objectsToDrag[0], self.COLOR_CATEGORY_3, self.COLOR_TEXT_NUMBER);
            }
        }

        shareGeoPointToSession(cellClickedLeft, cellClickedTop);
    });

    $("#btnZoomIn").click(function(){
        self.zoomIn();
    });

    $("#btnZoomOut").click(function(){
        self.zoomOut();
    });

    $("#btnResetZoom").click(function(){
        self.resetZoom();
    });

    $("#btnShow").click(function(){
        _.each(self.arrayOfPins, function(pin){
            pin.canvasPin.visible = !pin.canvasPin.visible;
        });

        self.floorCanvas.renderAll();
    });
}

function shareGeoPointToSession(leftValue, topValue)
{
    Session.set('customGeoPoint', {left: leftValue, top: topValue});
    console.log('updated customGeoPoint to [' + leftValue + ',' + topValue + ']');
}

FloorCanvasMap.prototype.movePin = function(pin, left, top)
{
    var self = this;
    var gridFittedCoordinates = self.getScaledCellCoordinates(left, top);

    if (gridFittedCoordinates.left < 0)
    {
        gridFittedCoordinates.left = 0;
    }

    if (gridFittedCoordinates.top < 0)
    {
        gridFittedCoordinates.top = 0;
    }

    if ((gridFittedCoordinates.left + self.scaledGridStep) >= self.floorCanvas.width)
    {
        gridFittedCoordinates.left = self.floorCanvas.width - self.scaledGridStep;
    }

    if ((gridFittedCoordinates.top + self.scaledGridStep) >= self.floorCanvas.height)
    {
        gridFittedCoordinates.top = self.floorCanvas.height - self.scaledGridStep;
    }

    var objectsOnDestinationCell = self.getObjectsWithinCell(gridFittedCoordinates.left, gridFittedCoordinates.top);

    if (objectsOnDestinationCell.length === 0)
    {
        pin.set({
            left: gridFittedCoordinates.left,
            top: gridFittedCoordinates.top
        });

        // these are the coordinates that will be saved
        console.log(['pin ', self.getPinId(pin), ' has been dragged to a new location at [', pin.left/self.currentCanvasScale, ',', pin.top/self.currentCanvasScale, '].'].join(''));
        shareGeoPointToSession(pin.left/self.currentCanvasScale, pin.top/self.currentCanvasScale);
    }
    else
    {
        self.movePin(pin, left - self.GRID_STEP_GRANULARITY, top - self.GRID_STEP_GRANULARITY);
    }
}

FloorCanvasMap.prototype.changePinColor = function(pin, color)
{
    var self = this;
    pin.fill = color;
    self.floorCanvas.renderAll();

    console.log(['pin ', self.getPinId(pin), ' has changed color.'].join(''));
}

FloorCanvasMap.prototype.getPinId = function(pinObject)
{
    var self = this;

    var pinId;

    var pinFound = _.filter(self.arrayOfPins, function(entry){
        return entry.canvasPin === pinObject;
    });

    if (pinFound.length > 0)
    {
        pinId = pinFound[0].id;
    }

    return pinId;
}

// for use from Meteor
FloorCanvasMap.prototype.addDisabledPinOnGrid = function(left, top)
{
    var self = this;
    if (left != null && top != null)
    {
        var leftCoordinate = parseInt(left);
        var topCoordinate = parseInt(top);

        //make sure the "active" pin is not there, because the grid cell will become disabled
        // if it is, remove it. the user will need to recreate it.
        if (self.activePin != null && self.activePin.left === leftCoordinate && self.activePin.top === topCoordinate) {
            self.removePin(self.activePin.left, self.activePin.top);
            self.activePin = null;
        }

        self.addPinOnGrid(leftCoordinate, topCoordinate, self.RESERVED_DISABLED_COLOR, self.COLOR_TEXT_NUMBER);
    }
}

// for use from Meteor
FloorCanvasMap.prototype.removePin = function(left, top)
{
    var self = this;
    if (left != null && top != null)
    {
        var matchingPin;
        _.each(self.arrayOfPins, function(existingPin){
            if ((existingPin.left === parseInt(left)) && (existingPin.top === parseInt(top))) {
                matchingPin = existingPin;
            }
        });

        if (matchingPin != null) {
            console.log('Removing pin at [' + matchingPin.left + ', ' + matchingPin.top + ']');
            self.floorCanvas.remove(matchingPin);
        }
    }
}

FloorCanvasMap.prototype.addPinOnGrid = function(left, top, backgroundColor, textColor)
{
    var self = this;

    var lockMovements = false;
    var pinIndex = self.pinsCount;
    var textOfPin = pinIndex.toString();

    if (!self.reportingMode)
    {
        if (backgroundColor === self.RESERVED_DISABLED_COLOR)
        {
            lockMovements = true;  
        }
        else
        {
            textOfPin = "AC";
        }
    }
    else
    {
        // TODO: nice to have, updating coordinates by moving associated pin
        lockMovements = true;
    }

    var pin = new fabric.Text(textOfPin, {
        selectable: false,
        fontSize: 15,
        left: left, 
        top: top, 
        width: self.scaledGridStep, 
        height: self.scaledGridStep, 
        backgroundColor: backgroundColor,
        fill: textColor,
        originX: 'left', 
        originY: 'top',
        hasControls: false,
        hasBorders: false,
        hasRotatingPoint: false,
        lockMovementX: lockMovements,
        lockMovementY: lockMovements,
        selectable: !lockMovements
    });

    self.pinsCount++;

    self.floorCanvas.add(pin);

    self.arrayOfPins.push({id: self.pinsCount, canvasPin: pin});

    console.log(['New pin ', self.pinsCount ,' created at [', left, ',', top, ']'].join(''));

    if (lockMovements)
    {
        console.log(['Pin ', self.pinsCount ,' cannot be moved.'].join(''));
    }
    else
    {
        self.activePin = pin;
    }

    self.floorCanvas.renderAll();

    return pinIndex;
}

FloorCanvasMap.prototype.resetSelectedPin = function()
{
    var self = this;
    console.log('selection cleared');

    if (self.selectedPin != null)
    {
        self.selectedPin.scaleX = self.selectedOldScaleX;
        self.selectedPin.scaleY = self.selectedOldScaleY;
        self.selectedPin = null;
        self.selectedOldScaleX = null;
        self.selectedOldScaleY = null;
    }
}

FloorCanvasMap.prototype.getActivePinCoordinates = function()
{
    var self = this;
    var coordinates;

    if (self.activePin != null)
    {
        coordinates = {};
        coordinates.left = self.activePin.left;
        coordinates.top = self.activePin.top;
    }

    return coordinates;
}

FloorCanvasMap.prototype.zoomIn = function() {
    var self = this;
    self.applyScaleToGridAndObjects(self.SCALE_MULTIPLYING_FACTOR);
}

FloorCanvasMap.prototype.zoomOut = function() {
    var self = this;
    self.applyScaleToGridAndObjects(1/self.SCALE_MULTIPLYING_FACTOR);  
}

FloorCanvasMap.prototype.resetZoom = function() {
    var self = this;
    self.applyScaleToGridAndObjects(1/self.currentCanvasScale);

    self.currentCanvasScale = 1;
    self.scaleFactorApplied = 1;
}

FloorCanvasMap.prototype.applyScaleToGridAndObjects = function(scaleValue)
{
    var self = this;
    self.scaleFactorApplied = scaleValue;
    self.currentCanvasScale = self.currentCanvasScale * scaleValue;
    console.log('current canvas scale is '+ self.currentCanvasScale);
    self.scaledGridStep = self.scaledGridStep * scaleValue;
    console.log('current grid cell scaled is '+ self.scaledGridStep);

    self.floorCanvas.setHeight(self.floorCanvas.getHeight() * scaleValue);
    self.floorCanvas.setWidth(self.floorCanvas.getWidth() * scaleValue);
    
    var objectsOnCanvas = self.floorCanvas.getObjects();

    _.each(objectsOnCanvas, function(object){

        object.scaleX = object.scaleX * scaleValue;
        object.scaleY = object.scaleY * scaleValue;
        object.left = object.left * scaleValue;
        object.top = object.top * scaleValue;

        object.setCoords();
    });
        
    self.floorCanvas.renderAll();
}

FloorCanvasMap.prototype.getScaledCellCoordinates = function(left, top)
{
    var self = this;
    var squaredCoordinates = {};
    squaredCoordinates.left = Math.ceil(left / self.scaledGridStep) * self.scaledGridStep;
    squaredCoordinates.top = Math.ceil(top / self.scaledGridStep) * self.scaledGridStep;
    return squaredCoordinates;
}

FloorCanvasMap.prototype.getObjectsWithinCell = function(left, top)
{
    var self = this;
    var objectsOnCanvas = self.floorCanvas.getObjects();

    // because we're working on a grid, no need to use a rectangle to find existing objects
    var objectsWithinCell = _.filter(objectsOnCanvas, function(object){
        return (object.type === self.PIN_OBJECT_TYPE && Math.ceil(object.left) === Math.ceil(left) && Math.ceil(object.top) === Math.ceil(top));
    });

    return objectsWithinCell;
}

FloorCanvasMap.prototype.destroy = function()
{
    var self = this;
    self.floorCanvas.clear();
    self.floorCanvas = null;
}