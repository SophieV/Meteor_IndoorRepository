FloorCanvasMap = function ()
{
    var self = this;
    self.currentBackgroundImage = null;

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

    self.PIN_OBJECT_TEXT_TYPE = "text";
    self.PIN_OBJECT_RECT_TYPE = "rect";

    self.COLOR_CATEGORY_1 = '#00FF00';
    self.COLOR_CATEGORY_2 = '#FF99FF';
    self.COLOR_CATEGORY_3 = 'red';
    self.COLOR_TEXT_NUMBER = 'white';
    self.COLOR_TEXT_ACTIVE = 'black';
    self.RESERVED_DISABLED_COLOR = '#000';

    self.arrayOfPins = [];

    self.COLORS = {
        // aqua: "#00ffff",
        // azure: "#f0ffff",
        // beige: "#f5f5dc",
        black: "#000000",
        blue: "#0000ff",
        brown: "#a52a2a",
        // cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgrey: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkviolet: "#9400d3",
        fuchsia: "#ff00ff",
        // gold: "#ffd700",
        green: "#008000",
        // indigo: "#4b0082",
        // khaki: "#f0e68c",
        // lightblue: "#add8e6",
        // lightcyan: "#e0ffff",
        // lightgreen: "#90ee90",
        // lightgrey: "#d3d3d3",
        // lightpink: "#ffb6c1",
        // lightyellow: "#ffffe0",
        lime: "#00ff00",
        magenta: "#ff00ff",
        // maroon: "#800000",
        // navy: "#000080",
        olive: "#808000",
        orange: "#ffa500",
        pink: "#ffc0cb",
        purple: "#800080",
        // violet: "#800080",
        red: "#ff0000",
        // silver: "#c0c0c0",
        // white: "#ffffff",
        // yellow: "#ffff00"
    };

    self.DEFAULT_CATEGORY = 'unknown';

    // expecting object content {category: catName, color: colorCode}
    self.categoriesWithColor = [];

    self.pinsByCategory = [];
    self.pinsByCategory[self.DEFAULT_CATEGORY] = [];

    self.imageWidth = null;
    self.imageHeight = null;
}

function randomColor(colorsSet) {
    var result;
    var count = 0;

    for (var prop in colorsSet)
        if (Math.random() < 1/++count)
           result = prop;
       
    return { name: result, rgb: colorsSet[result]};
};

FloorCanvasMap.prototype.init = function(domDestinationId, usedForReporting, imageUrl, width, height)
{
    var self = this;

    if (imageUrl != null && imageUrl != '')
    {
        console.log('image url ' + imageUrl);
        var firstRun = (self.floorCanvas == null);

        if (width != null && height != null)
        {
            self.imageWidth = width;
            self.imageHeight = height;
        }

        if (firstRun)
        {
            self.floorCanvas = new fabric.Canvas(domDestinationId, { selection: false, stateful: false });
        }

        self.reportingMode = usedForReporting;

        if (self.currentBackgroundImage != null) {
            
            self.floorCanvas.remove(self.currentBackgroundImage);
            self.currentBackgroundImage = null;
            // self.floorCanvas.remove(self.activePin);
            _.each(self.arrayOfPins, function(singlePin){
                self.floorCanvas.remove(singlePin.canvasPin);
            });
            self.arrayOfPins = [];
            //_.without(self.arrayOfPins, self.activePin);
            // self.pinsCount--;
            self.pinsCount = 0;
            self.activePin = null;
            self.pinsByCategory = [];
            self.pinsByCategory[self.DEFAULT_CATEGORY] = [];
            self.categoriesWithColor = [];

            self.floorCanvas.renderAll();
        }

        fabric.Image.fromURL(imageUrl, function(indoorMapImage) {

            self.currentBackgroundImage = indoorMapImage;

            if (self.imageWidth != null && self.imageHeight != null) {
                self.floorCanvas.setDimensions({
                    width: self.imageWidth,
                    height: self.imageHeight
                });
             }
             else
             {
                self.floorCanvas.setDimensions({
                    width: self.GRID_DIMENSIONS,
                    height: self.GRID_DIMENSIONS
                });
             }

             self.floorCanvas.renderAll();
              
            // the image should react as a background image
            // it is added as an object so that it can get scaled when zoomed in
            indoorMapImage.hasControls = false;
            indoorMapImage.lockMovementX = true;
            indoorMapImage.lockMovementY = true;
            indoorMapImage.selectable = false;

             self.floorCanvas.add(indoorMapImage);
             // otherwise pins added afterwards are not visible because of zIndex
             self.floorCanvas.sendToBack(indoorMapImage);

             self.floorCanvas.renderAll();

              // everything else needs to be added AFTER IMAGE else not visible

            // create grid
            // var linesCount = self.GRID_DIMENSIONS / self.GRID_STEP_GRANULARITY;

            // for (var lineIndex = 0; lineIndex < linesCount; lineIndex++) 
            // {
            //     self.floorCanvas.add(new fabric.Line([ lineIndex * self.GRID_STEP_GRANULARITY, 0, lineIndex * self.GRID_STEP_GRANULARITY, self.GRID_DIMENSIONS], { stroke: '#ccc', selectable: false }));

            //     self.floorCanvas.add(new fabric.Line([ 0, lineIndex * self.GRID_STEP_GRANULARITY, self.GRID_DIMENSIONS, lineIndex * self.GRID_STEP_GRANULARITY], { stroke: '#ccc', selectable: false }));
            // }
        });

        if (firstRun)
        {
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

                    if (options.target.type === self.PIN_OBJECT_TEXT_TYPE)
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
                            self.addPinOnGrid(true, null, cellClickedLeft, cellClickedTop, self.COLOR_CATEGORY_1, self.COLOR_TEXT_ACTIVE);
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

            });
        }

        self.floorCanvas.renderAll();

    }
}

