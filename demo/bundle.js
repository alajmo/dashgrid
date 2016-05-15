(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var css = "body,\nhtml {\n  width: 100%;\n  height: 100%;\n  font-size: 1.25em;\n  margin: 0;\n  padding: 0;\n  font-family: arial;\n  color: #444444;\n}\n.dashgridContainer {\n  position: relative;\n  /*top: 1%;*/\n  /*margin: 0 auto;*/\n  width: 100%;\n  height: 100%;\n  /*height: 800px;*/\n  /*height: 800px;*/\n}\n.dashgridBox {\n  background: #E1E1E1;\n  position: absolute;\n  top: 20%;\n  left: 0;\n  width: 100%;\n  height: 80%;\n}\n/**\n * Dashgrid relevant classes.\n */\n.dashgrid {\n  background: #F9F9F9;\n}\n.dashgrid-box {\n  background: red;\n}\n.dashgrid-shadow-box {\n  background-color: #E8E8E8;\n  opacity: 0.5;\n}\n/**\n * GRID DRAW HELPERS.\n */\n.dashgrid-horizontal-line,\n.dashgrid-vertical-line {\n  background: #FFFFFF;\n}\n.dashgrid-grid-centroid {\n  background: #000000;\n  width: 5px;\n  height: 5px;\n}\n/**\n * Resize Handlers\n */\n\n\n\n\n\n\n\n\n"; (require("browserify-css").createStyle(css, { "href": "demo/demo.css"})); module.exports = css;
},{"browserify-css":3}],2:[function(require,module,exports){
'use strict';

require('./demo.css');

var _dashgrid = require('../src/dashgrid.js');

var _dashgrid2 = _interopRequireDefault(_dashgrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
    main();
});

function fillCells(numRows, numColumns) {
    var elem = void 0;
    var boxesAll = [];
    var id = 0;
    for (var i = 0; i < numRows; i += 1) {
        for (var j = 0; j < numColumns; j += 1) {
            elem = document.createElement('div');
            elem.className = 'dragHandle';
            elem.style.width = '100%';
            elem.style.height = '100%';
            id += 1;
            boxesAll.push({ row: i, column: j, rowspan: 1, columnspan: 1 });
        }
    }

    return boxesAll;
}

function main() {
    var boxes = void 0;
    var numRows = 6;
    var numColumns = 6;

    var elem = document.createElement('div');
    elem.className = 'dashgridBox';

    var elemTwo = document.createElement('div');
    elemTwo.className = 'dashgridBox';

    var elemThree = document.createElement('div');
    elemThree.className = 'dashgridBox';

    boxes = [{ row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem }, { row: 2, column: 1, rowspan: 4, columnspan: 2, content: elemTwo }];
    // boxes = fillCells(numRows, numColumns);

    // {row: 15, column: 3, rowspan: 2, columnspan: 2, content: elemThree}
    var dashgrid = (0, _dashgrid2.default)(document.getElementById('grid'), {
        boxes: boxes,
        floating: true,

        xMargin: 20,
        yMargin: 20,

        draggable: { enabled: true, handle: 'dashgrid-box' },

        rowHeight: 'auto',
        minRows: numRows,
        maxRows: numRows + 5,

        columnWidth: 'auto',
        minColumns: numColumns,
        maxColumns: numColumns,

        showGridCentroids: true,
        showGridLines: true,
        liveChanges: true
    });
}

},{"../src/dashgrid.js":7,"./demo.css":1}],3:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }
        
        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            head.appendChild(style);
        } else if (style.styleSheet) { // for IE8 and below
            head.appendChild(style);
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            head.appendChild(style);
        }
    }
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.boxContainerElementModel = boxContainerElementModel;


