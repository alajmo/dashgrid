(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./boxStateModel.js":2,"./grid.js":5,"./gridElementModel.js":6,"./gridEngine.js":7,"./gridEngineStateModel.js":8,"./gridStateModel.js":9,"./gridViewState.js":10,"./renderStateModel.js":12,"./shims.js":13}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./boxContainerElementModel.js":1,"./centroidElementModel.js":3,"./horizontalLineElementModel.js":11,"./utils.js":14,"./verticalLineElementModel.js":15}],7:[function(require,module,exports){
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

},{"./utils.js":14}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gridViewState = gridViewState;


var gridViewState = {
    gridLinesElement: undefined,
    gridCentroidsElement: undefined
};

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
"use strict";

// shim layer with setTimeout fallback for requiestAnimationFrame
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        cb = cb || function () {};
        window.setTimeout(cb, 1000 / 60);
    };
}();

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYm94Q29udGFpbmVyRWxlbWVudE1vZGVsLmpzIiwic3JjL2JveFN0YXRlTW9kZWwuanMiLCJzcmMvY2VudHJvaWRFbGVtZW50TW9kZWwuanMiLCJzcmMvZGFzaGdyaWQuanMiLCJzcmMvZ3JpZC5qcyIsInNyYy9ncmlkRWxlbWVudE1vZGVsLmpzIiwic3JjL2dyaWRFbmdpbmUuanMiLCJzcmMvZ3JpZEVuZ2luZVN0YXRlTW9kZWwuanMiLCJzcmMvZ3JpZFN0YXRlTW9kZWwuanMiLCJzcmMvZ3JpZFZpZXdTdGF0ZS5qcyIsInNyYy9ob3Jpem9udGFsTGluZUVsZW1lbnRNb2RlbC5qcyIsInNyYy9yZW5kZXJTdGF0ZU1vZGVsLmpzIiwic3JjL3NoaW1zLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlcnRpY2FsTGluZUVsZW1lbnRNb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDQVE7OztBQUVSLFNBQVMsd0JBQVQsR0FBb0M7QUFDaEMsUUFBSSxlQUFlLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFmLENBRDRCO0FBRWhDLGlCQUFhLFNBQWIsR0FBeUIsaUJBQXpCLENBRmdDOztBQUloQyxXQUFPLFlBQVAsQ0FKZ0M7Q0FBcEM7Ozs7Ozs7O1FDRlE7Ozs7Ozs7QUFNUixTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDMUIsUUFBSSxNQUFNO0FBQ04sYUFBSyxNQUFNLEdBQU4sQ0FBVSxHQUFWO0FBQ0wsZ0JBQVEsTUFBTSxHQUFOLENBQVUsTUFBVjtBQUNSLGlCQUFTLE1BQU0sR0FBTixDQUFVLE9BQVYsSUFBcUIsQ0FBckI7QUFDVCxvQkFBWSxNQUFNLEdBQU4sQ0FBVSxVQUFWLElBQXdCLENBQXhCO0FBQ1osbUJBQVcsS0FBQyxDQUFNLEdBQU4sQ0FBVSxTQUFWLEtBQXdCLEtBQXhCLEdBQWlDLEtBQWxDLEdBQTBDLElBQTFDO0FBQ1gs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akQsUUFBSSxZQUFZLElBQVosSUFBb0IsT0FBTyxPQUFQLEtBQW9CLFdBQXBCLEVBQWlDLE9BQXpEO0FBQ0EsUUFBSSxRQUFRLGdCQUFSLEVBQTBCO0FBQzFCLGdCQUFRLGdCQUFSLENBQTBCLElBQTFCLEVBQWdDLFdBQWhDLEVBQTZDLEtBQTdDLEVBRDBCO0tBQTlCLE1BRU8sSUFBSSxRQUFRLFdBQVIsRUFBcUI7QUFDNUIsZ0JBQVEsV0FBUixDQUFxQixPQUFPLElBQVAsRUFBYSxXQUFsQyxFQUQ0QjtLQUF6QixNQUVBO0FBQ0gsZ0JBQVEsT0FBTyxJQUFQLENBQVIsR0FBdUIsV0FBdkIsQ0FERztLQUZBO0NBSko7Ozs7OztBQWVBLFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtBQUNqQyxXQUFPLFFBQVEsVUFBUixFQUFvQjtBQUFDLGdCQUFRLFdBQVIsQ0FBb0IsUUFBUSxVQUFSLENBQXBCLENBQUQ7S0FBM0I7Q0FERzs7Ozs7Ozs7QUFVQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUM7QUFDeEMsV0FBTyxLQUFLLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIsU0FBUyxTQUFTLElBQVQsRUFBZTtBQUNsRCxZQUFJLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsU0FBdEIsSUFBbUMsQ0FBQyxDQUFELEVBQUk7QUFBQyxtQkFBTyxJQUFQLENBQUQ7U0FBM0M7QUFDQSxlQUFPLEtBQUssVUFBTCxDQUYyQztLQUF0RDtBQUlBLFdBQU8sS0FBUCxDQUx3QztDQUFyQzs7Ozs7Ozs7UUM5SUM7OztBQUVSLFNBQVMsd0JBQVQsR0FBb0M7QUFDaEMsUUFBSSxzQkFBc0IsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQXRCLENBRDRCO0FBRWhDLHdCQUFvQixTQUFwQixHQUFnQyxzQkFBaEMsQ0FGZ0M7O0FBSWhDLFdBQU8sbUJBQVAsQ0FKZ0M7Q0FBcEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IHtib3hDb250YWluZXJFbGVtZW50TW9kZWx9O1xuXG5mdW5jdGlvbiBib3hDb250YWluZXJFbGVtZW50TW9kZWwoKSB7XG4gICAgbGV0IGJveGVzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJveGVzRWxlbWVudC5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94ZXM7J1xuXG4gICAgcmV0dXJuIGJveGVzRWxlbWVudDtcbn1cbiIsImV4cG9ydCB7Ym94U3RhdGVNb2RlbH07XG5cbi8qKlxuICogVGVtcGxhdGUgZnVuY3Rpb24gZm9yIGJveCBvYmplY3RzLlxuICogIEByZXR1cm5zIHtPYmplY3R9IEJveCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJveFN0YXRlTW9kZWwoc3RhdGUpIHtcbiAgICBsZXQgYm94ID0ge1xuICAgICAgICByb3c6IHN0YXRlLmJveC5yb3csXG4gICAgICAgIGNvbHVtbjogc3RhdGUuYm94LmNvbHVtbixcbiAgICAgICAgcm93c3Bhbjogc3RhdGUuYm94LnJvd3NwYW4gfHwgMSxcbiAgICAgICAgY29sdW1uc3Bhbjogc3RhdGUuYm94LmNvbHVtbnNwYW4gfHwgMSxcbiAgICAgICAgZHJhZ2dhYmxlOiAoc3RhdGUuYm94LmRyYWdnYWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IChzdGF0ZS5ib3gucmVzaXphYmxlID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIHB1c2hhYmxlOiAoc3RhdGUuYm94LnB1c2hhYmxlID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIGZsb2F0aW5nOiAoc3RhdGUuYm94LmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChzdGF0ZS5ib3guc3RhY2tpbmcgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBzd2FwcGluZzogKHN0YXRlLmJveC5zd2FwcGluZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIGluaGVyaXQ6IChzdGF0ZS5ib3guaW5oZXJpdCA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgfTtcblxuICAgIHJldHVybiBib3g7XG59XG4iLCJleHBvcnQge2NlbnRyb2lkRWxlbWVudE1vZGVsfTtcblxuZnVuY3Rpb24gY2VudHJvaWRFbGVtZW50TW9kZWwoKSB7XG4gICAgbGV0IGNlbnRyb2lkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNlbnRyb2lkRWxlbWVudC5jbGFzc05hbWUgPSAnZGFzaGdyaWQtY2VudHJvaWRzJztcblxuICAgIHJldHVybiBjZW50cm9pZEVsZW1lbnQ7XG59XG4iLCJpbXBvcnQgJy4vc2hpbXMuanMnO1xuXG4vLyBGdW5jdGlvbnMuXG5pbXBvcnQge2dyaWR9IGZyb20gJy4vZ3JpZC5qcyc7XG5pbXBvcnQge2dyaWRFbmdpbmV9IGZyb20gJy4vZ3JpZEVuZ2luZS5qcyc7XG5pbXBvcnQge2dyaWRWaWV3U3RhdGV9IGZyb20gJy4vZ3JpZFZpZXdTdGF0ZS5qcyc7XG5cbi8vIEVsZW1lbnQgTW9kZWxzLlxuaW1wb3J0IHtncmlkRWxlbWVudE1vZGVsfSBmcm9tICcuL2dyaWRFbGVtZW50TW9kZWwuanMnO1xuXG4vLyBTdGF0ZSBNb2RlbHMuXG5pbXBvcnQge2dyaWRTdGF0ZU1vZGVsfSBmcm9tICcuL2dyaWRTdGF0ZU1vZGVsLmpzJztcbmltcG9ydCB7Ym94U3RhdGVNb2RlbH0gZnJvbSAnLi9ib3hTdGF0ZU1vZGVsLmpzJztcbmltcG9ydCB7cmVuZGVyU3RhdGVNb2RlbH0gZnJvbSAnLi9yZW5kZXJTdGF0ZU1vZGVsLmpzJztcbmltcG9ydCB7Z3JpZEVuZ2luZVN0YXRlTW9kZWx9IGZyb20gJy4vZ3JpZEVuZ2luZVN0YXRlTW9kZWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBkYXNoZ3JpZDtcblxuLy8gRXhwb3J0aW5nIFN0YXRlcy5cbmV4cG9ydCB7Z3JpZEVsZW1lbnQsIHJlbmRlclN0YXRlLCBncmlkU3RhdGUsIGJveFN0YXRlfTtcblxuLy8gRWxlbWVudHMuXG5sZXQgZ3JpZEVsZW1lbnQ7XG5cbi8vIFN0YXRlcy5cbmxldCByZW5kZXJTdGF0ZTtcbmxldCBncmlkU3RhdGU7XG5sZXQgYm94U3RhdGU7XG5cbmZ1bmN0aW9uIGRhc2hncmlkKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBncmlkU3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBncmlkU3RhdGVNb2RlbChvcHRpb25zKSk7XG4gICAgZ3JpZEVsZW1lbnQgPSBncmlkRWxlbWVudE1vZGVsKGVsZW1lbnQsIGdyaWRTdGF0ZSk7XG5cbiAgICAvLyBVc2VyIGV2ZW50IGFmdGVyIGdyaWQgaXMgZG9uZSBsb2FkaW5nLlxuICAgIGlmIChkYXNoZ3JpZC5vbkdyaWRSZWFkeSkge2Rhc2hncmlkLm9uR3JpZFJlYWR5KCk7fSAvLyB1c2VyIGV2ZW50LlxuXG4gICAgcmV0dXJuO1xuXG4gICAgLy8gQVBJLlxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgdXBkYXRlQm94OiBnLnVwZGF0ZUJveCxcbiAgICAgICAgaW5zZXJ0Qm94OiBnLmluc2VydEJveCxcbiAgICAgICAgcmVtb3ZlQm94OiBnLnJlbW92ZUJveCxcbiAgICAgICAgZ2V0Qm94ZXM6IGcuZ2V0Qm94ZXMsXG4gICAgICAgIHJlZnJlc2hHcmlkOiBnLnJlZnJlc2hHcmlkLFxuICAgICAgICBkYXNoZ3JpZDogZ3JpZFN0YXRlXG4gICAgfSk7XG59O1xuIiwiLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRhc2hncmlkXG4gKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3hIYW5kbGVyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGluaXQgSW5pdGlhbGl6ZSBHcmlkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGVCb3ggQVBJIGZvciB1cGRhdGluZyBib3gsIG1vdmluZyAvIHJlc2l6aW5nLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBpbnNlcnRCb3ggSW5zZXJ0IGEgbmV3IGJveC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gcmVtb3ZlQm94IFJlbW92ZSBhIGJveC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gZ2V0Qm94IFJldHVybiBib3ggb2JqZWN0IGdpdmVuIERPTSBlbGVtZW50LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGVTdGFydCBXaGVuIGRyYWcgLyByZXNpemUgc3RhcnRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGUgRHVyaW5nIGRyYWdnaW5nIC8gcmVzaXppbmcuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZUVuZCBBZnRlciBkcmFnIC8gcmVzaXplIGVuZHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHJlbmRlckdyaWQgVXBkYXRlIGdyaWQgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gZ3JpZCgpIHtcbiAgICAvKipcbiAgICAgKiBjcmVhdGVzIHRoZSBuZWNlc3NhcnkgYm94IGVsZW1lbnRzIGFuZCBjaGVja3MgdGhhdCB0aGUgYm94ZXMgaW5wdXQgaXNcbiAgICAgKiBjb3JyZWN0LlxuICAgICAqIDEuIENyZWF0ZSBib3ggZWxlbWVudHMuXG4gICAgICogMi4gVXBkYXRlIHRoZSBkYXNoZ3JpZCBzaW5jZSBuZXdseSBjcmVhdGVkIGJveGVzIG1heSBsaWUgb3V0c2lkZSB0aGVcbiAgICAgKiAgICBpbml0aWFsIGRhc2hncmlkIHN0YXRlLlxuICAgICAqIDMuIFJlbmRlciB0aGUgZGFzaGdyaWQuXG4gICAgICovXG4gICAgbGV0IGluaXQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgZ3JpZEVuZ2luZSgpLmluaXQoe1xuICAgICAgICAgICAgZ3JpZFN0YXRlOiBzdGF0ZS5ncmlkU3RhdGUsXG4gICAgICAgICAgICBncmlkRW5naW5lU3RhdGU6IHN0YXRlLmdyaWRFbmdpbmVTdGF0ZVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gZ3JpZFZpZXcoc3RhdGUuZ3JpZFZpZXdTdGF0ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBhZGRCb3hlcyA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvLyBsZXQgYm94ZXMgPSBbXTtcblxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMCwgbGVuID0gc3RhdGUuYm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGJveGVzLnB1c2goYm94KHtib3g6IHN0YXRlLmJveGVzW2ldLCBncmlkU3RhdGU6IGdyaWRTdGF0ZX0pKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGdyaWRTdGF0ZS5ib3hlcyA9IGJveGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXBkYXRlVG9cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveCBPcHRpb25hbCBwYXJhbWV0ZXIsIGlmIHVwZGF0ZUJveCBpcyB0cmlnZ2VyZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBkcmFnIC8gcmVzaXplIGV2ZW50LCB0aGVuIGRvbid0IHVwZGF0ZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJZiB1cGRhdGUgc3VjY2VlZGVkLlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVCb3ggPSBmdW5jdGlvbiAoYm94LCB1cGRhdGVUbywgZXhjbHVkZUJveCkge1xuICAgICAgICBsZXQgbW92ZWRCb3hlcyA9IGdyaWRFbmdpbmUudXBkYXRlQm94KGJveCwgdXBkYXRlVG8pO1xuXG4gICAgICAgIGlmIChtb3ZlZEJveGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGdyaWRWaWV3LnJlbmRlckJveChtb3ZlZEJveGVzLCBleGNsdWRlQm94KTtcbiAgICAgICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBib3guXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCByZW1vdmVCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGdyaWRFbmdpbmUucmVtb3ZlQm94KGJveCk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyBhIGJveC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHJlc2l6ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgLy8gSW4gY2FzZSBib3ggaXMgbm90IHVwZGF0ZWQgYnkgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyQm94KG1vdmVkQm94ZXMpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGVpdGhlciByZXNpemUgb3IgZHJhZyBzdGFydHMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCB1cGRhdGVTdGFydCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgZ3JpZEVuZ2luZS5pbmNyZWFzZU51bVJvd3MoYm94LCAxKTtcbiAgICAgICAgZ3JpZEVuZ2luZS5pbmNyZWFzZU51bUNvbHVtbnMoYm94LCAxKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGRyYWdnaW5nIC8gcmVzaXppbmcgaXMgZHJvcHBlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHVwZGF0ZSA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBkcmFnZ2luZyAvIHJlc2l6aW5nIGlzIGRyb3BwZWQuXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZUVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ3JpZEVuZ2luZS5kZWNyZWFzZU51bVJvd3MoKTtcbiAgICAgICAgZ3JpZEVuZ2luZS5kZWNyZWFzZU51bUNvbHVtbnMoKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICBsZXQgcmVmcmVzaEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckJveChkYXNoZ3JpZC5ib3hlcyk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0OiBpbml0LFxuICAgICAgICB1cGRhdGVCb3g6IHVwZGF0ZUJveCxcbiAgICAgICAgdXBkYXRlU3RhcnQ6IHVwZGF0ZVN0YXJ0LFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgdXBkYXRlRW5kOiB1cGRhdGVFbmQsXG4gICAgICAgIHJlZnJlc2hHcmlkOiByZWZyZXNoR3JpZFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtyZW1vdmVOb2RlcywgYWRkRXZlbnR9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQge2JveENvbnRhaW5lckVsZW1lbnRNb2RlbH0gZnJvbSAnLi9ib3hDb250YWluZXJFbGVtZW50TW9kZWwuanMnO1xuaW1wb3J0IHtob3Jpem9udGFsTGluZUVsZW1lbnRNb2RlbH0gZnJvbSAnLi9ob3Jpem9udGFsTGluZUVsZW1lbnRNb2RlbC5qcyc7XG5pbXBvcnQge3ZlcnRpY2FsTGluZUVsZW1lbnRNb2RlbH0gZnJvbSAnLi92ZXJ0aWNhbExpbmVFbGVtZW50TW9kZWwuanMnO1xuaW1wb3J0IHtjZW50cm9pZEVsZW1lbnRNb2RlbH0gZnJvbSAnLi9jZW50cm9pZEVsZW1lbnRNb2RlbC5qcyc7XG5cbmV4cG9ydCB7Z3JpZEVsZW1lbnRNb2RlbH07XG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBUaGUgRE9NIGVsZW1lbnQgdG8gd2hpY2ggdG8gYXR0YWNoIHRoZSBncmlkIGVsZW1lbnQgY29udGVudC4gIFxuICogQHBhcmFtIHtPYmplY3R9IGdyaWRTdGF0ZSBUaGUgZ3JpZCBzdGF0ZS4gXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZG9tIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGdyaWRFbGVtZW50TW9kZWwoZWxlbWVudCwgZ3JpZFN0YXRlKSB7XG4gICAgbGV0IGdyaWRFbGVtZW50ID0ge307XG5cbiAgICBncmlkRWxlbWVudC5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIC8vIFByb3BlcnRpZXMuXG4gICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgZWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzEwMDAnOyAgXG5cbiAgICAvLyBDaGlsZHJlbi5cbiAgICBsZXQgYm94ZXMgPSB7ZWxlbWVudDogYm94Q29udGFpbmVyRWxlbWVudE1vZGVsKCl9O1xuICAgIGdyaWRFbGVtZW50LmJveGVzID0gYm94ZXMuZWxlbWVudDtcbiAgICBncmlkRWxlbWVudC5lbGVtZW50LmFwcGVuZENoaWxkKGJveGVzLmVsZW1lbnQpO1xuXG4gICAgaWYgKGdyaWRTdGF0ZS5zaG93SG9yaXpvbnRhbExpbmUpIHtcbiAgICAgICAgbGV0IGhvcml6b250YWxMaW5lID0ge2VsZW1lbnQ6IGhvcml6b250YWxMaW5lRWxlbWVudE1vZGVsKCl9O1xuICAgICAgICBncmlkRWxlbWVudC5ob3Jpem9udGFsTGluZSA9IGhvcml6b250YWxMaW5lLmVsZW1lbnQ7XG4gICAgICAgIGdyaWRFbGVtZW50LmVsZW1lbnQuYXBwZW5kQ2hpbGQoaG9yaXpvbnRhbExpbmUuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKGdyaWRTdGF0ZS5zaG93VmVydGljYWxMaW5lKSB7XG4gICAgICAgIGxldCB2ZXJ0aWNhbExpbmUgPSB7ZWxlbWVudDogdmVydGljYWxMaW5lRWxlbWVudE1vZGVsKCl9O1xuICAgICAgICBncmlkRWxlbWVudC52ZXJ0aWNhbExpbmUgPSB2ZXJ0aWNhbExpbmUuZWxlbWVudDtcbiAgICAgICAgZ3JpZEVsZW1lbnQuZWxlbWVudC5hcHBlbmRDaGlsZCh2ZXJ0aWNhbExpbmUuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKGdyaWRTdGF0ZS5zaG93Q2VudHJvaWQpIHtcbiAgICAgICAgbGV0IGNlbnRyb2lkID0ge2VsZW1lbnQ6IGNlbnRyb2lkRWxlbWVudE1vZGVsKCl9O1xuICAgICAgICBncmlkRWxlbWVudC5jZW50cm9pZCA9IGNlbnRyb2lkLmVsZW1lbnQ7XG4gICAgICAgIGdyaWRFbGVtZW50LmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2VudHJvaWQuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gRXZlbnQgbGlzdGVuZXJzLlxuICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Um93SGVpZ2h0KCk7XG4gICAgICAgIGdyaWQucmVmcmVzaEdyaWQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBncmlkRWxlbWVudDtcbn07XG4iLCJpbXBvcnQge3JlbW92ZU5vZGVzLCBpbnNlcnRpb25Tb3J0LCBnZXRNYXhOdW19IGZyb20gJy4vdXRpbHMuanMnO1xuLy8gaW1wb3J0IHtib3h9IGZyb20gJy4vYm94LmpzJztcblxuZXhwb3J0IHtncmlkRW5naW5lTW9kZWx9O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gSGFuZGxlcyBjb2xsaXNpb24gbG9naWMgYW5kIGRhc2hncmlkIGRpbWVuc2lvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuZnVuY3Rpb24gZ3JpZEVuZ2luZU1vZGVsKCkge1xuXG4gICAgbGV0IGluaXQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgLy8gdXBkYXRlTnVtUm93cygpO1xuICAgICAgICAvLyB1cGRhdGVOdW1Db2x1bW5zKCk7XG4gICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIERPTSBlbGVtZW50LCByZXRyaWV2ZSBjb3JyZXNwb25kaW5nIGpzIG9iamVjdCBmcm9tIGJveGVzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IERPTSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGJveCBHaXZlbiBhIERPTSBlbGVtZW50LCByZXR1cm4gY29ycmVzcG9uZGluZyBib3ggb2JqZWN0LlxuICAgICAqL1xuICAgIGxldCBnZXRCb3ggPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChib3hlc1tpXS5fZWxlbWVudCA9PT0gZWxlbWVudCkge3JldHVybiBib3hlc1tpXX1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29weSBib3ggcG9zaXRpb25zLlxuICAgICAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn0gUHJldmlvdXMgYm94IHBvc2l0aW9ucy5cbiAgICAgKi9cbiAgICBsZXQgY29weUJveGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgcHJldlBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJveGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwcmV2UG9zaXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIHJvdzogYm94ZXNbaV0ucm93LFxuICAgICAgICAgICAgICAgIGNvbHVtbjogYm94ZXNbaV0uY29sdW1uLFxuICAgICAgICAgICAgICAgIGNvbHVtbnNwYW46IGJveGVzW2ldLmNvbHVtbnNwYW4sXG4gICAgICAgICAgICAgICAgcm93c3BhbjogYm94ZXNbaV0ucm93c3BhblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHByZXZQb3NpdGlvbnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmUgT2xkIHBvc2l0aW9ucy5cbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBQcmV2aW91cyBwb3NpdGlvbnMuXG4gICAgICovXG4gICAgbGV0IHJlc3RvcmVPbGRQb3NpdGlvbnMgPSBmdW5jdGlvbiAocHJldlBvc2l0aW9ucykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJveGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBib3hlc1tpXS5yb3cgPSBwcmV2UG9zaXRpb25zW2ldLnJvdyxcbiAgICAgICAgICAgIGJveGVzW2ldLmNvbHVtbiA9IHByZXZQb3NpdGlvbnNbaV0uY29sdW1uLFxuICAgICAgICAgICAgYm94ZXNbaV0uY29sdW1uc3BhbiA9IHByZXZQb3NpdGlvbnNbaV0uY29sdW1uc3BhbixcbiAgICAgICAgICAgIGJveGVzW2ldLnJvd3NwYW4gPSBwcmV2UG9zaXRpb25zW2ldLnJvd3NwYW5cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgYm94IGdpdmVuIGl0cyBpbmRleCBpbiB0aGUgYm94ZXMgYXJyYXkuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJveEluZGV4LlxuICAgICAqL1xuICAgIGxldCByZW1vdmVCb3ggPSBmdW5jdGlvbiAoYm94SW5kZXgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSBib3hlc1tib3hJbmRleF0uX2VsZW1lbnQ7XG4gICAgICAgIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcbiAgICAgICAgYm94ZXMuc3BsaWNlKGJveEluZGV4LCAxKTtcblxuICAgICAgICAvLyBJbiBjYXNlIGZsb2F0aW5nIGlzIG9uLlxuICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgYm94LiBCb3ggbXVzdCBjb250YWluIGF0IGxlYXN0IHRoZSBzaXplIGFuZCBwb3NpdGlvbiBvZiB0aGUgYm94LFxuICAgICAqIGNvbnRlbnQgZWxlbWVudCBpcyBvcHRpb25hbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IEJveCBkaW1lbnNpb25zLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJZiBpbnNlcnQgd2FzIHBvc3NpYmxlLlxuICAgICAqL1xuICAgIGxldCBpbnNlcnRCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIG1vdmluZ0JveCA9IGJveDtcblxuICAgICAgICBpZiAoYm94LnJvd3MgPT09IHVuZGVmaW5lZCAmJiBib3guY29sdW1uID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIGJveC5yb3dzcGFuID09PSB1bmRlZmluZWQgJiYgYm94LmNvbHVtbnNwYW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1VwZGF0ZVZhbGlkKGJveCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcmV2UG9zaXRpb25zID0gY29weUJveGVzKCk7XG5cbiAgICAgICAgbGV0IG1vdmVkQm94ZXMgPSBbYm94XTtcbiAgICAgICAgbGV0IHZhbGlkTW92ZSA9IG1vdmVCb3goYm94LCBib3gsIG1vdmVkQm94ZXMpO1xuICAgICAgICBtb3ZpbmdCb3ggPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKHZhbGlkTW92ZSkge1xuICAgICAgICAgICAgYm94SGFuZGxlci5jcmVhdGVCb3goYm94KTtcbiAgICAgICAgICAgIGJveGVzLnB1c2goYm94KTtcblxuICAgICAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuICAgICAgICAgICAgcmV0dXJuIGJveDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3RvcmVPbGRQb3NpdGlvbnMocHJldlBvc2l0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGEgcG9zaXRpb24gb3Igc2l6ZSBvZiBib3guXG4gICAgICpcbiAgICAgKiBXb3JrcyBpbiBwb3N0ZXJpb3IgZmFzaGlvbiwgYWtpbiB0byBhc2sgZm9yIGZvcmdpdmVuZXNzIHJhdGhlciB0aGFuIGZvclxuICAgICAqIHBlcm1pc3Npb24uXG4gICAgICogTG9naWM6XG4gICAgICpcbiAgICAgKiAxLiBJcyB1cGRhdGVUbyBhIHZhbGlkIHN0YXRlP1xuICAgICAqICAgIDEuMSBObzogUmV0dXJuIGZhbHNlLlxuICAgICAqIDIuIFNhdmUgcG9zaXRpb25zLlxuICAgICAqIDMuIE1vdmUgYm94LlxuICAgICAqICAgICAgMy4xLiBJcyBib3ggb3V0c2lkZSBib3JkZXI/XG4gICAgICogICAgICAgICAgMy4xLjEuIFllczogQ2FuIGJvcmRlciBiZSBwdXNoZWQ/XG4gICAgICogICAgICAgICAgICAgIDMuMS4xLjEuIFllczogRXhwYW5kIGJvcmRlci5cbiAgICAgKiAgICAgICAgICAgICAgMy4xLjEuMi4gTm86IFJldHVybiBmYWxzZS5cbiAgICAgKiAgICAgIDMuMi4gRG9lcyBib3ggY29sbGlkZT9cbiAgICAgKiAgICAgICAgICAzLjIuMS4gWWVzOiBDYWxjdWxhdGUgbmV3IGJveCBwb3NpdGlvbiBhbmRcbiAgICAgKiAgICAgICAgICAgICAgICAgZ28gYmFjayB0byBzdGVwIDEgd2l0aCB0aGUgbmV3IGNvbGxpZGVkIGJveC5cbiAgICAgKiAgICAgICAgICAzLjIuMi4gTm86IFJldHVybiB0cnVlLlxuICAgICAqIDQuIElzIG1vdmUgdmFsaWQ/XG4gICAgICogICAgNC4xLiBZZXM6IFVwZGF0ZSBudW1iZXIgcm93cyAvIGNvbHVtbnMuXG4gICAgICogICAgNC4yLiBObzogUmV2ZXJ0IHRvIG9sZCBwb3NpdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IFRoZSBib3ggYmVpbmcgdXBkYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXBkYXRlVG8gVGhlIG5ldyBzdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXkuPE9iamVjdD59IG1vdmVkQm94ZXNcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlQm94ID0gZnVuY3Rpb24gKGJveCwgdXBkYXRlVG8pIHtcbiAgICAgICAgbW92aW5nQm94ID0gYm94O1xuXG4gICAgICAgIGxldCBwcmV2UG9zaXRpb25zID0gY29weUJveGVzKClcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJveCwgdXBkYXRlVG8pO1xuICAgICAgICBpZiAoIWlzVXBkYXRlVmFsaWQoYm94KSkge1xuICAgICAgICAgICAgcmVzdG9yZU9sZFBvc2l0aW9ucyhwcmV2UG9zaXRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtb3ZlZEJveGVzID0gW2JveF07XG4gICAgICAgIGxldCB2YWxpZE1vdmUgPSBtb3ZlQm94KGJveCwgYm94LCBtb3ZlZEJveGVzKTtcblxuICAgICAgICBpZiAodmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBtb3ZlZEJveGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdG9yZU9sZFBvc2l0aW9ucyhwcmV2UG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gW107XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBhbmQgaGFuZGxlcyBjb2xsaXNpb25zIHdpdGggd2FsbCBhbmQgYm94ZXMuXG4gICAgICogV29ya3MgYXMgYSB0cmVlLCBwcm9wYWdhdGluZyBtb3ZlcyBkb3duIHRoZSBjb2xsaXNpb24gdHJlZSBhbmQgcmV0dXJuc1xuICAgICAqICAgICB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBpZiB0aGUgYm94IGluZnJvbnQgaXMgYWJsZSB0byBtb3ZlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBleGNsdWRlQm94XG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gbW92ZWRCb3hlc1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgbW92ZSBpcyBwb3NzaWJsZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGxldCBtb3ZlQm94ID0gZnVuY3Rpb24gKGJveCwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykge1xuICAgICAgICBpZiAoaXNCb3hPdXRzaWRlQm91bmRhcnkoYm94KSkge3JldHVybiBmYWxzZTt9XG5cbiAgICAgICAgbGV0IGludGVyc2VjdGVkQm94ZXMgPSBnZXRJbnRlcnNlY3RlZEJveGVzKGJveCwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcyk7XG5cbiAgICAgICAgLy8gSGFuZGxlIGJveCBDb2xsaXNpb24sIHJlY3Vyc2l2ZSBtb2RlbC5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGludGVyc2VjdGVkQm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghY29sbGlzaW9uSGFuZGxlcihib3gsIGludGVyc2VjdGVkQm94ZXNbaV0sIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFByb3BhZ2F0ZXMgYm94IGNvbGxpc2lvbnMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4Y2x1ZGVCb3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSWYgbW92ZSBpcyBhbGxvd2VkXG4gICAgICovXG4gICAgbGV0IGNvbGxpc2lvbkhhbmRsZXIgPSBmdW5jdGlvbiAoYm94LCBib3hCLCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIHNldEJveFBvc2l0aW9uKGJveCwgYm94QilcbiAgICAgICAgcmV0dXJuIG1vdmVCb3goYm94QiwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgbmV3IGJveCBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgYm94IHRoYXQgcHVzaGVkIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3ggQm94IHdoaWNoIGhhcyBtb3ZlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94QiBCb3ggd2hpY2ggaXMgdG8gYmUgbW92ZWQuXG4gICAgICovXG4gICAgbGV0IHNldEJveFBvc2l0aW9uID0gZnVuY3Rpb24gKGJveCwgYm94Qikge1xuICAgICAgICBib3hCLnJvdyArPSBib3gucm93ICsgYm94LnJvd3NwYW4gLSBib3hCLnJvdztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBib3gsIGZpbmRzIG90aGVyIGJveGVzIHdoaWNoIGludGVyc2VjdCB3aXRoIGl0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBleGNsdWRlQm94IEFycmF5IG9mIGJveGVzLlxuICAgICAqL1xuICAgIGxldCBnZXRJbnRlcnNlY3RlZEJveGVzID0gZnVuY3Rpb24gKGJveCwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykge1xuICAgICAgICBsZXQgaW50ZXJzZWN0ZWRCb3hlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYm94ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIC8vIERvbid0IGNoZWNrIG1vdmluZyBib3ggYW5kIHRoZSBib3ggaXRzZWxmLlxuICAgICAgICAgICAgaWYgKGJveCAhPT0gYm94ZXNbaV0gJiYgYm94ZXNbaV0gIT09IGV4Y2x1ZGVCb3gpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9Cb3hlc0ludGVyc2VjdChib3gsIGJveGVzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlZEJveGVzLnB1c2goYm94ZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RlZEJveGVzLnB1c2goYm94ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpbnNlcnRpb25Tb3J0KGludGVyc2VjdGVkQm94ZXMsICdyb3cnKTtcblxuICAgICAgICByZXR1cm4gaW50ZXJzZWN0ZWRCb3hlcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgMiBib3hlcyBpbnRlcnNlY3QgdXNpbmcgYm91bmRpbmcgYm94IG1ldGhvZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94QVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCXG4gICAgICogQHJldHVybnMgYm9vbGVhbiBUcnVlIGlmIGludGVyc2VjdCBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkb0JveGVzSW50ZXJzZWN0ID0gZnVuY3Rpb24gKGJveCwgYm94Qikge1xuICAgICAgICByZXR1cm4gKGJveC5jb2x1bW4gPCBib3hCLmNvbHVtbiArIGJveEIuY29sdW1uc3BhbiAmJlxuICAgICAgICAgICAgICAgIGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbiA+IGJveEIuY29sdW1uICYmXG4gICAgICAgICAgICAgICAgYm94LnJvdyA8IGJveEIucm93ICsgYm94Qi5yb3dzcGFuICYmXG4gICAgICAgICAgICAgICAgYm94LnJvd3NwYW4gKyBib3gucm93ID4gYm94Qi5yb3cpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBudW1iZXIgb2YgY29sdW1ucy5cbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlTnVtQ29sdW1ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1heENvbHVtbiA9IGdldE1heE51bShib3hlcywgJ2NvbHVtbicsICdjb2x1bW5zcGFuJyk7XG5cbiAgICAgICAgaWYgKG1heENvbHVtbiA+PSBkYXNoZ3JpZC5taW5Db2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zID0gbWF4Q29sdW1uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtb3ZpbmdCb3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5udW1Db2x1bW5zIC0gbW92aW5nQm94LmNvbHVtbiAtIG1vdmluZ0JveC5jb2x1bW5zcGFuID09PSAwICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zIDwgZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGRhc2hncmlkLm51bUNvbHVtbnMgLSBtb3ZpbmdCb3guY29sdW1uLSBtb3ZpbmdCb3guY29sdW1uc3BhbiA+IDEgJiZcbiAgICAgICAgICAgIG1vdmluZ0JveC5jb2x1bW4gKyBtb3ZpbmdCb3guY29sdW1uc3BhbiA9PT0gbWF4Q29sdW1uICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zID4gZGFzaGdyaWQubWluQ29sdW1ucyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA8IGRhc2hncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPSBtYXhDb2x1bW4gKyAxO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyBpZiBib3ggdG91Y2hlcyBib3R0b20gb2Ygd2FsbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bUNvbHVtbnNcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBpbmNyZWFzZU51bUNvbHVtbnMgPSBmdW5jdGlvbiAoYm94LCBudW1Db2x1bW5zKSB7XG4gICAgICAgIC8vIERldGVybWluZSB3aGVuIHRvIGFkZCBleHRyYSByb3cgdG8gYmUgYWJsZSB0byBtb3ZlIGRvd246XG4gICAgICAgIC8vIDEuIEFueXRpbWUgZHJhZ2dpbmcgc3RhcnRzLlxuICAgICAgICAvLyAyLiBXaGVuIGRyYWdnaW5nIHN0YXJ0cyBhbmQgbW92aW5nIGJveCBpcyBjbG9zZSB0byBib3R0b20gYm9yZGVyLlxuICAgICAgICBpZiAoKGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbikgPT09IGRhc2hncmlkLm51bUNvbHVtbnMgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPCBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIHRvIGZ1cnRoZXN0IGxlZnR3YXJkIGJveC5cbiAgICAgKiBAcmV0dXJucyBib29sZWFuIHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgZGVjcmVhc2VOdW1Db2x1bW5zID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgbGV0IG1heENvbHVtbk51bSA9IDA7XG5cbiAgICAgICAgYm94ZXMuZm9yRWFjaChmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgICAgICBpZiAobWF4Q29sdW1uTnVtIDwgKGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbikpIHtcbiAgICAgICAgICAgICAgICBtYXhDb2x1bW5OdW0gPSBib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCBkYXNoZ3JpZC5udW1Db2x1bW5zKSB7ZGFzaGdyaWQubnVtQ29sdW1ucyA9IG1heENvbHVtbk51bTt9XG4gICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCBkYXNoZ3JpZC5taW5Db2x1bW5zKSB7ZGFzaGdyaWQubnVtQ29sdW1ucyA9IGRhc2hncmlkLm1pbkNvbHVtbnM7fVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgcm93cyBkZXBlbmRzIG9uIHRocmVlIHRoaW5ncy5cbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT5NaW4gLyBNYXggUm93cy48L2xpPlxuICAgICAqICAgICA8bGk+TWF4IEJveC48L2xpPlxuICAgICAqICAgICA8bGk+RHJhZ2dpbmcgYm94IG5lYXIgYm90dG9tIGJvcmRlci48L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICpcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlTnVtUm93cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1heFJvdyA9IGdldE1heE51bShib3hlcywgJ3JvdycsICdyb3dzcGFuJyk7XG5cbiAgICAgICAgaWYgKG1heFJvdyA+PSBkYXNoZ3JpZC5taW5Sb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzID0gbWF4Um93O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtb3ZpbmdCb3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vdmluZyBib3ggd2hlbiBjbG9zZSB0byBib3JkZXIuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5udW1Sb3dzIC0gbW92aW5nQm94LnJvdyAtIG1vdmluZ0JveC5yb3dzcGFuID09PSAwICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzIDwgZGFzaGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGRhc2hncmlkLm51bVJvd3MgLSBtb3ZpbmdCb3gucm93IC0gbW92aW5nQm94LnJvd3NwYW4gPiAxICYmXG4gICAgICAgICAgICBtb3ZpbmdCb3gucm93ICsgbW92aW5nQm94LnJvd3NwYW4gPT09IG1heFJvdyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA+IGRhc2hncmlkLm1pblJvd3MgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPCBkYXNoZ3JpZC5tYXhSb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzID0gbWF4Um93ICsgMTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyBpZiBib3ggdG91Y2hlcyBib3R0b20gb2Ygd2FsbC5cbiAgICAgKiBAcGFyYW0gYm94IHtPYmplY3R9XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaW5jcmVhc2VOdW1Sb3dzID0gZnVuY3Rpb24gKGJveCwgbnVtUm93cykge1xuICAgICAgICAvLyBEZXRlcm1pbmUgd2hlbiB0byBhZGQgZXh0cmEgcm93IHRvIGJlIGFibGUgdG8gbW92ZSBkb3duOlxuICAgICAgICAvLyAxLiBBbnl0aW1lIGRyYWdnaW5nIHN0YXJ0cy5cbiAgICAgICAgLy8gMi4gV2hlbiBkcmFnZ2luZyBzdGFydHMgQU5EIG1vdmluZyBib3ggaXMgY2xvc2UgdG8gYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKChib3gucm93ICsgYm94LnJvd3NwYW4pID09PSBkYXNoZ3JpZC5udW1Sb3dzICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzIDwgZGFzaGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyB0byBmdXJ0aGVzdCBkb3dud2FyZCBib3guXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgZGVjcmVhc2VOdW1Sb3dzID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgbGV0IG1heFJvd051bSA9IDA7XG5cbiAgICAgICAgYm94ZXMuZm9yRWFjaChmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgICAgICBpZiAobWF4Um93TnVtIDwgKGJveC5yb3cgKyBib3gucm93c3BhbikpIHtcbiAgICAgICAgICAgICAgICBtYXhSb3dOdW0gPSBib3gucm93ICsgYm94LnJvd3NwYW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXhSb3dOdW0gPCBkYXNoZ3JpZC5udW1Sb3dzKSB7ZGFzaGdyaWQubnVtUm93cyA9IG1heFJvd051bTt9XG4gICAgICAgIGlmIChtYXhSb3dOdW0gPCBkYXNoZ3JpZC5taW5Sb3dzKSB7ZGFzaGdyaWQubnVtUm93cyA9IGRhc2hncmlkLm1pblJvd3M7fVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgbWluLCBtYXggYm94LXNpemUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGxldCBpc1VwZGF0ZVZhbGlkID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBpZiAoYm94LnJvd3NwYW4gPCBkYXNoZ3JpZC5taW5Sb3dzcGFuIHx8XG4gICAgICAgICAgICBib3gucm93c3BhbiA+IGRhc2hncmlkLm1heFJvd3NwYW4gfHxcbiAgICAgICAgICAgIGJveC5jb2x1bW5zcGFuIDwgZGFzaGdyaWQubWluQ29sdW1uc3BhbiB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbnNwYW4gPiBkYXNoZ3JpZC5tYXhDb2x1bW5zcGFuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBib3JkZXIgY29sbGlzaW9ucyBieSByZXZlcnRpbmcgYmFjayB0byBjbG9zZXN0IGVkZ2UgcG9pbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGNvbGxpZGVkIGFuZCBjYW5ub3QgbW92ZSB3YWxsIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGlzQm94T3V0c2lkZUJvdW5kYXJ5ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAvLyBUb3AgYW5kIGxlZnQgYm9yZGVyLlxuICAgICAgICBpZiAoYm94LmNvbHVtbiA8IDAgfHxcbiAgICAgICAgICAgIGJveC5yb3cgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJpZ2h0IGFuZCBib3R0b20gYm9yZGVyLlxuICAgICAgICBpZiAoYm94LnJvdyArIGJveC5yb3dzcGFuID4gZGFzaGdyaWQubWF4Um93cyB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuID4gZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgaW5pdCxcbiAgICAgICAgdXBkYXRlQm94LFxuICAgICAgICB1cGRhdGVOdW1Sb3dzLFxuICAgICAgICBpbmNyZWFzZU51bVJvd3MsXG4gICAgICAgIGRlY3JlYXNlTnVtUm93cyxcbiAgICAgICAgdXBkYXRlTnVtQ29sdW1ucyxcbiAgICAgICAgaW5jcmVhc2VOdW1Db2x1bW5zLFxuICAgICAgICBkZWNyZWFzZU51bUNvbHVtbnMsXG4gICAgICAgIGdldEJveCxcbiAgICAgICAgaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3hcbiAgICB9KTtcbn1cbiIsImV4cG9ydCB7Z3JpZEVuZ2luZVN0YXRlfTtcblxubGV0IGdyaWRFbmdpbmVTdGF0ZSA9IHtcbiAgICBib3hlczogW10sXG4gICAgbW92aW5nQm94OiB1bmRlZmluZWQsXG4gICAgbW92ZWRCb3hlczogW11cbn07XG4iLCJleHBvcnQge2dyaWRTdGF0ZU1vZGVsfTtcblxuZnVuY3Rpb24gZ3JpZFN0YXRlTW9kZWwob3B0aW9ucykge1xuXG4gICAgbGV0IGdyaWRTdGF0ZU1vZGVsID0ge1xuICAgICAgICByb3dIZWlnaHQ6IG9wdGlvbnMucm93SGVpZ2h0LFxuICAgICAgICBudW1Sb3dzOiAob3B0aW9ucy5udW1Sb3dzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5udW1Sb3dzIDogNixcbiAgICAgICAgbWluUm93czogKG9wdGlvbnMubWluUm93cyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubWluUm93cyA6IDYsXG4gICAgICAgIG1heFJvd3M6IChvcHRpb25zLm1heFJvd3MgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm1heFJvd3MgOiAxMCxcblxuICAgICAgICBleHRyYVJvd3M6IDAsXG4gICAgICAgIGV4dHJhQ29sdW1uczogMCxcblxuICAgICAgICBjb2x1bW5XaWR0aDogb3B0aW9ucy5jb2x1bW5XaWR0aCxcbiAgICAgICAgbnVtQ29sdW1uczogKG9wdGlvbnMubnVtQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubnVtQ29sdW1ucyA6IDYsXG4gICAgICAgIG1pbkNvbHVtbnM6IChvcHRpb25zLm1pbkNvbHVtbnMgIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm1pbkNvbHVtbnMgOiA2LFxuICAgICAgICBtYXhDb2x1bW5zOiAob3B0aW9ucy5tYXhDb2x1bW5zICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5tYXhDb2x1bW5zIDogMTAsXG5cbiAgICAgICAgeE1hcmdpbjogKG9wdGlvbnMueE1hcmdpbiAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMueE1hcmdpbiA6IDIwLFxuICAgICAgICB5TWFyZ2luOiAob3B0aW9ucy55TWFyZ2luICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy55TWFyZ2luIDogMjAsXG5cbiAgICAgICAgZGVmYXVsdEJveFJvd3NwYW46IDIsXG4gICAgICAgIGRlZmF1bHRCb3hDb2x1bW5zcGFuOiAxLFxuXG4gICAgICAgIG1pblJvd3NwYW46IChvcHRpb25zLm1pblJvd3NwYW4gIT09IHVuZGVmaW5lZCkgPyBvcHRpb25zLm1pblJvd3NwYW4gOiAxLFxuICAgICAgICBtYXhSb3dzcGFuOiAob3B0aW9ucy5tYXhSb3dzcGFuICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5tYXhSb3dzcGFuIDogOTk5OSxcblxuICAgICAgICBtaW5Db2x1bW5zcGFuOiAob3B0aW9ucy5taW5Db2x1bW5zcGFuICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5taW5Db2x1bW5zcGFuIDogMSxcbiAgICAgICAgbWF4Q29sdW1uc3BhbjogKG9wdGlvbnMubWF4Q29sdW1uc3BhbiAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubWF4Q29sdW1uc3BhbiA6IDk5OTksXG5cbiAgICAgICAgcHVzaGFibGU6IChvcHRpb25zLnB1c2hhYmxlID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIGZsb2F0aW5nOiAob3B0aW9ucy5mbG9hdGluZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIHN0YWNraW5nOiAob3B0aW9ucy5zdGFja2luZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIHN3YXBwaW5nOiAob3B0aW9ucy5zd2FwcGluZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGU6IChvcHRpb25zLmFuaW1hdGUgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuXG4gICAgICAgIGxpdmVDaGFuZ2VzOiAob3B0aW9ucy5saXZlQ2hhbmdlcyA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuXG4gICAgICAgIC8vIERyYWcgaGFuZGxlIGNhbiBiZSBhIGN1c3RvbSBjbGFzc25hbWUgb3IgaWYgbm90IHNldCByZXZlcnMgdG8gdGhlXG4gICAgICAgIC8vIGJveCBjb250YWluZXIgd2l0aCBjbGFzc25hbWUgJ2Rhc2hncmlkLWJveCcuXG4gICAgICAgIGRyYWdnYWJsZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IChvcHRpb25zLmRyYWdnYWJsZSAmJiBvcHRpb25zLmRyYWdnYWJsZS5lbmFibGVkID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgaGFuZGxlOiAob3B0aW9ucy5kcmFnZ2FibGUgJiYgb3B0aW9ucy5kcmFnZ2FibGUuaGFuZGxlKSB8fCAnZGFzaGdyaWQtYm94JyxcblxuICAgICAgICAgICAgICAgIC8vIHVzZXIgY2Incy5cbiAgICAgICAgICAgICAgICBkcmFnU3RhcnQ6IG9wdGlvbnMuZHJhZ2dhYmxlICYmIG9wdGlvbnMuZHJhZ2dhYmxlLmRyYWdTdGFydCxcbiAgICAgICAgICAgICAgICBkcmFnZ2luZzogb3B0aW9ucy5kcmFnZ2FibGUgJiYgb3B0aW9ucy5kcmFnZ2FibGUuZHJhZ2dpbmcsXG4gICAgICAgICAgICAgICAgZHJhZ0VuZDogb3B0aW9ucy5kcmFnZ2FibGUgJiYgb3B0aW9ucy5kcmFnZ2FibGUuZHJhZ0VuZFxuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2l6YWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogKG9wdGlvbnMucmVzaXphYmxlICYmIG9wdGlvbnMucmVzaXphYmxlLmVuYWJsZWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGhhbmRsZTogKG9wdGlvbnMucmVzaXphYmxlICYmIG9wdGlvbnMucmVzaXphYmxlLmhhbmRsZSkgfHwgWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ3N3JywgJ253J10sXG4gICAgICAgICAgICBoYW5kbGVXaWR0aDogKG9wdGlvbnMucmVzaXphYmxlICYmICBvcHRpb25zLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMucmVzaXphYmxlLmhhbmRsZVdpZHRoIDogMTAsXG5cbiAgICAgICAgICAgIC8vIHVzZXIgY2Incy5cbiAgICAgICAgICAgIHJlc2l6ZVN0YXJ0OiBvcHRpb25zLnJlc2l6YWJsZSAmJiBvcHRpb25zLnJlc2l6YWJsZS5yZXNpemVTdGFydCxcbiAgICAgICAgICAgIHJlc2l6aW5nOiBvcHRpb25zLnJlc2l6YWJsZSAmJiBvcHRpb25zLnJlc2l6YWJsZS5yZXNpemluZyxcbiAgICAgICAgICAgIHJlc2l6ZUVuZDogb3B0aW9ucy5yZXNpemFibGUgJiYgb3B0aW9ucy5yZXNpemFibGUucmVzaXplRW5kXG4gICAgICAgIH0sXG5cbiAgICAgICAgb25VcGRhdGU6ICgpID0+IHt9LFxuXG4gICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4zcywgbGVmdCAuM3MsIHRvcCAuM3MsIHdpZHRoIC4zcywgaGVpZ2h0IC4zcycsXG4gICAgICAgIHNjcm9sbFNlbnNpdGl2aXR5OiAyMCxcbiAgICAgICAgc2Nyb2xsU3BlZWQ6IDEwLFxuICAgICAgICBzbmFwQmFja1RpbWU6IChvcHRpb25zLnNuYXBCYWNrVGltZSA9PT0gdW5kZWZpbmVkKSA/IDMwMCA6IG9wdGlvbnMuc25hcEJhY2tUaW1lLFxuXG4gICAgICAgIHNob3dWZXJ0aWNhbExpbmU6IChvcHRpb25zLnNob3dWZXJ0aWNhbExpbmUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgc2hvd0hvcml6b250YWxMaW5lOiAob3B0aW9ucy5zaG93SG9yaXpvbnRhbExpbmUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgc2hvd0NlbnRyb2lkOiAob3B0aW9ucy5zaG93Q2VudHJvaWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH07XG5cbiAgICByZXR1cm4gZ3JpZFN0YXRlTW9kZWw7XG59O1xuIiwiZXhwb3J0IHtncmlkVmlld1N0YXRlfTtcblxubGV0IGdyaWRWaWV3U3RhdGUgPSB7XG4gICAgZ3JpZExpbmVzRWxlbWVudDogdW5kZWZpbmVkLFxuICAgIGdyaWRDZW50cm9pZHNFbGVtZW50OiB1bmRlZmluZWRcbn07XG4iLCJleHBvcnQge2hvcml6b250YWxMaW5lRWxlbWVudE1vZGVsfTtcblxuZnVuY3Rpb24gaG9yaXpvbnRhbExpbmVFbGVtZW50TW9kZWwoKSB7XG4gICAgbGV0IGhvcml6b250YWxMaW5lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhvcml6b250YWxMaW5lRWxlbWVudC5jbGFzc05hbWUgPSAnZGFzaGdyaWQtZ3JpZC1saW5lczsnXG5cbiAgICByZXR1cm4gaG9yaXpvbnRhbExpbmVFbGVtZW50OyBcbn1cbiIsImV4cG9ydCB7cmVuZGVyU3RhdGVNb2RlbH07XG5cbmZ1bmN0aW9uIHJlbmRlclN0YXRlTW9kZWwgKCkge1xuICAgIC8vIFN0YXJ0IHJvdyAvIGNvbHVtbiBkZW5vdGVzIHRoZSBwaXhlbCBhdCB3aGljaCBlYWNoIGNlbGwgc3RhcnRzIGF0LlxuICAgIGxldCByZW5kZXJTdGF0ZU1vZGVsID0ge1xuICAgICAgICBzdGFydENvbHVtbjogW10sXG4gICAgICAgIHN0YXJ0Um93OiBbXSxcbiAgICAgICAgY29sdW1uV2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgcm93SGVpZ2h0OiB1bmRlZmluZWQgIFxuICAgIH07XG5cbiAgICByZXR1cm4gcmVuZGVyU3RhdGVNb2RlbDtcbn1cbiIsIi8vIHNoaW0gbGF5ZXIgd2l0aCBzZXRUaW1lb3V0IGZhbGxiYWNrIGZvciByZXF1aWVzdEFuaW1hdGlvbkZyYW1lXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24gKGNiKXtcbiAgICAgICAgICAgIGNiID0gY2IgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYiwgMTAwMCAvIDYwKTtcbiAgICAgICAgfTtcbn0pKCk7IiwiXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYm94XG4gKiBAcGFyYW0ge3N0cmluZ30gYXQxXG4gKiBAcGFyYW0ge3N0cmluZ30gYXQyXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4TnVtKGJveCwgYXQxLCBhdDIpIHtcbiAgICBsZXQgbWF4VmFsID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYm94Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChib3hbaV1bYXQxXSArIGJveFtpXVthdDJdID49IG1heFZhbCkge1xuICAgICAgICAgICAgbWF4VmFsID0gYm94W2ldW2F0MV0gKyBib3hbaV1bYXQyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXhWYWw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmRlclxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG9ianNcbiAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRlZEFycihvcmRlciwgYXR0ciwgb2Jqcykge1xuICAgIGxldCBrZXk7XG4gICAgbGV0IGFyciA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXMob2JqcykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpbnNlcnRCeU9yZGVyKG9yZGVyLCBhdHRyLCBvYmpzW2ldLCBhcnIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBTb3J0IGFycmF5IHdpdGggbmV3bHkgaW5zZXJ0ZWQgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGJveFxuICogQHBhcmFtIHtzdHJpbmd9IGF0MVxuICogQHBhcmFtIHtPYmplY3R9IGF0MlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QnlPcmRlcihvcmRlciwgYXR0ciwgbywgYXJyKSB7XG4gICAgbGV0IGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluc2VydCBieSBvcmRlciwgc3RhcnQgZnVydGhlc3QgZG93bi5cbiAgICAgICAgLy8gSW5zZXJ0IGJldHdlZW4gMCBhbmQgbiAtMS5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKG9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5yb3cgPiBhcnJbaV0ucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgbyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8ucm93IDwgYXJyW2ldLnJvdykge1xuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIG8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBub3QgaW5iZXR3ZWVuIDAgYW5kIG4gLSAxLCBpbnNlcnQgbGFzdC5cbiAgICAgICAgaWYgKGxlbiA9PT0gYXJyLmxlbmd0aCkge2Fyci5wdXNoKG8pO31cbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRpb25Tb3J0KGEsIGF0dHIpIHtcbiAgICBpZiAoYS5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSA9IGEubGVuZ3RoO1xuICAgIHZhciB0ZW1wO1xuICAgIHZhciBqO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaiA9IGk7XG4gICAgICAgIHdoaWxlIChqID4gMCAmJiBhW2ogLSAxXVthdHRyXSA8IGFbal1bYXR0cl0pIHtcbiAgICAgICAgICAgIHRlbXAgPSBhW2pdO1xuICAgICAgICAgICAgYVtqXSA9IGFbaiAtIDFdO1xuICAgICAgICAgICAgYVtqIC0gMV0gPSB0ZW1wO1xuICAgICAgICAgICAgaiAtPSAxO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2YgcHJvcGVydGllcyBpbiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBPYmplY3RMZW5ndGgob2JqKSB7XG4gICAgbGV0IGxlbmd0aCA9IDAsXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xufVxuXG4vKipcbiAqIEFkZCBldmVudCwgYW5kIG5vdCBvdmVyd3JpdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV2ZW50SGFuZGxlXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQoZWxlbWVudCwgdHlwZSwgZXZlbnRIYW5kbGUpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCB8fCB0eXBlb2YoZWxlbWVudCkgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlLCBmYWxzZSApO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCAnb24nICsgdHlwZSwgZXZlbnRIYW5kbGUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSA9IGV2ZW50SGFuZGxlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgbm9kZXMgZnJvbSBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU5vZGVzKGVsZW1lbnQpIHtcbiAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7ZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO31cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAqIEByZXR1cm5zIHtPYmplY3R8Qm9vbGVhbn0gRE9NIGVsZW1lbnQgb2JqZWN0IG9yIGZhbHNlIGlmIG5vdCBmb3VuZC4gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGNsYXNzTmFtZSkge1xuICAgIHdoaWxlIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lLnNlYXJjaChjbGFzc05hbWUpID4gLTEpIHtyZXR1cm4gbm9kZTt9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbiIsImV4cG9ydCB7dmVydGljYWxMaW5lRWxlbWVudE1vZGVsfTtcblxuZnVuY3Rpb24gdmVydGljYWxMaW5lRWxlbWVudE1vZGVsKCkge1xuICAgIGxldCB2ZXJ0aWNhbExpbmVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmVydGljYWxMaW5lRWxlbWVudC5jbGFzc05hbWUgPSAnZGFzaGdyaWQtZ3JpZC1saW5lczsnXG5cbiAgICByZXR1cm4gdmVydGljYWxMaW5lRWxlbWVudDsgXG59XG4iXX0=