FloorCanvasMap.prototype.restoreActivePin = function(left, top)
{
    if (self.activePin == null) {
        self.addPinOnGrid(true, null, left, top, self.COLOR_CATEGORY_1, self.COLOR_TEXT_ACTIVE);
    }
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

FloorCanvasMap.prototype.changePinBackgroundColor = function(pin, color)
{
    var self = this;
    pin.backgroundColor = color;
    self.floorCanvas.renderAll();
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

FloorCanvasMap.prototype.changeDisabledPinOnGrid = function(left, top, category)
{
    var self = this;

    var leftCoor = parseInt(left);
    var topCoor = parseInt(top);

    var existingPin = _.filter(self.arrayOfPins, function(pin){
        return pin.canvasPin.left === leftCoor && pin.canvasPin.top === topCoor;
    });

    if (left != null && top != null && existingPin.length > 0 && self.floorCanvas != null)
    {
        var colorUsed;
        var categoryName;
        // var currentPinNumber = existingPin[0].
        // self.floorCanvas.remove(existingPin[0].canvasPin);

        if (category == null) {
            categoryName = self.DEFAULT_CATEGORY;
            colorUsed = self.RESERVED_DISABLED_COLOR;
        }
        else
        {
            categoryName = category.toLowerCase();

            var existingCategory = _.filter(self.categoriesWithColor, function(coloredCategory){
                return coloredCategory.category === categoryName;
            });

            if(existingCategory.length > 0) {
                colorUsed = existingCategory[0].color;
            }
            else
            {
                categoryName = category.toLowerCase();
                var randomColorResult = randomColor(self.COLORS);
                var categoryColor = randomColorResult.rgb;
                // avoid duplicated colors
                delete self.COLORS[randomColorResult.name];
                colorUsed = categoryColor;
                console.log('added category ' + categoryName + ' with color ' + categoryColor);
                self.categoriesWithColor.push({category: categoryName, color: categoryColor});
                self.pinsByCategory[categoryName] = [];
            }
        }

        self.changePinBackgroundColor(existingPin[0].canvasPin, colorUsed);
    }
}

FloorCanvasMap.prototype.addDisabledPinOnGrid = function(left, top, category, pinIndex)
{
    var self = this;
    var colorUsed;
    var categoryName;

    // don't add twice ; pins location are unique by design
    if (left != null && top != null && _.filter(self.arrayOfPins, function(pin){return pin.left === left && pin.top === top}).length === 0)
    {
        if (category == null) {
            categoryName = self.DEFAULT_CATEGORY;
            colorUsed = self.RESERVED_DISABLED_COLOR;
        }
        else
        {
            categoryName = category.toLowerCase();

            var existingCategory = _.filter(self.categoriesWithColor, function(coloredCategory){
                return coloredCategory.category === categoryName;
            });

            if(existingCategory.length > 0) {
                colorUsed = existingCategory[0].color;
            }
            else
            {
                categoryName = category.toLowerCase();
                var randomColorResult = randomColor(self.COLORS);
                var categoryColor = randomColorResult.rgb;
                // avoid duplicated colors
                delete self.COLORS[randomColorResult.name];
                colorUsed = categoryColor;
                console.log('added category ' + categoryName + ' with color ' + categoryColor);
                self.categoriesWithColor.push({category: categoryName, color: categoryColor});
                self.pinsByCategory[categoryName] = [];
            }
        }

        var leftCoordinate = parseInt(left);
        var topCoordinate = parseInt(top);

        //make sure the "active" pin is not there, because the grid cell will become disabled
        // if it is, remove it. the user will need to recreate it.
        if (self.activePin != null && self.activePin.left === leftCoordinate && self.activePin.top === topCoordinate) {
            self.removePin(self.activePin.left, self.activePin.top);
            self.activePin = null;
        }

        self.addPinOnGrid(false, categoryName, leftCoordinate, topCoordinate, colorUsed, self.COLOR_TEXT_NUMBER, pinIndex);
    }
}

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

FloorCanvasMap.prototype.getAllCategories = function()
{
    var self = this;
    return self.categoriesWithColor;
}

FloorCanvasMap.prototype.toggleShowPins = function(arrayOfPinNumbers)
{
    var self = this;

    if(self.arrayOfPins != null && self.arrayOfPins.length > 0)
    {
        if (arrayOfPinNumbers != null && arrayOfPinNumbers === 'all')
        {
            // reset
            _.each(self.arrayOfPins, function(pin){
                pin.canvasPin.visible = true;
            });
        } 
        else if (arrayOfPinNumbers != null && arrayOfPinNumbers.length > 0) 
        {
            _.each(self.arrayOfPins, function(pin){
                var shouldBeVisible = _.contains(arrayOfPinNumbers, pin.id);
                pin.canvasPin.visible = shouldBeVisible;
            });
        }
        else
        {
            // none can be seen
            _.each(self.arrayOfPins, function(pin){
                pin.canvasPin.visible = false;
            });
        }
    } else {
        console.log('problem : array of pins is empty !!');
    }

    self.floorCanvas.renderAll();
}

FloorCanvasMap.prototype.toggleShowPinsOfCategory = function(categoryName)
{
    var self = this;

    if (categoryName != null && categoryName !== '') {
        var allPinsOfCategory = self.pinsByCategory[categoryName];
        if (allPinsOfCategory.length > 0) {
            _.each(allPinsOfCategory, function(pin){
                pin.visible = !pin.visible;
            });
        }

        self.floorCanvas.renderAll();
    }
}

FloorCanvasMap.prototype.addPinOnGrid = function(isActive, categoryName, left, top, backgroundColor, textColor, pinIndex)
{
    var self = this;

    var lockMovements = false;

    if (!self.reportingMode)
    {
        if (!isActive)
        {
            self.pinsCount++;
            lockMovements = true;
            var textOfPin = pinIndex.toString();
        }
        else
        {
            textOfPin = "AC";
        }
    }
    else
    {
        // TODO: nice to have, updating coordinates by moving associated pin
        self.pinsCount++;
        lockMovements = true;
        var textOfPin = pinIndex.toString();
    }

    var pin = new fabric.Text(textOfPin, {
        selectable: false,
        fontSize: 8, // if the font size is too big, the grid gets broken
        left: left, 
        top: top, 
        width: self.scaledGridStep, 
        height: self.scaledGridStep, 
        backgroundColor: backgroundColor,
        fill: textColor,
        fontWeight: 'bold',
        originX: 'left', 
        originY: 'top',
        hasControls: false,
        hasBorders: false,
        hasRotatingPoint: false,
        lockMovementX: lockMovements,
        lockMovementY: lockMovements,
        selectable: !lockMovements
    });

    self.floorCanvas.add(pin);

    self.arrayOfPins.push({id: self.pinsCount, canvasPin: pin});
    console.log('array of pins new entry');

    console.log(['New pin ', self.pinsCount ,' created at [', left, ',', top, ']'].join(''));

    if (lockMovements)
    {
        console.log(['Pin ', self.pinsCount ,' cannot be moved.'].join(''));
    }
    else
    {
        self.activePin = pin;
    }

    if (!isActive)
    {
        self.pinsByCategory[categoryName].push(pin);
    }

    self.floorCanvas.renderAll();
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
        return (object.type === self.PIN_OBJECT_TEXT_TYPE && Math.ceil(object.left) === Math.ceil(left) && Math.ceil(object.top) === Math.ceil(top));
    });

    return objectsWithinCell;
}