function boxContainerElementModel() {
    var boxesElement = document.createElement('div');
    boxesElement.className = 'dashgrid-boxes;';

    return boxesElement;
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.boxStateModel = boxStateModel;

/**
 * Template function for box objects.
 *  @returns {Object} Box object.
 */

function boxStateModel(state) {
    var box = {
        row: state.box.row,
        column: state.box.column,
        rowspan: state.box.rowspan || 1,
        columnspan: state.box.columnspan || 1,
        draggable: state.box.draggable === false ? false : true,
        resizable: state.box.resizable === false ? false : true,
        pushable: state.box.pushable === false ? false : true,
        floating: state.box.floating === true ? true : false,
        stacking: state.box.stacking === true ? true : false,
        swapping: state.box.swapping === true ? true : false,
        inherit: state.box.inherit === true ? true : false
    };

    return box;
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.centroidElementModel = centroidElementModel;


function centroidElementModel() {
    var centroidElement = document.createElement('div');
    centroidElement.className = 'dashgrid-centroids';

    return centroidElement;
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.boxState = exports.gridState = exports.renderState = exports.gridElement = undefined;

require('./shims.js');

var _grid = require('./grid.js');

var _gridEngine = require('./gridEngine.js');

var _gridViewState = require('./gridViewState.js');

var _gridElementModel = require('./gridElementModel.js');

var _gridStateModel = require('./gridStateModel.js');

var _boxStateModel = require('./boxStateModel.js');

var _renderStateModel = require('./renderStateModel.js');

var _gridEngineStateModel = require('./gridEngineStateModel.js');

// State Models.


// Functions.
exports.default = dashgrid;

// Exporting States.


// Element Models.

exports.gridElement = gridElement;
exports.renderState = renderState;
exports.gridState = gridState;
exports.boxState = boxState;

// Elements.

var gridElement = void 0;

// States.
var renderState = void 0;
var gridState = void 0;
var boxState = void 0;

function dashgrid(element, options) {
    exports.gridState = gridState = Object.assign({}, (0, _gridStateModel.gridStateModel)(options));
    exports.gridElement = gridElement = (0, _gridElementModel.gridElementModel)(element, gridState);

    // User event after grid is done loading.
    if (dashgrid.onGridReady) {
        dashgrid.onGridReady();
    } // user event.

    return;

    // API.
    return Object.freeze({
        updateBox: g.updateBox,
        insertBox: g.insertBox,
        removeBox: g.removeBox,
        getBoxes: g.getBoxes,
        refreshGrid: g.refreshGrid,
        dashgrid: gridState
    });
};

},{"./boxStateModel.js":5,"./grid.js":8,"./gridElementModel.js":9,"./gridEngine.js":10,"./gridEngineStateModel.js":11,"./gridStateModel.js":12,"./gridViewState.js":13,"./renderStateModel.js":15,"./shims.js":16}],8:[function(require,module,exports){
"use strict";

/**
 *
 * @param {Object} dashgrid
 * @param {Object} renderer
 * @param {Object} boxHandler
 * @returns {Function} init Initialize Grid.
 * @returns {Function} updateBox API for updating box, moving / resizing.
 * @returns {Function} insertBox Insert a new box.
 * @returns {Function} removeBox Remove a box.
 * @returns {Function} getBox Return box object given DOM element.
 * @returns {Function} updateStart When drag / resize starts.
 * @returns {Function} update During dragging / resizing.
 * @returns {Function} updateEnd After drag / resize ends.
 * @returns {Function} renderGrid Update grid element.
 */
function grid() {
    /**
     * creates the necessary box elements and checks that the boxes input is
     * correct.
     * 1. Create box elements.
     * 2. Update the dashgrid since newly created boxes may lie outside the
     *    initial dashgrid state.
     * 3. Render the dashgrid.
     */
    var init = function init(state) {
        gridEngine().init({
            gridState: state.gridState,
            gridEngineState: state.gridEngineState
        });
        // gridView(state.gridViewState);
    };

    /**
    *
    * @param {}
    * @returns
    */
    var addBoxes = function addBoxes(state) {
        // let boxes = [];

        // for (let i = 0, len = state.boxes.length; i < len; i++) {
        //     boxes.push(box({box: state.boxes[i], gridState: gridState}));
        // }

        // gridState.boxes = boxes;
    };

    /**
     *
     * @param {Object} box
     * @param {Object} updateTo
     * @param {Object} excludeBox Optional parameter, if updateBox is triggered
     *                            by drag / resize event, then don't update
     *                            the element.
     * @returns {boolean} If update succeeded.
     */
    var updateBox = function updateBox(box, updateTo, excludeBox) {
        var movedBoxes = gridEngine.updateBox(box, updateTo);

        if (movedBoxes.length > 0) {
            gridView.renderBox(movedBoxes, excludeBox);
            gridView.renderGrid();

            return true;
        }

        return false;
    };

    /**
     * Removes a box.
     * @param {Object} box
     */
    var removeBox = function removeBox(box) {
        gridEngine.removeBox(box);
        gridView.renderGrid();
    };

    /**
     * Resizes a box.
     * @param {Object} box
     */
    var resizeBox = function resizeBox(box) {
        // In case box is not updated by dragging / resizing.
        gridView.renderBox(movedBoxes);
        gridView.renderGrid();
    };

    /**
     * Called when either resize or drag starts.
     * @param {Object} box
     */
    var updateStart = function updateStart(box) {
        gridEngine.increaseNumRows(box, 1);
        gridEngine.increaseNumColumns(box, 1);
        gridView.renderGrid();
    };

    /**
     * When dragging / resizing is dropped.
     * @param {Object} box
     */
    var update = function update(box) {};

    /**
     * When dragging / resizing is dropped.
     */
    var updateEnd = function updateEnd() {
        gridEngine.decreaseNumRows();
        gridEngine.decreaseNumColumns();
        gridView.renderGrid();
    };

    var refreshGrid = function refreshGrid() {
        gridView.renderBox(dashgrid.boxes);
        gridView.renderGrid();
    };

    return Object.freeze({
        init: init,
        updateBox: updateBox,
        updateStart: updateStart,
        update: update,
        updateEnd: updateEnd,
        refreshGrid: refreshGrid
    });
}

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gridElementModel = undefined;

var _utils = require('./utils.js');

var _boxContainerElementModel = require('./boxContainerElementModel.js');

var _horizontalLineElementModel = require('./horizontalLineElementModel.js');

var _verticalLineElementModel = require('./verticalLineElementModel.js');

var _centroidElementModel = require('./centroidElementModel.js');

exports.gridElementModel = gridElementModel;

/**
 * 
 * @param {Object} element The DOM element to which to attach the grid element content.  
 * @param {Object} gridState The grid state. 
 * @returns {Object} The dom element.
 */

function gridElementModel(element, gridState) {
    var gridElement = {};

    gridElement.element = element;

    // Properties.
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.display = 'block';
    element.style.zIndex = '1000';

    // Children.
    var boxes = { element: (0, _boxContainerElementModel.boxContainerElementModel)() };
    gridElement.boxes = boxes.element;
    gridElement.element.appendChild(boxes.element);

    if (gridState.showHorizontalLine) {
        var horizontalLine = { element: (0, _horizontalLineElementModel.horizontalLineElementModel)() };
        gridElement.horizontalLine = horizontalLine.element;
        gridElement.element.appendChild(horizontalLine.element);
    }

    if (gridState.showVerticalLine) {
        var verticalLine = { element: (0, _verticalLineElementModel.verticalLineElementModel)() };
        gridElement.verticalLine = verticalLine.element;
        gridElement.element.appendChild(verticalLine.element);
    }

    if (gridState.showCentroid) {
        var centroid = { element: (0, _centroidElementModel.centroidElementModel)() };
        gridElement.centroid = centroid.element;
        gridElement.element.appendChild(centroid.element);
    }

    // Event listeners.
    (0, _utils.addEvent)(window, 'resize', function () {
        renderer.setColumnWidth();
        renderer.setRowHeight();
        grid.refreshGrid();
    });

    return gridElement;
};

},{"./boxContainerElementModel.js":4,"./centroidElementModel.js":6,"./horizontalLineElementModel.js":14,"./utils.js":17,"./verticalLineElementModel.js":18}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gridEngineModel = undefined;

var _utils = require('./utils.js');

// import {box} from './box.js';

exports.gridEngineModel = gridEngineModel;
/**
 * @description Handles collision logic and dashgrid dimension.
 * @param {Object} obj
 */

function gridEngineModel() {

    var init = function init(state) {
        // updateNumRows();
        // updateNumColumns();
    };

    /**
     * Given a DOM element, retrieve corresponding js object from boxes.
     * @param {Object} element DOM element.
     * @returns {Object} box Given a DOM element, return corresponding box object.
     */
    var getBox = function getBox(element) {
        for (var i = 0, len = boxes.length; i < len; i++) {
            if (boxes[i]._element === element) {
                return boxes[i];
            }
        };
    };

    /**
     * Copy box positions.
     * @returns {Array.<Object>} Previous box positions.
     */
    var copyBoxes = function copyBoxes() {
        var prevPositions = [];
        for (var i = 0; i < boxes.length; i++) {
            prevPositions.push({
                row: boxes[i].row,
                column: boxes[i].column,
                columnspan: boxes[i].columnspan,
                rowspan: boxes[i].rowspan
            });
        };

        return prevPositions;
    };

    /**
     * Restore Old positions.
     * @param {Array.<Object>} Previous positions.
     */
    var restoreOldPositions = function restoreOldPositions(prevPositions) {
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].row = prevPositions[i].row, boxes[i].column = prevPositions[i].column, boxes[i].columnspan = prevPositions[i].columnspan, boxes[i].rowspan = prevPositions[i].rowspan;
        };
    };

    /**
     * Remove a box given its index in the boxes array.
     * @param {number} boxIndex.
     */
    var removeBox = function removeBox(boxIndex) {
        var elem = boxes[boxIndex]._element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

        // In case floating is on.
        updateNumRows();
        updateNumColumns();
    };

    /**
     * Insert a box. Box must contain at least the size and position of the box,
     * content element is optional.
     * @param {Object} box Box dimensions.
     * @returns {boolean} If insert was possible.
     */
    var insertBox = function insertBox(box) {
        movingBox = box;

        if (box.rows === undefined && box.column === undefined && box.rowspan === undefined && box.columnspan === undefined) {
            return false;
        }

        if (!isUpdateValid(box)) {
            return false;
        }

        var prevPositions = copyBoxes();

        var movedBoxes = [box];
        var validMove = moveBox(box, box, movedBoxes);
        movingBox = undefined;

        if (validMove) {
            boxHandler.createBox(box);
            boxes.push(box);

            updateNumRows();
            updateNumColumns();
            return box;
        }

        restoreOldPositions(prevPositions);

        return false;
    };

    /**
     * Updates a position or size of box.
     *
     * Works in posterior fashion, akin to ask for forgiveness rather than for
     * permission.
     * Logic:
     *
     * 1. Is updateTo a valid state?
     *    1.1 No: Return false.
     * 2. Save positions.
     * 3. Move box.
     *      3.1. Is box outside border?
     *          3.1.1. Yes: Can border be pushed?
     *              3.1.1.1. Yes: Expand border.
     *              3.1.1.2. No: Return false.
     *      3.2. Does box collide?
     *          3.2.1. Yes: Calculate new box position and
     *                 go back to step 1 with the new collided box.
     *          3.2.2. No: Return true.
     * 4. Is move valid?
     *    4.1. Yes: Update number rows / columns.
     *    4.2. No: Revert to old positions.
     *
     * @param {Object} box The box being updated.
     * @param {Object} updateTo The new state.
     * @returns {Array.<Object>} movedBoxes
     */
    var updateBox = function updateBox(box, updateTo) {
        movingBox = box;

        var prevPositions = copyBoxes();

        Object.assign(box, updateTo);
        if (!isUpdateValid(box)) {
            restoreOldPositions(prevPositions);
            return false;
        }

        var movedBoxes = [box];
        var validMove = moveBox(box, box, movedBoxes);

        if (validMove) {
            updateNumRows();
            updateNumColumns();

            return movedBoxes;
        }

        restoreOldPositions(prevPositions);

        return [];
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {Object} box
     * @param {Array.<Object>} excludeBox
     * @param {Array.<Object>} movedBoxes
     * @return {boolean} true if move is possible, false otherwise.
     */
    var moveBox = function moveBox(box, excludeBox, movedBoxes) {
        if (isBoxOutsideBoundary(box)) {
            return false;
        }

        var intersectedBoxes = getIntersectedBoxes(box, excludeBox, movedBoxes);

        // Handle box Collision, recursive model.
        for (var i = 0, len = intersectedBoxes.length; i < len; i++) {
            if (!collisionHandler(box, intersectedBoxes[i], excludeBox, movedBoxes)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Propagates box collisions.
     * @param {Object} box
     * @param {Object} boxB
     * @param {Object} excludeBox
     * @param {Array.<Object>} movedBoxes
     * @return {boolean} If move is allowed
     */
    var collisionHandler = function collisionHandler(box, boxB, excludeBox, movedBoxes) {
        setBoxPosition(box, boxB);
        return moveBox(boxB, excludeBox, movedBoxes);
    };

    /**
     * Calculates new box position based on the box that pushed it.
     * @param {Object} box Box which has moved.
     * @param {Object} boxB Box which is to be moved.
     */
    var setBoxPosition = function setBoxPosition(box, boxB) {
        boxB.row += box.row + box.rowspan - boxB.row;
    };

    /**
     * Given a box, finds other boxes which intersect with it.
     * @param {Object} box
     * @param {Array.<Object>} excludeBox Array of boxes.
     */
    var getIntersectedBoxes = function getIntersectedBoxes(box, excludeBox, movedBoxes) {
        var intersectedBoxes = [];
        for (var i = 0, len = boxes.length; i < len; i++) {
            // Don't check moving box and the box itself.
            if (box !== boxes[i] && boxes[i] !== excludeBox) {
                if (doBoxesIntersect(box, boxes[i])) {
                    movedBoxes.push(boxes[i]);
                    intersectedBoxes.push(boxes[i]);
                }
            }
        }
        (0, _utils.insertionSort)(intersectedBoxes, 'row');

        return intersectedBoxes;
    };

    /**
     * Checks whether 2 boxes intersect using bounding box method.
     * @param {Object} boxA
     * @param {Object} boxB
     * @returns boolean True if intersect else false.
     */
    var doBoxesIntersect = function doBoxesIntersect(box, boxB) {
        return box.column < boxB.column + boxB.columnspan && box.column + box.columnspan > boxB.column && box.row < boxB.row + boxB.rowspan && box.rowspan + box.row > boxB.row;
    };

    /**
     * Updates the number of columns.
     */
    var updateNumColumns = function updateNumColumns() {
        var maxColumn = (0, _utils.getMaxNum)(boxes, 'column', 'columnspan');

        if (maxColumn >= dashgrid.minColumns) {
            dashgrid.numColumns = maxColumn;
        }

        if (!movingBox) {
            return;
        }

        if (dashgrid.numColumns - movingBox.column - movingBox.columnspan === 0 && dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns += 1;
        } else if (dashgrid.numColumns - movingBox.column - movingBox.columnspan > 1 && movingBox.column + movingBox.columnspan === maxColumn && dashgrid.numColumns > dashgrid.minColumns && dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns = maxColumn + 1;
        }
    };

    /**
     * Increases number of dashgrid.numRows if box touches bottom of wall.
     * @param {Object} box
     * @param {number} numColumns
     * @returns {boolean} true if increase else false.
     */
    var increaseNumColumns = function increaseNumColumns(box, numColumns) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts and moving box is close to bottom border.
        if (box.column + box.columnspan === dashgrid.numColumns && dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of dashgrid.numRows to furthest leftward box.
     * @returns boolean true if increase else false.
     */
    var decreaseNumColumns = function decreaseNumColumns() {
        var maxColumnNum = 0;

        boxes.forEach(function (box) {
            if (maxColumnNum < box.column + box.columnspan) {
                maxColumnNum = box.column + box.columnspan;
            }
        });

        if (maxColumnNum < dashgrid.numColumns) {
            dashgrid.numColumns = maxColumnNum;
        }
        if (maxColumnNum < dashgrid.minColumns) {
            dashgrid.numColumns = dashgrid.minColumns;
        }

        return true;
    };

    /**
     * Number rows depends on three things.
     * <ul>
     *     <li>Min / Max Rows.</li>
     *     <li>Max Box.</li>
     *     <li>Dragging box near bottom border.</li>
     * </ul>
     *
     */
    var updateNumRows = function updateNumRows() {
        var maxRow = (0, _utils.getMaxNum)(boxes, 'row', 'rowspan');

        if (maxRow >= dashgrid.minRows) {
            dashgrid.numRows = maxRow;
        }

        if (!movingBox) {
            return;
        }

        // Moving box when close to border.
        if (dashgrid.numRows - movingBox.row - movingBox.rowspan === 0 && dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows += 1;
        } else if (dashgrid.numRows - movingBox.row - movingBox.rowspan > 1 && movingBox.row + movingBox.rowspan === maxRow && dashgrid.numRows > dashgrid.minRows && dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows = maxRow + 1;
        }
    };

    /**
     * Increases number of dashgrid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    var increaseNumRows = function increaseNumRows(box, numRows) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if (box.row + box.rowspan === dashgrid.numRows && dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of dashgrid.numRows to furthest downward box.
     * @returns {boolean} true if increase else false.
     */
    var decreaseNumRows = function decreaseNumRows() {
        var maxRowNum = 0;

        boxes.forEach(function (box) {
            if (maxRowNum < box.row + box.rowspan) {
                maxRowNum = box.row + box.rowspan;
            }
        });

        if (maxRowNum < dashgrid.numRows) {
            dashgrid.numRows = maxRowNum;
        }
        if (maxRowNum < dashgrid.minRows) {
            dashgrid.numRows = dashgrid.minRows;
        }

        return true;
    };

    /**
     * Checks min, max box-size.
     * @param {Object} box
     * @returns {boolean}
     */
    var isUpdateValid = function isUpdateValid(box) {
        if (box.rowspan < dashgrid.minRowspan || box.rowspan > dashgrid.maxRowspan || box.columnspan < dashgrid.minColumnspan || box.columnspan > dashgrid.maxColumnspan) {
            return false;
        }

        return true;
    };

    /**
     * Handles border collisions by reverting back to closest edge point.
     * @param {Object} box
     * @returns {boolean} True if collided and cannot move wall else false.
     */
    var isBoxOutsideBoundary = function isBoxOutsideBoundary(box) {
        // Top and left border.
        if (box.column < 0 || box.row < 0) {
            return true;
        }

        // Right and bottom border.
        if (box.row + box.rowspan > dashgrid.maxRows || box.column + box.columnspan > dashgrid.maxColumns) {
            return true;
        }

        return false;
    };

    return Object.freeze({
        init: init,
        updateBox: updateBox,
        updateNumRows: updateNumRows,
        increaseNumRows: increaseNumRows,
        decreaseNumRows: decreaseNumRows,
        updateNumColumns: updateNumColumns,
        increaseNumColumns: increaseNumColumns,
        decreaseNumColumns: decreaseNumColumns,
        getBox: getBox,
        insertBox: insertBox,
        removeBox: removeBox
    });
}

},{"./utils.js":17}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gridEngineState = gridEngineState;


var gridEngineState = {
    boxes: [],
    movingBox: undefined,
    movedBoxes: []
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gridStateModel = gridStateModel;


function gridStateModel(options) {

    var gridStateModel = {
        rowHeight: options.rowHeight,
        numRows: options.numRows !== undefined ? options.numRows : 6,
        minRows: options.minRows !== undefined ? options.minRows : 6,
        maxRows: options.maxRows !== undefined ? options.maxRows : 10,

        extraRows: 0,
        extraColumns: 0,

        columnWidth: options.columnWidth,
        numColumns: options.numColumns !== undefined ? options.numColumns : 6,
        minColumns: options.minColumns !== undefined ? options.minColumns : 6,
        maxColumns: options.maxColumns !== undefined ? options.maxColumns : 10,

        xMargin: options.xMargin !== undefined ? options.xMargin : 20,
        yMargin: options.yMargin !== undefined ? options.yMargin : 20,

        defaultBoxRowspan: 2,
        defaultBoxColumnspan: 1,

        minRowspan: options.minRowspan !== undefined ? options.minRowspan : 1,
        maxRowspan: options.maxRowspan !== undefined ? options.maxRowspan : 9999,

        minColumnspan: options.minColumnspan !== undefined ? options.minColumnspan : 1,
        maxColumnspan: options.maxColumnspan !== undefined ? options.maxColumnspan : 9999,

        pushable: options.pushable === false ? false : true,
        floating: options.floating === true ? true : false,
        stacking: options.stacking === true ? true : false,
        swapping: options.swapping === true ? true : false,
        animate: options.animate === true ? true : false,

        liveChanges: options.liveChanges === false ? false : true,

        // Drag handle can be a custom classname or if not set revers to the
        // box container with classname 'dashgrid-box'.
        draggable: {
            enabled: options.draggable && options.draggable.enabled === false ? false : true,
            handle: options.draggable && options.draggable.handle || 'dashgrid-box',

            // user cb's.
            dragStart: options.draggable && options.draggable.dragStart,
            dragging: options.draggable && options.draggable.dragging,
            dragEnd: options.draggable && options.draggable.dragEnd
        },

        resizable: {
            enabled: options.resizable && options.resizable.enabled === false ? false : true,
            handle: options.resizable && options.resizable.handle || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: options.resizable && options.resizable.handleWidth !== undefined ? options.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: options.resizable && options.resizable.resizeStart,
            resizing: options.resizable && options.resizable.resizing,
            resizeEnd: options.resizable && options.resizable.resizeEnd
        },

        onUpdate: function onUpdate() {},

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapBackTime: options.snapBackTime === undefined ? 300 : options.snapBackTime,

        showVerticalLine: options.showVerticalLine === false ? false : true,
        showHorizontalLine: options.showHorizontalLine === false ? false : true,
        showCentroid: options.showCentroid === false ? false : true
    };

    return gridStateModel;
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gridViewState = gridViewState;


var gridViewState = {
    gridLinesElement: undefined,
    gridCentroidsElement: undefined
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.horizontalLineElementModel = horizontalLineElementModel;


function horizontalLineElementModel() {
    var horizontalLineElement = document.createElement('div');
    horizontalLineElement.className = 'dashgrid-grid-lines;';

    return horizontalLineElement;
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderStateModel = renderStateModel;


function renderStateModel() {
    // Start row / column denotes the pixel at which each cell starts at.
    var renderStateModel = {
        startColumn: [],
        startRow: [],
        columnWidth: undefined,
        rowHeight: undefined
    };

    return renderStateModel;
}

},{}],16:[function(require,module,exports){
"use strict";

// shim layer with setTimeout fallback for requiestAnimationFrame
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        cb = cb || function () {};
        window.setTimeout(cb, 1000 / 60);
    };
}();

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMaxNum = getMaxNum;
exports.getSortedArr = getSortedArr;
exports.insertByOrder = insertByOrder;
exports.insertionSort = insertionSort;
exports.ObjectLength = ObjectLength;
exports.addEvent = addEvent;
exports.removeNodes = removeNodes;
exports.findParent = findParent;

/**
 *
 * @param {Object} box
 * @param {string} at1
 * @param {string} at2
 * @returns {Number}
 */
function getMaxNum(box, at1, at2) {
    var maxVal = 0;
    for (var i = 0, len = box.length; i < len; i++) {
        if (box[i][at1] + box[i][at2] >= maxVal) {
            maxVal = box[i][at1] + box[i][at2];
        }
    }

    return maxVal;
}

/**
 *
 * @param {string} order
 * @param {string} attr
 * @param {Array.<Object>} objs
 * @returns {Array.<Object>}
 */
function getSortedArr(order, attr, objs) {
    var key = void 0;
    var arr = [];

    Object.keys(objs).forEach(function (i) {
        insertByOrder(order, attr, objs[i], arr);
    });

    return arr;
}

/**
 * Sort array with newly inserted object.
 * @param {string} box
 * @param {string} at1
 * @param {Object} at2
 */
function insertByOrder(order, attr, o, arr) {
    var len = arr.length;

    if (len === 0) {
        arr.push(o);
    } else {
        // Insert by order, start furthest down.
        // Insert between 0 and n -1.
        for (var i = 0; i < len; i += 1) {
            if (order === 'desc') {
                if (o.row > arr[i].row) {
                    arr.splice(i, 0, o);
                    break;
                }
            } else {
                if (o.row < arr[i].row) {
                    arr.splice(i, 0, o);
                    break;
                }
            }
        }

        // If not inbetween 0 and n - 1, insert last.
        if (len === arr.length) {
            arr.push(o);
        }
    }
}

/**
 *
 * @param {Array.<Object>} a
 * @param {string} a
 */
function insertionSort(a, attr) {
    if (a.length < 2) {
        return;
    }

    var i = a.length;
    var temp;
    var j;
    while (i--) {
        j = i;
        while (j > 0 && a[j - 1][attr] < a[j][attr]) {
            temp = a[j];
            a[j] = a[j - 1];
            a[j - 1] = temp;
            j -= 1;
        }
    }
}

/**
 *
 * @param {Object} obj
 * @returns {number} Number of properties in object.
 */
function ObjectLength(obj) {
    var length = 0,
        key = void 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            length += 1;
        }
    }
    return length;
}

/**
 * Add event, and not overwrite.
 * @param {Object} element
 * @param {string} type
 * @param {Function} eventHandle
 * @returns
 */
function addEvent(element, type, eventHandle) {
    if (element === null || typeof element === 'undefined') return;
    if (element.addEventListener) {
        element.addEventListener(type, eventHandle, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, eventHandle);
    } else {
        element['on' + type] = eventHandle;
    }
}

/**
 * Remove nodes from element.
 * @param {Object} element
 */
function removeNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 *
 * @param {Object} node
 * @param {string} className
 * @returns {Object|Boolean} DOM element object or false if not found. 
 */
function findParent(node, className) {
    while (node.nodeType === 1 && node !== document.body) {
        if (node.className.search(className) > -1) {
            return node;
        }
        node = node.parentNode;
    }
    return false;
}

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.verticalLineElementModel = verticalLineElementModel;


function verticalLineElementModel() {
    var verticalLineElement = document.createElement('div');
    verticalLineElement.className = 'dashgrid-grid-lines;';

    return verticalLineElement;
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2RlbW8uY3NzIiwiZGVtby9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktY3NzL2Jyb3dzZXIuanMiLCJzcmMvYm94Q29udGFpbmVyRWxlbWVudE1vZGVsLmpzIiwic3JjL2JveFN0YXRlTW9kZWwuanMiLCJzcmMvY2VudHJvaWRFbGVtZW50TW9kZWwuanMiLCJzcmMvZGFzaGdyaWQuanMiLCJzcmMvZ3JpZC5qcyIsInNyYy9ncmlkRWxlbWVudE1vZGVsLmpzIiwic3JjL2dyaWRFbmdpbmUuanMiLCJzcmMvZ3JpZEVuZ2luZVN0YXRlTW9kZWwuanMiLCJzcmMvZ3JpZFN0YXRlTW9kZWwuanMiLCJzcmMvZ3JpZFZpZXdTdGF0ZS5qcyIsInNyYy9ob3Jpem9udGFsTGluZUVsZW1lbnRNb2RlbC5qcyIsInNyYy9yZW5kZXJTdGF0ZU1vZGVsLmpzIiwic3JjL3NoaW1zLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlcnRpY2FsTGluZUVsZW1lbnRNb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7O0FDQUE7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVc7QUFDckQsV0FEcUQ7Q0FBWCxDQUE5Qzs7QUFJQSxTQUFTLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBNUIsRUFBd0M7QUFDcEMsUUFBSSxhQUFKLENBRG9DO0FBRXBDLFFBQUksV0FBVyxFQUFYLENBRmdDO0FBR3BDLFFBQUksS0FBSyxDQUFMLENBSGdDO0FBSXBDLFNBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLE9BQUosRUFBYSxLQUFLLENBQUwsRUFBUTtBQUNqQyxhQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxVQUFKLEVBQWdCLEtBQUssQ0FBTCxFQUFRO0FBQ3BDLG1CQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixD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Z2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNzcyA9IFwiYm9keSxcXG5odG1sIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZm9udC1zaXplOiAxLjI1ZW07XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1mYW1pbHk6IGFyaWFsO1xcbiAgY29sb3I6ICM0NDQ0NDQ7XFxufVxcbi5kYXNoZ3JpZENvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAvKnRvcDogMSU7Ki9cXG4gIC8qbWFyZ2luOiAwIGF1dG87Ki9cXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgLypoZWlnaHQ6IDgwMHB4OyovXFxuICAvKmhlaWdodDogODAwcHg7Ki9cXG59XFxuLmRhc2hncmlkQm94IHtcXG4gIGJhY2tncm91bmQ6ICNFMUUxRTE7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDIwJTtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogODAlO1xcbn1cXG4vKipcXG4gKiBEYXNoZ3JpZCByZWxldmFudCBjbGFzc2VzLlxcbiAqL1xcbi5kYXNoZ3JpZCB7XFxuICBiYWNrZ3JvdW5kOiAjRjlGOUY5O1xcbn1cXG4uZGFzaGdyaWQtYm94IHtcXG4gIGJhY2tncm91bmQ6IHJlZDtcXG59XFxuLmRhc2hncmlkLXNoYWRvdy1ib3gge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI0U4RThFODtcXG4gIG9wYWNpdHk6IDAuNTtcXG59XFxuLyoqXFxuICogR1JJRCBEUkFXIEhFTFBFUlMuXFxuICovXFxuLmRhc2hncmlkLWhvcml6b250YWwtbGluZSxcXG4uZGFzaGdyaWQtdmVydGljYWwtbGluZSB7XFxuICBiYWNrZ3JvdW5kOiAjRkZGRkZGO1xcbn1cXG4uZGFzaGdyaWQtZ3JpZC1jZW50cm9pZCB7XFxuICBiYWNrZ3JvdW5kOiAjMDAwMDAwO1xcbiAgd2lkdGg6IDVweDtcXG4gIGhlaWdodDogNXB4O1xcbn1cXG4vKipcXG4gKiBSZXNpemUgSGFuZGxlcnNcXG4gKi9cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cIjsgKHJlcXVpcmUoXCJicm93c2VyaWZ5LWNzc1wiKS5jcmVhdGVTdHlsZShjc3MsIHsgXCJocmVmXCI6IFwiZGVtby9kZW1vLmNzc1wifSkpOyBtb2R1bGUuZXhwb3J0cyA9IGNzczsiLCJpbXBvcnQgJy4vZGVtby5jc3MnO1xuaW1wb3J0IGRhc2hHcmlkR2xvYmFsIGZyb20gJy4uL3NyYy9kYXNoZ3JpZC5qcyc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICBtYWluKCk7XG59KTtcblxuZnVuY3Rpb24gZmlsbENlbGxzKG51bVJvd3MsIG51bUNvbHVtbnMpIHtcbiAgICBsZXQgZWxlbTtcbiAgICBsZXQgYm94ZXNBbGwgPSBbXTtcbiAgICBsZXQgaWQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtQ29sdW1uczsgaiArPSAxKSB7XG4gICAgICAgICAgICBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTmFtZSA9ICdkcmFnSGFuZGxlJztcbiAgICAgICAgICAgIGVsZW0uc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgICAgICBlbGVtLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgICAgIGlkICs9IDE7XG4gICAgICAgICAgICBib3hlc0FsbC5wdXNoKHtyb3c6IGksIGNvbHVtbjogaiwgcm93c3BhbjogMSwgY29sdW1uc3BhbjogMX0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJveGVzQWxsO1xufVxuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBib3hlcztcbiAgICBsZXQgbnVtUm93cyA9IDY7XG4gICAgbGV0IG51bUNvbHVtbnMgPSA2O1xuXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZEJveCc7XG5cbiAgICBsZXQgZWxlbVR3byA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW1Ud28uY2xhc3NOYW1lID0gJ2Rhc2hncmlkQm94JztcblxuICAgIGxldCBlbGVtVGhyZWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtVGhyZWUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkQm94JztcblxuICAgIGJveGVzID0gW1xuICAgICAgICB7cm93OiAwLCBjb2x1bW46IDEsIHJvd3NwYW46IDIsIGNvbHVtbnNwYW46IDIsIGNvbnRlbnQ6IGVsZW19LFxuICAgICAgICB7cm93OiAyLCBjb2x1bW46IDEsIHJvd3NwYW46IDQsIGNvbHVtbnNwYW46IDIsIGNvbnRlbnQ6IGVsZW1Ud299LFxuICAgICAgICAvLyB7cm93OiAxNSwgY29sdW1uOiAzLCByb3dzcGFuOiAyLCBjb2x1bW5zcGFuOiAyLCBjb250ZW50OiBlbGVtVGhyZWV9XG4gICAgXTtcbiAgICAvLyBib3hlcyA9IGZpbGxDZWxscyhudW1Sb3dzLCBudW1Db2x1bW5zKTtcblxuICAgIGxldCBkYXNoZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkJyksIHtcbiAgICAgICAgYm94ZXM6IGJveGVzLFxuICAgICAgICBmbG9hdGluZzogdHJ1ZSxcblxuICAgICAgICB4TWFyZ2luOiAyMCxcbiAgICAgICAgeU1hcmdpbjogMjAsXG5cbiAgICAgICAgZHJhZ2dhYmxlOiB7ZW5hYmxlZDogdHJ1ZSwgaGFuZGxlOiAnZGFzaGdyaWQtYm94J30sXG5cbiAgICAgICAgcm93SGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIG1pblJvd3M6IG51bVJvd3MsXG4gICAgICAgIG1heFJvd3M6IG51bVJvd3MgKyA1LFxuXG4gICAgICAgIGNvbHVtbldpZHRoOiAnYXV0bycsXG4gICAgICAgIG1pbkNvbHVtbnM6IG51bUNvbHVtbnMsXG4gICAgICAgIG1heENvbHVtbnM6IG51bUNvbHVtbnMsXG5cbiAgICAgICAgc2hvd0dyaWRDZW50cm9pZHM6IHRydWUsXG4gICAgICAgIHNob3dHcmlkTGluZXM6IHRydWUsXG4gICAgICAgIGxpdmVDaGFuZ2VzOiB0cnVlXG4gICAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBicm93c2VyIGZpZWxkLCBjaGVjayBvdXQgdGhlIGJyb3dzZXIgZmllbGQgYXQgaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL2Jyb3dzZXJpZnktaGFuZGJvb2sjYnJvd3Nlci1maWVsZC5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gQ3JlYXRlIGEgPGxpbms+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZUxpbms6IGZ1bmN0aW9uKGhyZWYsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuXG4gICAgICAgIGxpbmsuaHJlZiA9IGhyZWY7XG4gICAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIH0sXG4gICAgLy8gQ3JlYXRlIGEgPHN0eWxlPiB0YWcgd2l0aCBvcHRpb25hbCBkYXRhIGF0dHJpYnV0ZXNcbiAgICBjcmVhdGVTdHlsZTogZnVuY3Rpb24oY3NzVGV4dCwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSxcbiAgICAgICAgICAgIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCAhIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHN0eWxlLnNoZWV0KSB7IC8vIGZvciBqc2RvbSBhbmQgSUU5K1xuICAgICAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzVGV4dDtcbiAgICAgICAgICAgIHN0eWxlLnNoZWV0LmNzc1RleHQgPSBjc3NUZXh0O1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGUuc3R5bGVTaGVldCkgeyAvLyBmb3IgSUU4IGFuZCBiZWxvd1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3NUZXh0O1xuICAgICAgICB9IGVsc2UgeyAvLyBmb3IgQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpXG4gICAgICAgICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NUZXh0KSk7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJleHBvcnQge2JveENvbnRhaW5lckVsZW1lbnRNb2RlbH07XG5cbmZ1bmN0aW9uIGJveENvbnRhaW5lckVsZW1lbnRNb2RlbCgpIHtcbiAgICBsZXQgYm94ZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm94ZXNFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3hlczsnXG5cbiAgICByZXR1cm4gYm94ZXNFbGVtZW50O1xufVxuIiwiZXhwb3J0IHtib3hTdGF0ZU1vZGVsfTtcblxuLyoqXG4gKiBUZW1wbGF0ZSBmdW5jdGlvbiBmb3IgYm94IG9iamVjdHMuXG4gKiAgQHJldHVybnMge09iamVjdH0gQm94IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYm94U3RhdGVNb2RlbChzdGF0ZSkge1xuICAgIGxldCBib3ggPSB7XG4gICAgICAgIHJvdzogc3RhdGUuYm94LnJvdyxcbiAgICAgICAgY29sdW1uOiBzdGF0ZS5ib3guY29sdW1uLFxuICAgICAgICByb3dzcGFuOiBzdGF0ZS5ib3gucm93c3BhbiB8fCAxLFxuICAgICAgICBjb2x1bW5zcGFuOiBzdGF0ZS5ib3guY29sdW1uc3BhbiB8fCAxLFxuICAgICAgICBkcmFnZ2FibGU6IChzdGF0ZS5ib3guZHJhZ2dhYmxlID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIHJlc2l6YWJsZTogKHN0YXRlLmJveC5yZXNpemFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgcHVzaGFibGU6IChzdGF0ZS5ib3gucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChzdGF0ZS5ib3guZmxvYXRpbmcgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBzdGFja2luZzogKHN0YXRlLmJveC5zdGFja2luZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIHN3YXBwaW5nOiAoc3RhdGUuYm94LnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgaW5oZXJpdDogKHN0YXRlLmJveC5pbmhlcml0ID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGJveDtcbn1cbiIsImV4cG9ydCB7Y2VudHJvaWRFbGVtZW50TW9kZWx9O1xuXG5mdW5jdGlvbiBjZW50cm9pZEVsZW1lbnRNb2RlbCgpIHtcbiAgICBsZXQgY2VudHJvaWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2VudHJvaWRFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1jZW50cm9pZHMnO1xuXG4gICAgcmV0dXJuIGNlbnRyb2lkRWxlbWVudDtcbn1cbiIsImltcG9ydCAnLi9zaGltcy5qcyc7XG5cbi8vIEZ1bmN0aW9ucy5cbmltcG9ydCB7Z3JpZH0gZnJvbSAnLi9ncmlkLmpzJztcbmltcG9ydCB7Z3JpZEVuZ2luZX0gZnJvbSAnLi9ncmlkRW5naW5lLmpzJztcbmltcG9ydCB7Z3JpZFZpZXdTdGF0ZX0gZnJvbSAnLi9ncmlkVmlld1N0YXRlLmpzJztcblxuLy8gRWxlbWVudCBNb2RlbHMuXG5pbXBvcnQge2dyaWRFbGVtZW50TW9kZWx9IGZyb20gJy4vZ3JpZEVsZW1lbnRNb2RlbC5qcyc7XG5cbi8vIFN0YXRlIE1vZGVscy5cbmltcG9ydCB7Z3JpZFN0YXRlTW9kZWx9IGZyb20gJy4vZ3JpZFN0YXRlTW9kZWwuanMnO1xuaW1wb3J0IHtib3hTdGF0ZU1vZGVsfSBmcm9tICcuL2JveFN0YXRlTW9kZWwuanMnO1xuaW1wb3J0IHtyZW5kZXJTdGF0ZU1vZGVsfSBmcm9tICcuL3JlbmRlclN0YXRlTW9kZWwuanMnO1xuaW1wb3J0IHtncmlkRW5naW5lU3RhdGVNb2RlbH0gZnJvbSAnLi9ncmlkRW5naW5lU3RhdGVNb2RlbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRhc2hncmlkO1xuXG4vLyBFeHBvcnRpbmcgU3RhdGVzLlxuZXhwb3J0IHtncmlkRWxlbWVudCwgcmVuZGVyU3RhdGUsIGdyaWRTdGF0ZSwgYm94U3RhdGV9O1xuXG4vLyBFbGVtZW50cy5cbmxldCBncmlkRWxlbWVudDtcblxuLy8gU3RhdGVzLlxubGV0IHJlbmRlclN0YXRlO1xubGV0IGdyaWRTdGF0ZTtcbmxldCBib3hTdGF0ZTtcblxuZnVuY3Rpb24gZGFzaGdyaWQoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGdyaWRTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIGdyaWRTdGF0ZU1vZGVsKG9wdGlvbnMpKTtcbiAgICBncmlkRWxlbWVudCA9IGdyaWRFbGVtZW50TW9kZWwoZWxlbWVudCwgZ3JpZFN0YXRlKTtcblxuICAgIC8vIFVzZXIgZXZlbnQgYWZ0ZXIgZ3JpZCBpcyBkb25lIGxvYWRpbmcuXG4gICAgaWYgKGRhc2hncmlkLm9uR3JpZFJlYWR5KSB7ZGFzaGdyaWQub25HcmlkUmVhZHkoKTt9IC8vIHVzZXIgZXZlbnQuXG5cbiAgICByZXR1cm47XG5cbiAgICAvLyBBUEkuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICB1cGRhdGVCb3g6IGcudXBkYXRlQm94LFxuICAgICAgICBpbnNlcnRCb3g6IGcuaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3g6IGcucmVtb3ZlQm94LFxuICAgICAgICBnZXRCb3hlczogZy5nZXRCb3hlcyxcbiAgICAgICAgcmVmcmVzaEdyaWQ6IGcucmVmcmVzaEdyaWQsXG4gICAgICAgIGRhc2hncmlkOiBncmlkU3RhdGVcbiAgICB9KTtcbn07XG4iLCIvKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGFzaGdyaWRcbiAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlclxuICogQHBhcmFtIHtPYmplY3R9IGJveEhhbmRsZXJcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gaW5pdCBJbml0aWFsaXplIEdyaWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZUJveCBBUEkgZm9yIHVwZGF0aW5nIGJveCwgbW92aW5nIC8gcmVzaXppbmcuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGluc2VydEJveCBJbnNlcnQgYSBuZXcgYm94LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSByZW1vdmVCb3ggUmVtb3ZlIGEgYm94LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBnZXRCb3ggUmV0dXJuIGJveCBvYmplY3QgZ2l2ZW4gRE9NIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZVN0YXJ0IFdoZW4gZHJhZyAvIHJlc2l6ZSBzdGFydHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZSBEdXJpbmcgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gdXBkYXRlRW5kIEFmdGVyIGRyYWcgLyByZXNpemUgZW5kcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gcmVuZGVyR3JpZCBVcGRhdGUgZ3JpZCBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBncmlkKCkge1xuICAgIC8qKlxuICAgICAqIGNyZWF0ZXMgdGhlIG5lY2Vzc2FyeSBib3ggZWxlbWVudHMgYW5kIGNoZWNrcyB0aGF0IHRoZSBib3hlcyBpbnB1dCBpc1xuICAgICAqIGNvcnJlY3QuXG4gICAgICogMS4gQ3JlYXRlIGJveCBlbGVtZW50cy5cbiAgICAgKiAyLiBVcGRhdGUgdGhlIGRhc2hncmlkIHNpbmNlIG5ld2x5IGNyZWF0ZWQgYm94ZXMgbWF5IGxpZSBvdXRzaWRlIHRoZVxuICAgICAqICAgIGluaXRpYWwgZGFzaGdyaWQgc3RhdGUuXG4gICAgICogMy4gUmVuZGVyIHRoZSBkYXNoZ3JpZC5cbiAgICAgKi9cbiAgICBsZXQgaW5pdCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICBncmlkRW5naW5lKCkuaW5pdCh7XG4gICAgICAgICAgICBncmlkU3RhdGU6IHN0YXRlLmdyaWRTdGF0ZSxcbiAgICAgICAgICAgIGdyaWRFbmdpbmVTdGF0ZTogc3RhdGUuZ3JpZEVuZ2luZVN0YXRlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBncmlkVmlldyhzdGF0ZS5ncmlkVmlld1N0YXRlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IGFkZEJveGVzID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIC8vIGxldCBib3hlcyA9IFtdO1xuXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdGF0ZS5ib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyAgICAgYm94ZXMucHVzaChib3goe2JveDogc3RhdGUuYm94ZXNbaV0sIGdyaWRTdGF0ZTogZ3JpZFN0YXRlfSkpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gZ3JpZFN0YXRlLmJveGVzID0gYm94ZXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1cGRhdGVUb1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBleGNsdWRlQm94IE9wdGlvbmFsIHBhcmFtZXRlciwgaWYgdXBkYXRlQm94IGlzIHRyaWdnZXJlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IGRyYWcgLyByZXNpemUgZXZlbnQsIHRoZW4gZG9uJ3QgdXBkYXRlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElmIHVwZGF0ZSBzdWNjZWVkZWQuXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZUJveCA9IGZ1bmN0aW9uIChib3gsIHVwZGF0ZVRvLCBleGNsdWRlQm94KSB7XG4gICAgICAgIGxldCBtb3ZlZEJveGVzID0gZ3JpZEVuZ2luZS51cGRhdGVCb3goYm94LCB1cGRhdGVUbyk7XG5cbiAgICAgICAgaWYgKG1vdmVkQm94ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ3JpZFZpZXcucmVuZGVyQm94KG1vdmVkQm94ZXMsIGV4Y2x1ZGVCb3gpO1xuICAgICAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGJveC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHJlbW92ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgZ3JpZEVuZ2luZS5yZW1vdmVCb3goYm94KTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemVzIGEgYm94LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplQm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAvLyBJbiBjYXNlIGJveCBpcyBub3QgdXBkYXRlZCBieSBkcmFnZ2luZyAvIHJlc2l6aW5nLlxuICAgICAgICBncmlkVmlldy5yZW5kZXJCb3gobW92ZWRCb3hlcyk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gZWl0aGVyIHJlc2l6ZSBvciBkcmFnIHN0YXJ0cy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHVwZGF0ZVN0YXJ0ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBncmlkRW5naW5lLmluY3JlYXNlTnVtUm93cyhib3gsIDEpO1xuICAgICAgICBncmlkRW5naW5lLmluY3JlYXNlTnVtQ29sdW1ucyhib3gsIDEpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdoZW4gZHJhZ2dpbmcgLyByZXNpemluZyBpcyBkcm9wcGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlID0gZnVuY3Rpb24gKGJveCkge1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGRyYWdnaW5nIC8gcmVzaXppbmcgaXMgZHJvcHBlZC5cbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBncmlkRW5naW5lLmRlY3JlYXNlTnVtUm93cygpO1xuICAgICAgICBncmlkRW5naW5lLmRlY3JlYXNlTnVtQ29sdW1ucygpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIGxldCByZWZyZXNoR3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyQm94KGRhc2hncmlkLmJveGVzKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIHVwZGF0ZUJveDogdXBkYXRlQm94LFxuICAgICAgICB1cGRhdGVTdGFydDogdXBkYXRlU3RhcnQsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICB1cGRhdGVFbmQ6IHVwZGF0ZUVuZCxcbiAgICAgICAgcmVmcmVzaEdyaWQ6IHJlZnJlc2hHcmlkXG4gICAgfSk7XG59XG4iLCJpbXBvcnQge3JlbW92ZU5vZGVzLCBhZGRFdmVudH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmltcG9ydCB7Ym94Q29udGFpbmVyRWxlbWVudE1vZGVsfSBmcm9tICcuL2JveENvbnRhaW5lckVsZW1lbnRNb2RlbC5qcyc7XG5pbXBvcnQge2hvcml6b250YWxMaW5lRWxlbWVudE1vZGVsfSBmcm9tICcuL2hvcml6b250YWxMaW5lRWxlbWVudE1vZGVsLmpzJztcbmltcG9ydCB7dmVydGljYWxMaW5lRWxlbWVudE1vZGVsfSBmcm9tICcuL3ZlcnRpY2FsTGluZUVsZW1lbnRNb2RlbC5qcyc7XG5pbXBvcnQge2NlbnRyb2lkRWxlbWVudE1vZGVsfSBmcm9tICcuL2NlbnRyb2lkRWxlbWVudE1vZGVsLmpzJztcblxuZXhwb3J0IHtncmlkRWxlbWVudE1vZGVsfTtcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IFRoZSBET00gZWxlbWVudCB0byB3aGljaCB0byBhdHRhY2ggdGhlIGdyaWQgZWxlbWVudCBjb250ZW50LiAgXG4gKiBAcGFyYW0ge09iamVjdH0gZ3JpZFN0YXRlIFRoZSBncmlkIHN0YXRlLiBcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkb20gZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gZ3JpZEVsZW1lbnRNb2RlbChlbGVtZW50LCBncmlkU3RhdGUpIHtcbiAgICBsZXQgZ3JpZEVsZW1lbnQgPSB7fTtcblxuICAgIGdyaWRFbGVtZW50LmVsZW1lbnQgPSBlbGVtZW50O1xuXG4gICAgLy8gUHJvcGVydGllcy5cbiAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgZWxlbWVudC5zdHlsZS56SW5kZXggPSAnMTAwMCc7ICBcblxuICAgIC8vIENoaWxkcmVuLlxuICAgIGxldCBib3hlcyA9IHtlbGVtZW50OiBib3hDb250YWluZXJFbGVtZW50TW9kZWwoKX07XG4gICAgZ3JpZEVsZW1lbnQuYm94ZXMgPSBib3hlcy5lbGVtZW50O1xuICAgIGdyaWRFbGVtZW50LmVsZW1lbnQuYXBwZW5kQ2hpbGQoYm94ZXMuZWxlbWVudCk7XG5cbiAgICBpZiAoZ3JpZFN0YXRlLnNob3dIb3Jpem9udGFsTGluZSkge1xuICAgICAgICBsZXQgaG9yaXpvbnRhbExpbmUgPSB7ZWxlbWVudDogaG9yaXpvbnRhbExpbmVFbGVtZW50TW9kZWwoKX07XG4gICAgICAgIGdyaWRFbGVtZW50Lmhvcml6b250YWxMaW5lID0gaG9yaXpvbnRhbExpbmUuZWxlbWVudDtcbiAgICAgICAgZ3JpZEVsZW1lbnQuZWxlbWVudC5hcHBlbmRDaGlsZChob3Jpem9udGFsTGluZS5lbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZ3JpZFN0YXRlLnNob3dWZXJ0aWNhbExpbmUpIHtcbiAgICAgICAgbGV0IHZlcnRpY2FsTGluZSA9IHtlbGVtZW50OiB2ZXJ0aWNhbExpbmVFbGVtZW50TW9kZWwoKX07XG4gICAgICAgIGdyaWRFbGVtZW50LnZlcnRpY2FsTGluZSA9IHZlcnRpY2FsTGluZS5lbGVtZW50O1xuICAgICAgICBncmlkRWxlbWVudC5lbGVtZW50LmFwcGVuZENoaWxkKHZlcnRpY2FsTGluZS5lbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZ3JpZFN0YXRlLnNob3dDZW50cm9pZCkge1xuICAgICAgICBsZXQgY2VudHJvaWQgPSB7ZWxlbWVudDogY2VudHJvaWRFbGVtZW50TW9kZWwoKX07XG4gICAgICAgIGdyaWRFbGVtZW50LmNlbnRyb2lkID0gY2VudHJvaWQuZWxlbWVudDtcbiAgICAgICAgZ3JpZEVsZW1lbnQuZWxlbWVudC5hcHBlbmRDaGlsZChjZW50cm9pZC5lbGVtZW50KTtcbiAgICB9XG5cbiAgICAvLyBFdmVudCBsaXN0ZW5lcnMuXG4gICAgYWRkRXZlbnQod2luZG93LCAncmVzaXplJywgKCkgPT4ge1xuICAgICAgICByZW5kZXJlci5zZXRDb2x1bW5XaWR0aCgpO1xuICAgICAgICByZW5kZXJlci5zZXRSb3dIZWlnaHQoKTtcbiAgICAgICAgZ3JpZC5yZWZyZXNoR3JpZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdyaWRFbGVtZW50O1xufTtcbiIsImltcG9ydCB7cmVtb3ZlTm9kZXMsIGluc2VydGlvblNvcnQsIGdldE1heE51bX0gZnJvbSAnLi91dGlscy5qcyc7XG4vLyBpbXBvcnQge2JveH0gZnJvbSAnLi9ib3guanMnO1xuXG5leHBvcnQge2dyaWRFbmdpbmVNb2RlbH07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBIYW5kbGVzIGNvbGxpc2lvbiBsb2dpYyBhbmQgZGFzaGdyaWQgZGltZW5zaW9uLlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5mdW5jdGlvbiBncmlkRW5naW5lTW9kZWwoKSB7XG5cbiAgICBsZXQgaW5pdCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvLyB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgIC8vIHVwZGF0ZU51bUNvbHVtbnMoKTtcbiAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHJpZXZlIGNvcnJlc3BvbmRpbmcganMgb2JqZWN0IGZyb20gYm94ZXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgRE9NIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge09iamVjdH0gYm94IEdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHVybiBjb3JyZXNwb25kaW5nIGJveCBvYmplY3QuXG4gICAgICovXG4gICAgbGV0IGdldEJveCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGJveGVzW2ldLl9lbGVtZW50ID09PSBlbGVtZW50KSB7cmV0dXJuIGJveGVzW2ldfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb3B5IGJveCBwb3NpdGlvbnMuXG4gICAgICogQHJldHVybnMge0FycmF5LjxPYmplY3Q+fSBQcmV2aW91cyBib3ggcG9zaXRpb25zLlxuICAgICAqL1xuICAgIGxldCBjb3B5Qm94ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBwcmV2UG9zaXRpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm94ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHByZXZQb3NpdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93OiBib3hlc1tpXS5yb3csXG4gICAgICAgICAgICAgICAgY29sdW1uOiBib3hlc1tpXS5jb2x1bW4sXG4gICAgICAgICAgICAgICAgY29sdW1uc3BhbjogYm94ZXNbaV0uY29sdW1uc3BhbixcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBib3hlc1tpXS5yb3dzcGFuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcHJldlBvc2l0aW9ucztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZSBPbGQgcG9zaXRpb25zLlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IFByZXZpb3VzIHBvc2l0aW9ucy5cbiAgICAgKi9cbiAgICBsZXQgcmVzdG9yZU9sZFBvc2l0aW9ucyA9IGZ1bmN0aW9uIChwcmV2UG9zaXRpb25zKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm94ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJveGVzW2ldLnJvdyA9IHByZXZQb3NpdGlvbnNbaV0ucm93LFxuICAgICAgICAgICAgYm94ZXNbaV0uY29sdW1uID0gcHJldlBvc2l0aW9uc1tpXS5jb2x1bW4sXG4gICAgICAgICAgICBib3hlc1tpXS5jb2x1bW5zcGFuID0gcHJldlBvc2l0aW9uc1tpXS5jb2x1bW5zcGFuLFxuICAgICAgICAgICAgYm94ZXNbaV0ucm93c3BhbiA9IHByZXZQb3NpdGlvbnNbaV0ucm93c3BhblxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBib3ggZ2l2ZW4gaXRzIGluZGV4IGluIHRoZSBib3hlcyBhcnJheS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm94SW5kZXguXG4gICAgICovXG4gICAgbGV0IHJlbW92ZUJveCA9IGZ1bmN0aW9uIChib3hJbmRleCkge1xuICAgICAgICBsZXQgZWxlbSA9IGJveGVzW2JveEluZGV4XS5fZWxlbWVudDtcbiAgICAgICAgZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW0pO1xuICAgICAgICBib3hlcy5zcGxpY2UoYm94SW5kZXgsIDEpO1xuXG4gICAgICAgIC8vIEluIGNhc2UgZmxvYXRpbmcgaXMgb24uXG4gICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBib3guIEJveCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgdGhlIHNpemUgYW5kIHBvc2l0aW9uIG9mIHRoZSBib3gsXG4gICAgICogY29udGVudCBlbGVtZW50IGlzIG9wdGlvbmFsLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3ggQm94IGRpbWVuc2lvbnMuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElmIGluc2VydCB3YXMgcG9zc2libGUuXG4gICAgICovXG4gICAgbGV0IGluc2VydEJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgbW92aW5nQm94ID0gYm94O1xuXG4gICAgICAgIGlmIChib3gucm93cyA9PT0gdW5kZWZpbmVkICYmIGJveC5jb2x1bW4gPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgYm94LnJvd3NwYW4gPT09IHVuZGVmaW5lZCAmJiBib3guY29sdW1uc3BhbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVXBkYXRlVmFsaWQoYm94KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByZXZQb3NpdGlvbnMgPSBjb3B5Qm94ZXMoKTtcblxuICAgICAgICBsZXQgbW92ZWRCb3hlcyA9IFtib3hdO1xuICAgICAgICBsZXQgdmFsaWRNb3ZlID0gbW92ZUJveChib3gsIGJveCwgbW92ZWRCb3hlcyk7XG4gICAgICAgIG1vdmluZ0JveCA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICBib3hIYW5kbGVyLmNyZWF0ZUJveChib3gpO1xuICAgICAgICAgICAgYm94ZXMucHVzaChib3gpO1xuXG4gICAgICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG4gICAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdG9yZU9sZFBvc2l0aW9ucyhwcmV2UG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgYSBwb3NpdGlvbiBvciBzaXplIG9mIGJveC5cbiAgICAgKlxuICAgICAqIFdvcmtzIGluIHBvc3RlcmlvciBmYXNoaW9uLCBha2luIHRvIGFzayBmb3IgZm9yZ2l2ZW5lc3MgcmF0aGVyIHRoYW4gZm9yXG4gICAgICogcGVybWlzc2lvbi5cbiAgICAgKiBMb2dpYzpcbiAgICAgKlxuICAgICAqIDEuIElzIHVwZGF0ZVRvIGEgdmFsaWQgc3RhdGU/XG4gICAgICogICAgMS4xIE5vOiBSZXR1cm4gZmFsc2UuXG4gICAgICogMi4gU2F2ZSBwb3NpdGlvbnMuXG4gICAgICogMy4gTW92ZSBib3guXG4gICAgICogICAgICAzLjEuIElzIGJveCBvdXRzaWRlIGJvcmRlcj9cbiAgICAgKiAgICAgICAgICAzLjEuMS4gWWVzOiBDYW4gYm9yZGVyIGJlIHB1c2hlZD9cbiAgICAgKiAgICAgICAgICAgICAgMy4xLjEuMS4gWWVzOiBFeHBhbmQgYm9yZGVyLlxuICAgICAqICAgICAgICAgICAgICAzLjEuMS4yLiBObzogUmV0dXJuIGZhbHNlLlxuICAgICAqICAgICAgMy4yLiBEb2VzIGJveCBjb2xsaWRlP1xuICAgICAqICAgICAgICAgIDMuMi4xLiBZZXM6IENhbGN1bGF0ZSBuZXcgYm94IHBvc2l0aW9uIGFuZFxuICAgICAqICAgICAgICAgICAgICAgICBnbyBiYWNrIHRvIHN0ZXAgMSB3aXRoIHRoZSBuZXcgY29sbGlkZWQgYm94LlxuICAgICAqICAgICAgICAgIDMuMi4yLiBObzogUmV0dXJuIHRydWUuXG4gICAgICogNC4gSXMgbW92ZSB2YWxpZD9cbiAgICAgKiAgICA0LjEuIFllczogVXBkYXRlIG51bWJlciByb3dzIC8gY29sdW1ucy5cbiAgICAgKiAgICA0LjIuIE5vOiBSZXZlcnQgdG8gb2xkIHBvc2l0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3ggVGhlIGJveCBiZWluZyB1cGRhdGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1cGRhdGVUbyBUaGUgbmV3IHN0YXRlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn0gbW92ZWRCb3hlc1xuICAgICAqL1xuICAgIGxldCB1cGRhdGVCb3ggPSBmdW5jdGlvbiAoYm94LCB1cGRhdGVUbykge1xuICAgICAgICBtb3ZpbmdCb3ggPSBib3g7XG5cbiAgICAgICAgbGV0IHByZXZQb3NpdGlvbnMgPSBjb3B5Qm94ZXMoKVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYm94LCB1cGRhdGVUbyk7XG4gICAgICAgIGlmICghaXNVcGRhdGVWYWxpZChib3gpKSB7XG4gICAgICAgICAgICByZXN0b3JlT2xkUG9zaXRpb25zKHByZXZQb3NpdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1vdmVkQm94ZXMgPSBbYm94XTtcbiAgICAgICAgbGV0IHZhbGlkTW92ZSA9IG1vdmVCb3goYm94LCBib3gsIG1vdmVkQm94ZXMpO1xuXG4gICAgICAgIGlmICh2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1vdmVkQm94ZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXN0b3JlT2xkUG9zaXRpb25zKHByZXZQb3NpdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGFuZCBoYW5kbGVzIGNvbGxpc2lvbnMgd2l0aCB3YWxsIGFuZCBib3hlcy5cbiAgICAgKiBXb3JrcyBhcyBhIHRyZWUsIHByb3BhZ2F0aW5nIG1vdmVzIGRvd24gdGhlIGNvbGxpc2lvbiB0cmVlIGFuZCByZXR1cm5zXG4gICAgICogICAgIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIGlmIHRoZSBib3ggaW5mcm9udCBpcyBhYmxlIHRvIG1vdmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4Y2x1ZGVCb3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBtb3ZlIGlzIHBvc3NpYmxlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgbGV0IG1vdmVCb3ggPSBmdW5jdGlvbiAoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIGlmIChpc0JveE91dHNpZGVCb3VuZGFyeShib3gpKSB7cmV0dXJuIGZhbHNlO31cblxuICAgICAgICBsZXQgaW50ZXJzZWN0ZWRCb3hlcyA9IGdldEludGVyc2VjdGVkQm94ZXMoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKTtcblxuICAgICAgICAvLyBIYW5kbGUgYm94IENvbGxpc2lvbiwgcmVjdXJzaXZlIG1vZGVsLlxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW50ZXJzZWN0ZWRCb3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKCFjb2xsaXNpb25IYW5kbGVyKGJveCwgaW50ZXJzZWN0ZWRCb3hlc1tpXSwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJvcGFnYXRlcyBib3ggY29sbGlzaW9ucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG1vdmVkQm94ZXNcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiBtb3ZlIGlzIGFsbG93ZWRcbiAgICAgKi9cbiAgICBsZXQgY29sbGlzaW9uSGFuZGxlciA9IGZ1bmN0aW9uIChib3gsIGJveEIsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpIHtcbiAgICAgICAgc2V0Qm94UG9zaXRpb24oYm94LCBib3hCKVxuICAgICAgICByZXR1cm4gbW92ZUJveChib3hCLCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBuZXcgYm94IHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBib3ggdGhhdCBwdXNoZWQgaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBCb3ggd2hpY2ggaGFzIG1vdmVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCIEJveCB3aGljaCBpcyB0byBiZSBtb3ZlZC5cbiAgICAgKi9cbiAgICBsZXQgc2V0Qm94UG9zaXRpb24gPSBmdW5jdGlvbiAoYm94LCBib3hCKSB7XG4gICAgICAgIGJveEIucm93ICs9IGJveC5yb3cgKyBib3gucm93c3BhbiAtIGJveEIucm93O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGJveCwgZmluZHMgb3RoZXIgYm94ZXMgd2hpY2ggaW50ZXJzZWN0IHdpdGggaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4Y2x1ZGVCb3ggQXJyYXkgb2YgYm94ZXMuXG4gICAgICovXG4gICAgbGV0IGdldEludGVyc2VjdGVkQm94ZXMgPSBmdW5jdGlvbiAoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIGxldCBpbnRlcnNlY3RlZEJveGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgLy8gRG9uJ3QgY2hlY2sgbW92aW5nIGJveCBhbmQgdGhlIGJveCBpdHNlbGYuXG4gICAgICAgICAgICBpZiAoYm94ICE9PSBib3hlc1tpXSAmJiBib3hlc1tpXSAhPT0gZXhjbHVkZUJveCkge1xuICAgICAgICAgICAgICAgIGlmIChkb0JveGVzSW50ZXJzZWN0KGJveCwgYm94ZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkQm94ZXMucHVzaChib3hlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdGVkQm94ZXMucHVzaChib3hlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluc2VydGlvblNvcnQoaW50ZXJzZWN0ZWRCb3hlcywgJ3JvdycpO1xuXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3RlZEJveGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciAyIGJveGVzIGludGVyc2VjdCB1c2luZyBib3VuZGluZyBib3ggbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hBXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuIFRydWUgaWYgaW50ZXJzZWN0IGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGRvQm94ZXNJbnRlcnNlY3QgPSBmdW5jdGlvbiAoYm94LCBib3hCKSB7XG4gICAgICAgIHJldHVybiAoYm94LmNvbHVtbiA8IGJveEIuY29sdW1uICsgYm94Qi5jb2x1bW5zcGFuICYmXG4gICAgICAgICAgICAgICAgYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuID4gYm94Qi5jb2x1bW4gJiZcbiAgICAgICAgICAgICAgICBib3gucm93IDwgYm94Qi5yb3cgKyBib3hCLnJvd3NwYW4gJiZcbiAgICAgICAgICAgICAgICBib3gucm93c3BhbiArIGJveC5yb3cgPiBib3hCLnJvdyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIG51bWJlciBvZiBjb2x1bW5zLlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVOdW1Db2x1bW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWF4Q29sdW1uID0gZ2V0TWF4TnVtKGJveGVzLCAnY29sdW1uJywgJ2NvbHVtbnNwYW4nKTtcblxuICAgICAgICBpZiAobWF4Q29sdW1uID49IGRhc2hncmlkLm1pbkNvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPSBtYXhDb2x1bW47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1vdmluZ0JveCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLm51bUNvbHVtbnMgLSBtb3ZpbmdCb3guY29sdW1uIC0gbW92aW5nQm94LmNvbHVtbnNwYW4gPT09IDAgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPCBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZGFzaGdyaWQubnVtQ29sdW1ucyAtIG1vdmluZ0JveC5jb2x1bW4tIG1vdmluZ0JveC5jb2x1bW5zcGFuID4gMSAmJlxuICAgICAgICAgICAgbW92aW5nQm94LmNvbHVtbiArIG1vdmluZ0JveC5jb2x1bW5zcGFuID09PSBtYXhDb2x1bW4gJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPiBkYXNoZ3JpZC5taW5Db2x1bW5zICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zIDwgZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA9IG1heENvbHVtbiArIDE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5jcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIGlmIGJveCB0b3VjaGVzIGJvdHRvbSBvZiB3YWxsLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtQ29sdW1uc1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluY3JlYXNlIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGluY3JlYXNlTnVtQ29sdW1ucyA9IGZ1bmN0aW9uIChib3gsIG51bUNvbHVtbnMpIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZW4gdG8gYWRkIGV4dHJhIHJvdyB0byBiZSBhYmxlIHRvIG1vdmUgZG93bjpcbiAgICAgICAgLy8gMS4gQW55dGltZSBkcmFnZ2luZyBzdGFydHMuXG4gICAgICAgIC8vIDIuIFdoZW4gZHJhZ2dpbmcgc3RhcnRzIGFuZCBtb3ZpbmcgYm94IGlzIGNsb3NlIHRvIGJvdHRvbSBib3JkZXIuXG4gICAgICAgIGlmICgoYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuKSA9PT0gZGFzaGdyaWQubnVtQ29sdW1ucyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA8IGRhc2hncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgKz0gMTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNyZWFzZXMgbnVtYmVyIG9mIGRhc2hncmlkLm51bVJvd3MgdG8gZnVydGhlc3QgbGVmdHdhcmQgYm94LlxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkZWNyZWFzZU51bUNvbHVtbnMgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICBsZXQgbWF4Q29sdW1uTnVtID0gMDtcblxuICAgICAgICBib3hlcy5mb3JFYWNoKGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCAoYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuKSkge1xuICAgICAgICAgICAgICAgIG1heENvbHVtbk51bSA9IGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1heENvbHVtbk51bSA8IGRhc2hncmlkLm51bUNvbHVtbnMpIHtkYXNoZ3JpZC5udW1Db2x1bW5zID0gbWF4Q29sdW1uTnVtO31cbiAgICAgICAgaWYgKG1heENvbHVtbk51bSA8IGRhc2hncmlkLm1pbkNvbHVtbnMpIHtkYXNoZ3JpZC5udW1Db2x1bW5zID0gZGFzaGdyaWQubWluQ29sdW1uczt9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciByb3dzIGRlcGVuZHMgb24gdGhyZWUgdGhpbmdzLlxuICAgICAqIDx1bD5cbiAgICAgKiAgICAgPGxpPk1pbiAvIE1heCBSb3dzLjwvbGk+XG4gICAgICogICAgIDxsaT5NYXggQm94LjwvbGk+XG4gICAgICogICAgIDxsaT5EcmFnZ2luZyBib3ggbmVhciBib3R0b20gYm9yZGVyLjwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVOdW1Sb3dzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWF4Um93ID0gZ2V0TWF4TnVtKGJveGVzLCAncm93JywgJ3Jvd3NwYW4nKTtcblxuICAgICAgICBpZiAobWF4Um93ID49IGRhc2hncmlkLm1pblJvd3MpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPSBtYXhSb3c7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1vdmluZ0JveCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW92aW5nIGJveCB3aGVuIGNsb3NlIHRvIGJvcmRlci5cbiAgICAgICAgaWYgKGRhc2hncmlkLm51bVJvd3MgLSBtb3ZpbmdCb3gucm93IC0gbW92aW5nQm94LnJvd3NwYW4gPT09IDAgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPCBkYXNoZ3JpZC5tYXhSb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZGFzaGdyaWQubnVtUm93cyAtIG1vdmluZ0JveC5yb3cgLSBtb3ZpbmdCb3gucm93c3BhbiA+IDEgJiZcbiAgICAgICAgICAgIG1vdmluZ0JveC5yb3cgKyBtb3ZpbmdCb3gucm93c3BhbiA9PT0gbWF4Um93ICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzID4gZGFzaGdyaWQubWluUm93cyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA8IGRhc2hncmlkLm1heFJvd3MpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPSBtYXhSb3cgKyAxO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5jcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIGlmIGJveCB0b3VjaGVzIGJvdHRvbSBvZiB3YWxsLlxuICAgICAqIEBwYXJhbSBib3gge09iamVjdH1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBpbmNyZWFzZU51bVJvd3MgPSBmdW5jdGlvbiAoYm94LCBudW1Sb3dzKSB7XG4gICAgICAgIC8vIERldGVybWluZSB3aGVuIHRvIGFkZCBleHRyYSByb3cgdG8gYmUgYWJsZSB0byBtb3ZlIGRvd246XG4gICAgICAgIC8vIDEuIEFueXRpbWUgZHJhZ2dpbmcgc3RhcnRzLlxuICAgICAgICAvLyAyLiBXaGVuIGRyYWdnaW5nIHN0YXJ0cyBBTkQgbW92aW5nIGJveCBpcyBjbG9zZSB0byBib3R0b20gYm9yZGVyLlxuICAgICAgICBpZiAoKGJveC5yb3cgKyBib3gucm93c3BhbikgPT09IGRhc2hncmlkLm51bVJvd3MgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPCBkYXNoZ3JpZC5tYXhSb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIHRvIGZ1cnRoZXN0IGRvd253YXJkIGJveC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkZWNyZWFzZU51bVJvd3MgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICBsZXQgbWF4Um93TnVtID0gMDtcblxuICAgICAgICBib3hlcy5mb3JFYWNoKGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgICAgIGlmIChtYXhSb3dOdW0gPCAoYm94LnJvdyArIGJveC5yb3dzcGFuKSkge1xuICAgICAgICAgICAgICAgIG1heFJvd051bSA9IGJveC5yb3cgKyBib3gucm93c3BhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1heFJvd051bSA8IGRhc2hncmlkLm51bVJvd3MpIHtkYXNoZ3JpZC5udW1Sb3dzID0gbWF4Um93TnVtO31cbiAgICAgICAgaWYgKG1heFJvd051bSA8IGRhc2hncmlkLm1pblJvd3MpIHtkYXNoZ3JpZC5udW1Sb3dzID0gZGFzaGdyaWQubWluUm93czt9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBtaW4sIG1heCBib3gtc2l6ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgbGV0IGlzVXBkYXRlVmFsaWQgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGlmIChib3gucm93c3BhbiA8IGRhc2hncmlkLm1pblJvd3NwYW4gfHxcbiAgICAgICAgICAgIGJveC5yb3dzcGFuID4gZGFzaGdyaWQubWF4Um93c3BhbiB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbnNwYW4gPCBkYXNoZ3JpZC5taW5Db2x1bW5zcGFuIHx8XG4gICAgICAgICAgICBib3guY29sdW1uc3BhbiA+IGRhc2hncmlkLm1heENvbHVtbnNwYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGJvcmRlciBjb2xsaXNpb25zIGJ5IHJldmVydGluZyBiYWNrIHRvIGNsb3Nlc3QgZWRnZSBwb2ludC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgY29sbGlkZWQgYW5kIGNhbm5vdCBtb3ZlIHdhbGwgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaXNCb3hPdXRzaWRlQm91bmRhcnkgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIC8vIFRvcCBhbmQgbGVmdCBib3JkZXIuXG4gICAgICAgIGlmIChib3guY29sdW1uIDwgMCB8fFxuICAgICAgICAgICAgYm94LnJvdyA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmlnaHQgYW5kIGJvdHRvbSBib3JkZXIuXG4gICAgICAgIGlmIChib3gucm93ICsgYm94LnJvd3NwYW4gPiBkYXNoZ3JpZC5tYXhSb3dzIHx8XG4gICAgICAgICAgICBib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW4gPiBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0LFxuICAgICAgICB1cGRhdGVCb3gsXG4gICAgICAgIHVwZGF0ZU51bVJvd3MsXG4gICAgICAgIGluY3JlYXNlTnVtUm93cyxcbiAgICAgICAgZGVjcmVhc2VOdW1Sb3dzLFxuICAgICAgICB1cGRhdGVOdW1Db2x1bW5zLFxuICAgICAgICBpbmNyZWFzZU51bUNvbHVtbnMsXG4gICAgICAgIGRlY3JlYXNlTnVtQ29sdW1ucyxcbiAgICAgICAgZ2V0Qm94LFxuICAgICAgICBpbnNlcnRCb3gsXG4gICAgICAgIHJlbW92ZUJveFxuICAgIH0pO1xufVxuIiwiZXhwb3J0IHtncmlkRW5naW5lU3RhdGV9O1xuXG5sZXQgZ3JpZEVuZ2luZVN0YXRlID0ge1xuICAgIGJveGVzOiBbXSxcbiAgICBtb3ZpbmdCb3g6IHVuZGVmaW5lZCxcbiAgICBtb3ZlZEJveGVzOiBbXVxufTtcbiIsImV4cG9ydCB7Z3JpZFN0YXRlTW9kZWx9O1xuXG5mdW5jdGlvbiBncmlkU3RhdGVNb2RlbChvcHRpb25zKSB7XG5cbiAgICBsZXQgZ3JpZFN0YXRlTW9kZWwgPSB7XG4gICAgICAgIHJvd0hlaWdodDogb3B0aW9ucy5yb3dIZWlnaHQsXG4gICAgICAgIG51bVJvd3M6IChvcHRpb25zLm51bVJvd3MgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm51bVJvd3MgOiA2LFxuICAgICAgICBtaW5Sb3dzOiAob3B0aW9ucy5taW5Sb3dzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5taW5Sb3dzIDogNixcbiAgICAgICAgbWF4Um93czogKG9wdGlvbnMubWF4Um93cyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubWF4Um93cyA6IDEwLFxuXG4gICAgICAgIGV4dHJhUm93czogMCxcbiAgICAgICAgZXh0cmFDb2x1bW5zOiAwLFxuXG4gICAgICAgIGNvbHVtbldpZHRoOiBvcHRpb25zLmNvbHVtbldpZHRoLFxuICAgICAgICBudW1Db2x1bW5zOiAob3B0aW9ucy5udW1Db2x1bW5zICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5udW1Db2x1bW5zIDogNixcbiAgICAgICAgbWluQ29sdW1uczogKG9wdGlvbnMubWluQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubWluQ29sdW1ucyA6IDYsXG4gICAgICAgIG1heENvbHVtbnM6IChvcHRpb25zLm1heENvbHVtbnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm1heENvbHVtbnMgOiAxMCxcblxuICAgICAgICB4TWFyZ2luOiAob3B0aW9ucy54TWFyZ2luICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy54TWFyZ2luIDogMjAsXG4gICAgICAgIHlNYXJnaW46IChvcHRpb25zLnlNYXJnaW4gIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLnlNYXJnaW4gOiAyMCxcblxuICAgICAgICBkZWZhdWx0Qm94Um93c3BhbjogMixcbiAgICAgICAgZGVmYXVsdEJveENvbHVtbnNwYW46IDEsXG5cbiAgICAgICAgbWluUm93c3BhbjogKG9wdGlvbnMubWluUm93c3BhbiAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubWluUm93c3BhbiA6IDEsXG4gICAgICAgIG1heFJvd3NwYW46IChvcHRpb25zLm1heFJvd3NwYW4gIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm1heFJvd3NwYW4gOiA5OTk5LFxuXG4gICAgICAgIG1pbkNvbHVtbnNwYW46IChvcHRpb25zLm1pbkNvbHVtbnNwYW4gIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm1pbkNvbHVtbnNwYW4gOiAxLFxuICAgICAgICBtYXhDb2x1bW5zcGFuOiAob3B0aW9ucy5tYXhDb2x1bW5zcGFuICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5tYXhDb2x1bW5zcGFuIDogOTk5OSxcblxuICAgICAgICBwdXNoYWJsZTogKG9wdGlvbnMucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChvcHRpb25zLmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChvcHRpb25zLnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChvcHRpb25zLnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZTogKG9wdGlvbnMuYW5pbWF0ZSA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG5cbiAgICAgICAgbGl2ZUNoYW5nZXM6IChvcHRpb25zLmxpdmVDaGFuZ2VzID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG5cbiAgICAgICAgLy8gRHJhZyBoYW5kbGUgY2FuIGJlIGEgY3VzdG9tIGNsYXNzbmFtZSBvciBpZiBub3Qgc2V0IHJldmVycyB0byB0aGVcbiAgICAgICAgLy8gYm94IGNvbnRhaW5lciB3aXRoIGNsYXNzbmFtZSAnZGFzaGdyaWQtYm94Jy5cbiAgICAgICAgZHJhZ2dhYmxlOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogKG9wdGlvbnMuZHJhZ2dhYmxlICYmIG9wdGlvbnMuZHJhZ2dhYmxlLmVuYWJsZWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoYW5kbGU6IChvcHRpb25zLmRyYWdnYWJsZSAmJiBvcHRpb25zLmRyYWdnYWJsZS5oYW5kbGUpIHx8ICdkYXNoZ3JpZC1ib3gnLFxuXG4gICAgICAgICAgICAgICAgLy8gdXNlciBjYidzLlxuICAgICAgICAgICAgICAgIGRyYWdTdGFydDogb3B0aW9ucy5kcmFnZ2FibGUgJiYgb3B0aW9ucy5kcmFnZ2FibGUuZHJhZ1N0YXJ0LFxuICAgICAgICAgICAgICAgIGRyYWdnaW5nOiBvcHRpb25zLmRyYWdnYWJsZSAmJiBvcHRpb25zLmRyYWdnYWJsZS5kcmFnZ2luZyxcbiAgICAgICAgICAgICAgICBkcmFnRW5kOiBvcHRpb25zLmRyYWdnYWJsZSAmJiBvcHRpb25zLmRyYWdnYWJsZS5kcmFnRW5kXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzaXphYmxlOiB7XG4gICAgICAgICAgICBlbmFibGVkOiAob3B0aW9ucy5yZXNpemFibGUgJiYgb3B0aW9ucy5yZXNpemFibGUuZW5hYmxlZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgaGFuZGxlOiAob3B0aW9ucy5yZXNpemFibGUgJiYgb3B0aW9ucy5yZXNpemFibGUuaGFuZGxlKSB8fCBbJ24nLCAnZScsICdzJywgJ3cnLCAnbmUnLCAnc2UnLCAnc3cnLCAnbncnXSxcbiAgICAgICAgICAgIGhhbmRsZVdpZHRoOiAob3B0aW9ucy5yZXNpemFibGUgJiYgIG9wdGlvbnMucmVzaXphYmxlLmhhbmRsZVdpZHRoICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5yZXNpemFibGUuaGFuZGxlV2lkdGggOiAxMCxcblxuICAgICAgICAgICAgLy8gdXNlciBjYidzLlxuICAgICAgICAgICAgcmVzaXplU3RhcnQ6IG9wdGlvbnMucmVzaXphYmxlICYmIG9wdGlvbnMucmVzaXphYmxlLnJlc2l6ZVN0YXJ0LFxuICAgICAgICAgICAgcmVzaXppbmc6IG9wdGlvbnMucmVzaXphYmxlICYmIG9wdGlvbnMucmVzaXphYmxlLnJlc2l6aW5nLFxuICAgICAgICAgICAgcmVzaXplRW5kOiBvcHRpb25zLnJlc2l6YWJsZSAmJiBvcHRpb25zLnJlc2l6YWJsZS5yZXNpemVFbmRcbiAgICAgICAgfSxcblxuICAgICAgICBvblVwZGF0ZTogKCkgPT4ge30sXG5cbiAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgLjNzLCBsZWZ0IC4zcywgdG9wIC4zcywgd2lkdGggLjNzLCBoZWlnaHQgLjNzJyxcbiAgICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDIwLFxuICAgICAgICBzY3JvbGxTcGVlZDogMTAsXG4gICAgICAgIHNuYXBCYWNrVGltZTogKG9wdGlvbnMuc25hcEJhY2tUaW1lID09PSB1bmRlZmluZWQpID8gMzAwIDogb3B0aW9ucy5zbmFwQmFja1RpbWUsXG5cbiAgICAgICAgc2hvd1ZlcnRpY2FsTGluZTogKG9wdGlvbnMuc2hvd1ZlcnRpY2FsTGluZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBzaG93SG9yaXpvbnRhbExpbmU6IChvcHRpb25zLnNob3dIb3Jpem9udGFsTGluZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBzaG93Q2VudHJvaWQ6IChvcHRpb25zLnNob3dDZW50cm9pZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlXG4gICAgfTtcblxuICAgIHJldHVybiBncmlkU3RhdGVNb2RlbDtcbn07XG4iLCJleHBvcnQge2dyaWRWaWV3U3RhdGV9O1xuXG5sZXQgZ3JpZFZpZXdTdGF0ZSA9IHtcbiAgICBncmlkTGluZXNFbGVtZW50OiB1bmRlZmluZWQsXG4gICAgZ3JpZENlbnRyb2lkc0VsZW1lbnQ6IHVuZGVmaW5lZFxufTtcbiIsImV4cG9ydCB7aG9yaXpvbnRhbExpbmVFbGVtZW50TW9kZWx9O1xuXG5mdW5jdGlvbiBob3Jpem9udGFsTGluZUVsZW1lbnRNb2RlbCgpIHtcbiAgICBsZXQgaG9yaXpvbnRhbExpbmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG9yaXpvbnRhbExpbmVFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ncmlkLWxpbmVzOydcblxuICAgIHJldHVybiBob3Jpem9udGFsTGluZUVsZW1lbnQ7IFxufVxuIiwiZXhwb3J0IHtyZW5kZXJTdGF0ZU1vZGVsfTtcblxuZnVuY3Rpb24gcmVuZGVyU3RhdGVNb2RlbCAoKSB7XG4gICAgLy8gU3RhcnQgcm93IC8gY29sdW1uIGRlbm90ZXMgdGhlIHBpeGVsIGF0IHdoaWNoIGVhY2ggY2VsbCBzdGFydHMgYXQuXG4gICAgbGV0IHJlbmRlclN0YXRlTW9kZWwgPSB7XG4gICAgICAgIHN0YXJ0Q29sdW1uOiBbXSxcbiAgICAgICAgc3RhcnRSb3c6IFtdLFxuICAgICAgICBjb2x1bW5XaWR0aDogdW5kZWZpbmVkLFxuICAgICAgICByb3dIZWlnaHQ6IHVuZGVmaW5lZCAgXG4gICAgfTtcblxuICAgIHJldHVybiByZW5kZXJTdGF0ZU1vZGVsO1xufVxuIiwiLy8gc2hpbSBsYXllciB3aXRoIHNldFRpbWVvdXQgZmFsbGJhY2sgZm9yIHJlcXVpZXN0QW5pbWF0aW9uRnJhbWVcbndpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICBmdW5jdGlvbiAoY2Ipe1xuICAgICAgICAgICAgY2IgPSBjYiB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNiLCAxMDAwIC8gNjApO1xuICAgICAgICB9O1xufSkoKTsiLCJcbi8qKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAqIEBwYXJhbSB7c3RyaW5nfSBhdDFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhdDJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXhOdW0oYm94LCBhdDEsIGF0Mikge1xuICAgIGxldCBtYXhWYWwgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBib3gubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGJveFtpXVthdDFdICsgYm94W2ldW2F0Ml0gPj0gbWF4VmFsKSB7XG4gICAgICAgICAgICBtYXhWYWwgPSBib3hbaV1bYXQxXSArIGJveFtpXVthdDJdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1heFZhbDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG9yZGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gYXR0clxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gb2Jqc1xuICogQHJldHVybnMge0FycmF5LjxPYmplY3Q+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29ydGVkQXJyKG9yZGVyLCBhdHRyLCBvYmpzKSB7XG4gICAgbGV0IGtleTtcbiAgICBsZXQgYXJyID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhvYmpzKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGluc2VydEJ5T3JkZXIob3JkZXIsIGF0dHIsIG9ianNbaV0sIGFycik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXJyO1xufVxuXG4vKipcbiAqIFNvcnQgYXJyYXkgd2l0aCBuZXdseSBpbnNlcnRlZCBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gYm94XG4gKiBAcGFyYW0ge3N0cmluZ30gYXQxXG4gKiBAcGFyYW0ge09iamVjdH0gYXQyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRCeU9yZGVyKG9yZGVyLCBhdHRyLCBvLCBhcnIpIHtcbiAgICBsZXQgbGVuID0gYXJyLmxlbmd0aDtcblxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgYXJyLnB1c2gobyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW5zZXJ0IGJ5IG9yZGVyLCBzdGFydCBmdXJ0aGVzdCBkb3duLlxuICAgICAgICAvLyBJbnNlcnQgYmV0d2VlbiAwIGFuZCBuIC0xLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAob3JkZXIgPT09ICdkZXNjJykge1xuICAgICAgICAgICAgICAgIGlmIChvLnJvdyA+IGFycltpXS5yb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLCAwLCBvKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoby5yb3cgPCBhcnJbaV0ucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgbyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vdCBpbmJldHdlZW4gMCBhbmQgbiAtIDEsIGluc2VydCBsYXN0LlxuICAgICAgICBpZiAobGVuID09PSBhcnIubGVuZ3RoKSB7YXJyLnB1c2gobyk7fVxuICAgIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gYVxuICogQHBhcmFtIHtzdHJpbmd9IGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydGlvblNvcnQoYSwgYXR0cikge1xuICAgIGlmIChhLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpID0gYS5sZW5ndGg7XG4gICAgdmFyIHRlbXA7XG4gICAgdmFyIGo7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBqID0gaTtcbiAgICAgICAgd2hpbGUgKGogPiAwICYmIGFbaiAtIDFdW2F0dHJdIDwgYVtqXVthdHRyXSkge1xuICAgICAgICAgICAgdGVtcCA9IGFbal07XG4gICAgICAgICAgICBhW2pdID0gYVtqIC0gMV07XG4gICAgICAgICAgICBhW2ogLSAxXSA9IHRlbXA7XG4gICAgICAgICAgICBqIC09IDE7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBwcm9wZXJ0aWVzIGluIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIE9iamVjdExlbmd0aChvYmopIHtcbiAgICBsZXQgbGVuZ3RoID0gMCxcbiAgICAgICAga2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGxlbmd0aCArPSAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG59XG5cbi8qKlxuICogQWRkIGV2ZW50LCBhbmQgbm90IG92ZXJ3cml0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXZlbnRIYW5kbGVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudChlbGVtZW50LCB0eXBlLCBldmVudEhhbmRsZSkge1xuICAgIGlmIChlbGVtZW50ID09PSBudWxsIHx8IHR5cGVvZihlbGVtZW50KSA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcbiAgICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgZXZlbnRIYW5kbGUsIGZhbHNlICk7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoICdvbicgKyB0eXBlLCBldmVudEhhbmRsZSApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnRbJ29uJyArIHR5cGVdID0gZXZlbnRIYW5kbGU7XG4gICAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBub2RlcyBmcm9tIGVsZW1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTm9kZXMoZWxlbWVudCkge1xuICAgIHdoaWxlIChlbGVtZW50LmZpcnN0Q2hpbGQpIHtlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuZmlyc3RDaGlsZCk7fVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICogQHJldHVybnMge09iamVjdHxCb29sZWFufSBET00gZWxlbWVudCBvYmplY3Qgb3IgZmFsc2UgaWYgbm90IGZvdW5kLiBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgY2xhc3NOYW1lKSB7XG4gICAgd2hpbGUgKG5vZGUubm9kZVR5cGUgPT09IDEgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICBpZiAobm9kZS5jbGFzc05hbWUuc2VhcmNoKGNsYXNzTmFtZSkgPiAtMSkge3JldHVybiBub2RlO31cbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IHt2ZXJ0aWNhbExpbmVFbGVtZW50TW9kZWx9O1xuXG5mdW5jdGlvbiB2ZXJ0aWNhbExpbmVFbGVtZW50TW9kZWwoKSB7XG4gICAgbGV0IHZlcnRpY2FsTGluZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2ZXJ0aWNhbExpbmVFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ncmlkLWxpbmVzOydcblxuICAgIHJldHVybiB2ZXJ0aWNhbExpbmVFbGVtZW50OyBcbn1cbiJdfQ==
