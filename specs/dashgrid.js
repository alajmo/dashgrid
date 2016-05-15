(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Box;

/**
 *
 * @param {}
 * @returns
 */

function Box() {
    var dashgrid = comp.dashgrid;

    /**
     * Create Box element.
     * @param {Object} box box.
     */

    var createBox = function createBox(box) {
        Object.assign(box, boxSettings(box, dashgrid));
        if (box.content) {
            box._element.appendChild(box.content);
        }

        dashgrid._boxesElement.appendChild(box._element);
    };

    /**
     * Creates the shadow box element which is used when dragging / resizing
     *     a box. It gets attached to the dragging / resizing box, while
     *     box gets to move / resize freely and snaps back to its original
     *     or new position at drag / resize stop. Append it to the grid.
     */
    var createShadowBox = function createShadowBox() {
        if (document.getElementById('dashgrid-shadow-box') === null) {
            dashgrid._shadowBoxElement = document.createElement('div');
            dashgrid._shadowBoxElement.id = 'dashgrid-shadow-box';

            dashgrid._shadowBoxElement.className = 'dashgrid-shadow-box';
            dashgrid._shadowBoxElement.style.position = 'absolute';
            dashgrid._shadowBoxElement.style.display = '';
            dashgrid._shadowBoxElement.style.zIndex = 1002;
            dashgrid._element.appendChild(dashgrid._shadowBoxElement);
        }
    };

    return Object.freeze({ createBox: createBox, createShadowBox: createShadowBox });
}

/**
 * Box properties and events.
 */
function boxSettings(boxElement, dashgrid) {
    return {
        _element: function () {
            var el = document.createElement('div');
            el.className = 'dashgrid-box';
            el.style.position = 'absolute';
            el.style.cursor = 'move';
            el.style.transition = dashgrid.transition;
            el.style.zIndex = 1003;
            createBoxResizeHandlers(el, dashgrid);

            return el;
        }(),

        row: boxElement.row,
        column: boxElement.column,
        rowspan: boxElement.rowspan || 1,
        columnspan: boxElement.columnspan || 1,
        draggable: boxElement.draggable === false ? false : true,
        resizable: boxElement.resizable === false ? false : true,
        pushable: boxElement.pushable === false ? false : true,
        floating: boxElement.floating === true ? true : false,
        stacking: boxElement.stacking === true ? true : false,
        swapping: boxElement.swapping === true ? true : false,
        inherit: boxElement.inherit === true ? true : false
    };
}

/**
 * Creates box resize handlers and appends them to box.
 */
function createBoxResizeHandlers(boxElement, dashgrid) {
    var handle = void 0;

    /**
     * TOP Handler.
     */
    if (dashgrid.resizable.handle.indexOf('n') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-n';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'n-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * BOTTOM Handler.
     */
    if (dashgrid.resizable.handle.indexOf('s') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-s';
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 's-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('w') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-w';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'w-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('e') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-e';
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'e-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('ne') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-ne';
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'ne-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('se') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-se';
        handle.style.right = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'se-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('sw') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-sw';
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'sw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('nw') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-nw';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'nw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _grid = require('./grid.js');

var _grid2 = _interopRequireDefault(_grid);

var _box = require('./box.js');

var _box2 = _interopRequireDefault(_box);

var _renderer = require('./renderer.js');

var _renderer2 = _interopRequireDefault(_renderer);

var _mouse = require('./mouse.js');

var _mouse2 = _interopRequireDefault(_mouse);

var _drag = require('./drag.js');

var _drag2 = _interopRequireDefault(_drag);

var _resize = require('./resize.js');

var _resize2 = _interopRequireDefault(_resize);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Dashgrid;

/**
 * The DOM representation is:
 *    <div class="dashgrid">
 *        <!-- Boxes -->
 *        <div class="dashgrid-boxes">
 *            <div class="dashgrid-box">
 *                <div class="content-element"></div>
 *                <div class="dashgrid-box-resize-handle-n"></div>
 *                <div class="dashgrid-box-resize-handle-e"></div>
 *                <div class="dashgrid-box-resize-handle-w"></div>
 *                <div class="dashgrid-box-resize-handle-s"></div>
 *                <div class="dashgrid-box-resize-handle-ne"></div>
 *                <div class="dashgrid-box-resize-handle-nw"></div>
 *                <div class="dashgrid-box-resize-handle-se"></div>
 *                <div class="dashgrid-box-resize-handle-sw"></div>
 *            </div>
 *        </div>
 *
 *        <!-- Shadow Box -->
 *        <div class="dashgrid-shadow-box"></div>
 *
 *        <!-- Grid Lines -->
 *        <div class="dashgrid-grid-lines"></div>
 *
 *        <!-- Grid Centroids -->
 *        <div class="dashgrid-grid-centroids"></div>
 *    </div>
 * @param {Object} element The dashgrid element.
 * @param {Object} gs Grid settings.
 */
// import './shims.js';

function Dashgrid(element, gs) {
    var dashgrid = Object.assign({}, dashgridSettings(gs, element));

    var renderer = (0, _renderer2.default)({ dashgrid: dashgrid });
    var boxHandler = (0, _box2.default)({ dashgrid: dashgrid });
    var grid = (0, _grid2.default)({ dashgrid: dashgrid, renderer: renderer, boxHandler: boxHandler });
    var dragger = (0, _drag2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var resizer = (0, _resize2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var mouse = (0, _mouse2.default)({ dragger: dragger, resizer: resizer, dashgrid: dashgrid, grid: grid });

    // Initialize.
    boxHandler.createShadowBox();
    grid.init();
    mouse.init();

    // Event listeners.
    (0, _utils.addEvent)(window, 'resize', function () {
        renderer.setColumnWidth();
        renderer.setRowHeight();
        grid.refreshGrid();
    });

    // User event after grid is done loading.
    if (dashgrid.onGridReady) {
        dashgrid.onGridReady();
    } // user event.

    // API.
    return Object.freeze({
        updateBox: grid.updateBox,
        insertBox: grid.insertBox,
        removeBox: grid.removeBox,
        getBoxes: grid.getBoxes,
        refreshGrid: grid.refreshGrid,
        dashgrid: dashgrid
    });
}

/**
 * Grid properties and events.
 */
function dashgridSettings(gs, element) {
    var dashgrid = {
        _element: function () {
            element.style.position = 'absolute';
            element.style.top = '0px';
            element.style.left = '0px';
            element.style.display = 'block';
            element.style.zIndex = '1000';
            (0, _utils.removeNodes)(element);
            return element;
        }(),

        boxes: gs.boxes || [],

        rowHeight: gs.rowHeight,
        numRows: gs.numRows !== undefined ? gs.numRows : 6,
        minRows: gs.minRows !== undefined ? gs.minRows : 6,
        maxRows: gs.maxRows !== undefined ? gs.maxRows : 10,

        extraRows: 0,
        extraColumns: 0,

        columnWidth: gs.columnWidth,
        numColumns: gs.numColumns !== undefined ? gs.numColumns : 6,
        minColumns: gs.minColumns !== undefined ? gs.minColumns : 6,
        maxColumns: gs.maxColumns !== undefined ? gs.maxColumns : 10,

        xMargin: gs.xMargin !== undefined ? gs.xMargin : 20,
        yMargin: gs.yMargin !== undefined ? gs.yMargin : 20,

        defaultBoxRowspan: 2,
        defaultBoxColumnspan: 1,

        minRowspan: gs.minRowspan !== undefined ? gs.minRowspan : 1,
        maxRowspan: gs.maxRowspan !== undefined ? gs.maxRowspan : 9999,

        minColumnspan: gs.minColumnspan !== undefined ? gs.minColumnspan : 1,
        maxColumnspan: gs.maxColumnspan !== undefined ? gs.maxColumnspan : 9999,

        pushable: gs.pushable === false ? false : true,
        floating: gs.floating === true ? true : false,
        stacking: gs.stacking === true ? true : false,
        swapping: gs.swapping === true ? true : false,
        animate: gs.animate === true ? true : false,

        liveChanges: gs.liveChanges === false ? false : true,

        // Drag handle can be a custom classname or if not set revers to the
        // box container with classname 'dashgrid-box'.
        draggable: {
            enabled: gs.draggable && gs.draggable.enabled === false ? false : true,
            handle: gs.draggable && gs.draggable.handle || 'dashgrid-box',

            // user cb's.
            dragStart: gs.draggable && gs.draggable.dragStart,
            dragging: gs.draggable && gs.draggable.dragging,
            dragEnd: gs.draggable && gs.draggable.dragEnd
        },

        resizable: {
            enabled: gs.resizable && gs.resizable.enabled === false ? false : true,
            handle: gs.resizable && gs.resizable.handle || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: gs.resizable && gs.resizable.handleWidth !== undefined ? gs.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: gs.resizable && gs.resizable.resizeStart,
            resizing: gs.resizable && gs.resizable.resizing,
            resizeEnd: gs.resizable && gs.resizable.resizeEnd
        },

        onUpdate: function onUpdate() {},

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapBackTime: gs.snapBackTime === undefined ? 300 : gs.snapBackTime,

        showGridLines: gs.showGridLines === false ? false : true,
        showGridCentroids: gs.showGridCentroids === false ? false : true
    };

    dashgrid._boxesElement = function () {
        var boxesElement = document.createElement('div');
        boxesElement.className = 'dashgrid-boxes';
        dashgrid._element.appendChild(boxesElement);
        return boxesElement;
    }();

    dashgrid;

    return dashgrid;
}

},{"./box.js":1,"./drag.js":3,"./grid.js":4,"./mouse.js":7,"./renderer.js":8,"./resize.js":9,"./utils.js":10}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Dragger;


function Dragger(comp) {
    var dashgrid = comp.dashgrid;
    var renderer = comp.renderer;
    var grid = comp.grid;


    var eX = void 0,
        eY = void 0,
        eW = void 0,
        eH = void 0,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        minTop = dashgrid.yMargin,
        minLeft = dashgrid.xMargin,
        currState = {},
        prevState = {};

    /**
     * Create shadowbox, remove smooth transitions for box,
     * and init mouse variables. Finally, make call to api to check if,
     * any box is close to bottom / right
     * @param {Object} box
     * @param {Object} e
     */
    var dragStart = function dragStart(box, e) {
        box._element.style.zIndex = 1004;
        box._element.style.transition = '';
        dashgrid._shadowBoxElement.style.left = box._element.style.left;
        dashgrid._shadowBoxElement.style.top = box._element.style.top;
        dashgrid._shadowBoxElement.style.width = box._element.style.width;
        dashgrid._shadowBoxElement.style.height = box._element.style.height;
        dashgrid._shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        eX = parseInt(box._element.offsetLeft, 10);
        eY = parseInt(box._element.offsetTop, 10);
        eW = parseInt(box._element.offsetWidth, 10);
        eH = parseInt(box._element.offsetHeight, 10);

        grid.updateStart(box);

        if (dashgrid.draggable.dragStart) {
            dashgrid.draggable.dragStart();
        } // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var drag = function drag(box, e) {
        updateMovingElement(box, e);
        grid.updating(box);

        if (dashgrid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        if (dashgrid.draggable.dragging) {
            dashgrid.draggable.dragging();
        } // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var dragEnd = function dragEnd(box, e) {
        if (!dashgrid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        // Set box style.
        box._element.style.transition = dashgrid.transition;
        box._element.style.left = dashgrid._shadowBoxElement.style.left;
        box._element.style.top = dashgrid._shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            box._element.style.zIndex = 1003;
            dashgrid._shadowBoxElement.style.display = 'none';
            grid.updateEnd();
        }, dashgrid.snapBackTime);

        if (dashgrid.draggable.dragEnd) {
            dashgrid.draggable.dragEnd();
        } // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var moveBox = function moveBox(box, e) {
        if (currState.row !== prevState.row || currState.column !== prevState.column) {

            var prevScrollHeight = dashgrid._element.offsetHeight - window.innerHeight;
            var prevScrollWidth = dashgrid._element.offsetWidth - window.innerWidth;
            var validMove = grid.updateBox(box, currState, box);

            // updateGridDimension preview box.
            if (validMove) {

                renderer.setBoxElementYPosition(dashgrid._shadowBoxElement, currState.row);
                renderer.setBoxElementXPosition(dashgrid._shadowBoxElement, currState.column);

                var postScrollHeight = dashgrid._element.offsetHeight - window.innerHeight;
                var postScrollWidth = dashgrid._element.offsetWidth - window.innerWidth;

                // Account for minimizing scroll height when moving box upwards.
                // Otherwise bug happens where the dragged box is changed but directly
                // afterwards the dashgrid element dimension is changed.
                if (Math.abs(dashgrid._element.offsetHeight - window.innerHeight - window.scrollY) < 30 && window.scrollY > 0 && prevScrollHeight !== postScrollHeight) {
                    box._element.style.top = box._element.offsetTop - 100 + 'px';
                }

                if (Math.abs(dashgrid._element.offsetWidth - window.innerWidth - window.scrollX) < 30 && window.scrollX > 0 && prevScrollWidth !== postScrollWidth) {

                    box._element.style.left = box._element.offsetLeft - 100 + 'px';
                }
            }
        }

        // No point in attempting move if not switched to new cell.
        prevState = { row: currState.row, column: currState.column };
    };

    /**
     * The moving element,
     * @param {Object} box
     * @param {Object} e
     */
    var updateMovingElement = function updateMovingElement(box, e) {
        var maxLeft = dashgrid._element.offsetWidth - dashgrid.xMargin;
        var maxTop = dashgrid._element.offsetHeight - dashgrid.yMargin;

        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        var diffX = mouseX - lastMouseX + mOffX;
        var diffY = mouseY - lastMouseY + mOffY;

        mOffX = 0;
        mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        var dX = diffX;
        var dY = diffY;
        if (eX + dX < minLeft) {
            diffX = minLeft - eX;
            mOffX = dX - diffX;
        } else if (eX + eW + dX > maxLeft) {
            diffX = maxLeft - eX - eW;
            mOffX = dX - diffX;
        }

        if (eY + dY < minTop) {
            diffY = minTop - eY;
            mOffY = dY - diffY;
        } else if (eY + eH + dY > maxTop) {
            diffY = maxTop - eY - eH;
            mOffY = dY - diffY;
        }
        eX += diffX;
        eY += diffY;

        box._element.style.top = eY + 'px';
        box._element.style.left = eX + 'px';

        // Scrolling when close to bottom boundary.
        if (e.pageY - document.body.scrollTop < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - dashgrid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + dashgrid.scrollSpeed;
        }

        // Scrolling when close to right boundary.
        if (e.pageX - document.body.scrollLeft < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - dashgrid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + dashgrid.scrollSpeed;
        }
    };

    return Object.freeze({
        dragStart: dragStart,
        drag: drag,
        dragEnd: dragEnd
    });
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gridView = require('./gridView.js');

var _gridView2 = _interopRequireDefault(_gridView);

var _gridEngine = require('./gridEngine.js');

var _gridEngine2 = _interopRequireDefault(_gridEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Grid;

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
 * @returns {Function} updating During dragging / resizing.
 * @returns {Function} updateEnd After drag / resize ends.
 * @returns {Function} renderGrid Update grid element.
 */

function Grid(obj) {
    var dashgrid = obj.dashgrid;
    var renderer = obj.renderer;
    var boxHandler = obj.boxHandler;


    var gridView = (0, _gridView2.default)({ dashgrid: dashgrid, renderer: renderer });
    var gridEngine = (0, _gridEngine2.default)({ dashgrid: dashgrid, boxHandler: boxHandler });

    /**
     * creates the necessary box elements and checks that the boxes input is
     * correct.
     * 1. Create box elements.
     * 2. Update the dashgrid since newly created boxes may lie outside the
     *    initial dashgrid state.
     * 3. Render the dashgrid.
     */
    var init = function init() {
        // Create the box elements and update number of rows / columns.
        gridEngine.init();

        // Update the Grid View.
        gridView.init();
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
    var updating = function updating(box) {
        // gridEngine.increaseNumRows(box, 1);
        // gridEngine.increaseNumColumns(box, 1);
        // gridView.renderGrid();
    };

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
        insertBox: gridEngine.insertBox,
        removeBox: gridEngine.removeBox,
        getBox: gridEngine.getBox,
        updateStart: updateStart,
        updating: updating,
        updateEnd: updateEnd,
        refreshGrid: refreshGrid
    });
}

},{"./gridEngine.js":5,"./gridView.js":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = GridEngine;
/**
 * @description Handles collision logic and dashgrid dimension.
 * @param {Object} obj
 */

function GridEngine(obj) {
    var dashgrid = obj.dashgrid;
    var boxHandler = obj.boxHandler;

    var boxes = void 0,
        movingBox = void 0,
        movedBoxes = void 0;

    var init = function init() {
        createBoxElements();
        updateNumRows();
        updateNumColumns();
    };

    /**
     * Create box elements.
     */
    var createBoxElements = function createBoxElements() {
        for (var i = 0, len = dashgrid.boxes.length; i < len; i++) {
            boxHandler.createBox(dashgrid.boxes[i]);
        }
        boxes = dashgrid.boxes;
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

},{"./utils.js":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = GridView;

/**
 * Handles the rendering from javascript to DOM.
 *
 * @param {Object} dashgrid.
 * @param {renderer} renderer.
 */

function GridView(obj) {
    var dashgrid = obj.dashgrid;
    var renderer = obj.renderer;

    var gridLinesElement = void 0;
    var gridCentroidsElement = void 0;

    var init = function init() {
        if (dashgrid.showGridLines) {
            createGridLinesElement();
        }
        if (dashgrid.showGridCentroids) {
            createGridCentroidsElement();
        }

        renderer.setColumnWidth();
        renderer.setRowHeight();

        renderGrid();
        renderBox(dashgrid.boxes);
    };

    /**
     * Create vertical and horizontal line elements.
     */
    var createGridLinesElement = function createGridLinesElement() {
        var lineElementID = 'dashgrid-grid-lines';
        if (document.getElementById(lineElementID) === null) {
            gridLinesElement = document.createElement('div');
            gridLinesElement.id = lineElementID;
            dashgrid._element.appendChild(gridLinesElement);
        }
    };

    /**
     * Create vertical and horizontal line elements.
     */
    var createGridCentroidsElement = function createGridCentroidsElement() {
        var centroidElementID = 'dashgrid-grid-centroids';
        if (document.getElementById(centroidElementID) === null) {
            gridCentroidsElement = document.createElement('div');
            gridCentroidsElement.id = centroidElementID;
            dashgrid._element.appendChild(gridCentroidsElement);
        }
    };

    /**
     * Draw horizontal and vertical grid lines with the thickness of xMargin
     * yMargin.
     */
    var renderGridLines = function renderGridLines() {
        if (gridLinesElement === null) {
            return;
        }

        (0, _utils.removeNodes)(gridLinesElement);
        var columnWidth = renderer.getColumnWidth();
        var rowHeight = renderer.getRowHeight();

        var htmlString = '';
        // Horizontal lines
        for (var i = 0; i <= dashgrid.numRows; i += 1) {
            htmlString += '<div class=\'dashgrid-horizontal-line\'\n                style=\'top: ' + i * (rowHeight + dashgrid.yMargin) + 'px;\n                    left: 0px;\n                    width: 100%;\n                    height: ' + dashgrid.yMargin + 'px;\n                    position: absolute;\'>\n                </div>';
        }

        // Vertical lines
        for (var _i = 0; _i <= dashgrid.numColumns; _i += 1) {
            htmlString += '<div class=\'dashgrid-vertical-line\'\n                style=\'top: 0px;\n                    left: ' + _i * (columnWidth + dashgrid.xMargin) + 'px;\n                    height: 100%;\n                    width: ' + dashgrid.xMargin + 'px;\n                    position: absolute;\'>\n                </div>';
        }

        gridLinesElement.innerHTML = htmlString;
    };

    /**
     * Draw horizontal and vertical grid lines with the thickness of xMargin
     * yMargin.
     */
    var renderGridCentroids = function renderGridCentroids() {
        if (gridCentroidsElement === null) {
            return;
        };

        (0, _utils.removeNodes)(gridCentroidsElement);
        var columnWidth = renderer.getColumnWidth();
        var rowHeight = renderer.getRowHeight();

        var htmlString = '';
        // Draw centroids
        for (var i = 0; i < dashgrid.numRows; i += 1) {
            for (var j = 0; j < dashgrid.numColumns; j += 1) {
                htmlString += '<div class=\'dashgrid-grid-centroid\'\n                    style=\'top: ' + (i * (rowHeight + dashgrid.yMargin) + rowHeight / 2 + dashgrid.yMargin) + 'px;\n                        left: ' + (j * (columnWidth + dashgrid.xMargin) + columnWidth / 2 + dashgrid.xMargin) + 'px;\n                            position: absolute;\'>\n                    </div>';
            }
        }

        gridCentroidsElement.innerHTML = htmlString;
    };

    /**
     * Render the dashgrid:
     *    1. Setting grid and cell height / width
     *    2. Painting.
     */
    var renderGrid = function renderGrid() {
        renderer.setGridElementHeight();
        renderer.setGridElementWidth();
        renderer.setCellCentroids();

        if (dashgrid.showGridLines) {
            renderGridLines();
        }
        if (dashgrid.showGridCentroids) {
            renderGridCentroids();
        }
    };

    /**
     * @param {Array.<Object>} boxes List of boxes to redraw.
     * @param {Object} excludeBox Don't redraw this box.
     */
    var renderBox = function renderBox(boxes, excludeBox) {
        window.requestAnimFrame(function () {
            // updateGridDimension moved boxes css.
            boxes.forEach(function (box) {
                if (excludeBox !== box) {
                    renderer.setBoxElementYPosition(box._element, box.row);
                    renderer.setBoxElementXPosition(box._element, box.column);
                    renderer.setBoxElementHeight(box._element, box.rowspan);
                    renderer.setBoxElementWidth(box._element, box.columnspan);
                }
            });
        });
    };

    return Object.freeze({
        init: init,
        renderGrid: renderGrid,
        renderBox: renderBox,
        createGridLinesElement: createGridLinesElement,
        createGridCentroidsElement: createGridCentroidsElement
    });
}

},{"./utils.js":10}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = MouseHandler;

var _utils = require('./utils');

function MouseHandler(comp) {
    var dragger = comp.dragger;
    var resizer = comp.resizer;
    var dashgrid = comp.dashgrid;
    var grid = comp.grid;


    var inputTags = ['select', 'input', 'textarea', 'button'];

    function init() {
        dashgrid._element.addEventListener('mousedown', function (e) {
            mouseDown(e, dashgrid._element);e.preventDefault();
        }, false);
    }

    function mouseDown(e, element) {
        var node = e.target;

        // Exit if:
        // 1. the target has it's own click event or
        // 2. target has onclick attribute or
        // 3. Right / middle button clicked instead of left.
        if (inputTags.indexOf(node.nodeName.toLowerCase()) > -1) {
            return;
        }
        if (node.hasAttribute('onclick')) {
            return;
        }
        if (e.which === 2 || e.which === 3) {
            return;
        }

        // Handle drag / resize event.
        if (node.className.search(/dashgrid-box-resize-handle/) > -1) {
            handleEvent(e, resizeEvent);
        } else if (node.className.search(dashgrid.draggable.handle) > -1) {
            handleEvent(e, dragEvent);
        }
    }

    /**
     * Handle mouse event, click or resize.
     * @param {Object} e
     * @param {Function} cb
     */
    function handleEvent(e, cb) {
        var boxElement = (0, _utils.findParent)(e.target, /^dashgrid-box$/);
        var box = grid.getBox(boxElement);
        if (box) {
            cb(box, e);
        }
    }

    /**
     * Drag event, sets off start drag, during drag and end drag.
     * @param {Object} box
     * @param {Object} e
     */
    function dragEvent(box, e) {
        if (!dashgrid.draggable.enabled || !box.draggable) {
            return;
        }

        // console.log('dragstart');
        dragger.dragStart(box, e);

        document.addEventListener('mouseup', dragEnd, false);
        document.addEventListener('mousemove', drag, false);

        function drag(e) {
            // console.log('drag');
            dragger.drag(box, e);
            e.preventDefault();
        }

        function dragEnd(e) {
            // console.log('dragend');
            dragger.dragEnd(box, e);
            e.preventDefault();
            document.removeEventListener('mouseup', dragEnd, false);
            document.removeEventListener('mousemove', drag, false);
        }
    }

    /**
     * Resize event, sets off start resize, during resize and end resize.
     * @param {Object} box
     * @param {Object} e
     */
    function resizeEvent(box, e) {
        if (!dashgrid.resizable.enabled || !box.resizable) {
            return;
        }
        resizer.resizeStart(box, e);

        document.addEventListener('mouseup', resizeEnd, false);
        document.addEventListener('mousemove', resize, false);

        function resize(e) {
            resizer.resize(box, e);e.preventDefault();
        }

        function resizeEnd(e) {
            document.removeEventListener('mouseup', resizeEnd, false);
            document.removeEventListener('mousemove', resize, false);

            resizer.resizeEnd(box, e);
            e.preventDefault();
        }
    }

    return Object.freeze({
        init: init
    });
} /**
   * mouseHandler.js: Initializes and sets up the events for dragging / resizing.
   */

},{"./utils":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = Render;


function Render(comp) {
    var dashgrid = comp.dashgrid;

    // Start row / column denotes the pixel at which each cell starts at.

    var startColumn = [];
    var startRow = [];
    var columnWidth = void 0,
        rowHeight = void 0;

    /**
    * @returns 
    */
    var getColumnWidth = function getColumnWidth() {
        return columnWidth;
    };

    /**
    * @returns 
    */
    var getRowHeight = function getRowHeight() {
        return rowHeight;
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setGridElementWidth = function setGridElementWidth() {
        dashgrid._element.style.width = columnWidth ? columnWidth * dashgrid.numColumns + (dashgrid.numColumns + 1) * dashgrid.xMargin + 'px' : dashgrid._element.parentNode.offsetWidth + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setColumnWidth = function setColumnWidth() {
        columnWidth = dashgrid.columnWidth !== 'auto' ? dashgrid.columnWidth : (dashgrid._element.parentNode.offsetWidth - (dashgrid.numColumns + 1) * dashgrid.xMargin) / dashgrid.numColumns;
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setGridElementHeight = function setGridElementHeight() {
        dashgrid._element.style.height = rowHeight ? rowHeight * dashgrid.numRows + (dashgrid.numRows + 1) * dashgrid.yMargin + 'px' : dashgrid._element.parentNode.offsetHeight + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setRowHeight = function setRowHeight() {
        rowHeight = dashgrid.rowHeight !== 'auto' ? dashgrid.rowHeight : (dashgrid._element.parentNode.offsetHeight - (dashgrid.numRows + 1) * dashgrid.yMargin) / dashgrid.numRows;
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementXPosition = function setBoxElementXPosition(element, column) {
        element.style.left = column * columnWidth + dashgrid.xMargin * (column + 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementYPosition = function setBoxElementYPosition(element, row) {
        element.style.top = row * rowHeight + dashgrid.yMargin * (row + 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementWidth = function setBoxElementWidth(element, columnspan) {
        element.style.width = columnspan * columnWidth + dashgrid.xMargin * (columnspan - 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    var setBoxElementHeight = function setBoxElementHeight(element, rowspan) {
        element.style.height = rowspan * rowHeight + dashgrid.yMargin * (rowspan - 1) + 'px';
    };

    /**
     * Initializes cell centroids which are used to compute closest cell
     *     when dragging a box.
     * @param {Number} numRows The total number of rows.
     * @param {Number} numColumns The total number of rows.
     */
    var setCellCentroids = function setCellCentroids() {
        startRow = [];
        startColumn = [];
        var start = void 0;
        var stop = void 0;

        for (var i = 0; i < dashgrid.numRows; i += 1) {
            start = i * (rowHeight + dashgrid.yMargin) + dashgrid.yMargin / 2;
            stop = start + rowHeight + dashgrid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (var _i = 0; _i < dashgrid.numColumns; _i += 1) {
            start = _i * (columnWidth + dashgrid.xMargin) + dashgrid.xMargin / 2;
            stop = start + columnWidth + dashgrid.xMargin;
            startColumn.push([Math.floor(start), Math.ceil(stop)]);
        }
    };

    /**
     * Finds which cells box intersects with.
     * @param {Object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows How many rows the box spans.
     * @param {Number} numColumns How many rows the box spans.
     * @return {Object} The row or column which each side is found in.
     *     For instance, boxLeft: column = 0, boxRight: column = 1,
     *     BoxTop: row = 0, BoxBottom: row = 3.
     */
    var findIntersectedCells = function findIntersectedCells(comp) {
        var top = comp.top;
        var right = comp.right;
        var bottom = comp.bottom;
        var left = comp.left;

        var boxLeft = void 0,
            boxRight = void 0,
            boxTop = void 0,
            boxBottom = void 0;

        // Find top and bottom intersection cell row.
        for (var i = 0; i < dashgrid.numRows; i += 1) {
            if (top >= startRow[i][0] && top <= startRow[i][1]) {
                boxTop = i;
            }
            if (bottom >= startRow[i][0] && bottom <= startRow[i][1]) {
                boxBottom = i;
            }
        }

        // Find left and right intersection cell column.
        for (var j = 0; j < dashgrid.numColumns; j += 1) {
            if (left >= startColumn[j][0] && left <= startColumn[j][1]) {
                boxLeft = j;
            }
            if (right >= startColumn[j][0] && right <= startColumn[j][1]) {
                boxRight = j;
            }
        }

        return { boxLeft: boxLeft, boxRight: boxRight, boxTop: boxTop, boxBottom: boxBottom };
    };

    /**
     * Get closest cell given (row, column) position in px.
     * @param {Object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows
     * @param {Number} numColumns
     * @returns {Object}
     */
    var getClosestCells = function getClosestCells(comp) {
        var top = comp.top;
        var right = comp.right;
        var bottom = comp.bottom;
        var left = comp.left;

        var _findIntersectedCells = findIntersectedCells(comp);

        var boxLeft = _findIntersectedCells.boxLeft;
        var boxRight = _findIntersectedCells.boxRight;
        var boxTop = _findIntersectedCells.boxTop;
        var boxBottom = _findIntersectedCells.boxBottom;


        var column = void 0;
        var leftOverlap = void 0;
        var rightOverlap = void 0;
        // Determine if enough overlap for horizontal move.
        if (boxLeft !== undefined && boxRight !== undefined) {
            leftOverlap = Math.abs(left - startColumn[boxLeft][0]);
            rightOverlap = Math.abs(right - startColumn[boxRight][1] - dashgrid.xMargin);
            if (leftOverlap <= rightOverlap) {
                column = boxLeft;
            } else {
                column = boxLeft + 1;
            }
        }

        var row = void 0;
        var topOverlap = void 0;
        var bottomOverlap = void 0;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - dashgrid.yMargin);
            if (topOverlap <= bottomOverlap) {
                row = boxTop;
            } else {
                row = boxTop + 1;
            }
        }

        return { row: row, column: column };
    };

    return Object.freeze({
        getColumnWidth: getColumnWidth,
        getRowHeight: getRowHeight,
        setColumnWidth: setColumnWidth,
        setRowHeight: setRowHeight,
        setGridElementHeight: setGridElementHeight,
        setGridElementWidth: setGridElementWidth,
        setBoxElementXPosition: setBoxElementXPosition,
        setBoxElementYPosition: setBoxElementYPosition,
        setBoxElementWidth: setBoxElementWidth,
        setBoxElementHeight: setBoxElementHeight,
        findIntersectedCells: findIntersectedCells,
        setCellCentroids: setCellCentroids,
        getClosestCells: getClosestCells
    });
}

},{"./utils.js":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Resizer;


function Resizer(comp) {
    var dashgrid = comp.dashgrid;
    var renderer = comp.renderer;
    var grid = comp.grid;


    var minWidth = void 0,
        minHeight = void 0,
        elementLeft = void 0,
        elementTop = void 0,
        elementWidth = void 0,
        elementHeight = void 0,
        minTop = void 0,
        maxTop = void 0,
        minLeft = void 0,
        maxLeft = void 0,
        className = void 0,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        newState = {},
        prevState = {};

    /**
     * @param {Object} box
     * @param {Object} e
     */
    var resizeStart = function resizeStart(box, e) {
        className = e.target.className;

        // Removes transitions, displays and inits positions for preview box.
        box._element.style.zIndex = 1004;
        box._element.style.transition = '';
        dashgrid._shadowBoxElement.style.left = box._element.style.left;
        dashgrid._shadowBoxElement.style.top = box._element.style.top;
        dashgrid._shadowBoxElement.style.width = box._element.style.width;
        dashgrid._shadowBoxElement.style.height = box._element.style.height;
        dashgrid._shadowBoxElement.style.display = '';

        // Mouse values.
        minWidth = renderer.getColumnWidth();
        minHeight = renderer.getRowHeight();
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        elementLeft = parseInt(box._element.style.left, 10);
        elementTop = parseInt(box._element.style.top, 10);
        elementWidth = box._element.offsetWidth;
        elementHeight = box._element.offsetHeight;

        grid.updateStart(box);

        if (dashgrid.resizable.resizeStart) {
            dashgrid.resizable.resizeStart();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var resize = function resize(box, e) {
        updateResizingElement(box, e);
        grid.updating(box);

        if (dashgrid.liveChanges) {
            // Which cell to snap shadowbox to.

            var _renderer$findInterse = renderer.findIntersectedCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });

            var boxLeft = _renderer$findInterse.boxLeft;
            var boxRight = _renderer$findInterse.boxRight;
            var boxTop = _renderer$findInterse.boxTop;
            var boxBottom = _renderer$findInterse.boxBottom;

            newState = { row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1 };

            resizeBox(box, e);
        }

        if (dashgrid.resizable.resizing) {
            dashgrid.resizable.resizing();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var resizeEnd = function resizeEnd(box, e) {
        if (!dashgrid.liveChanges) {
            var _renderer$findInterse2 = renderer.findIntersectedCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight,
                numRows: grid.getNumRows(),
                numColumns: grid.getNumColumns()
            });

            var boxLeft = _renderer$findInterse2.boxLeft;
            var boxRight = _renderer$findInterse2.boxRight;
            var boxTop = _renderer$findInterse2.boxTop;
            var boxBottom = _renderer$findInterse2.boxBottom;

            newState = { row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1 };
            resizeBox(box, e);
        }

        // Set box style.
        box._element.style.transition = dashgrid.transition;
        box._element.style.left = dashgrid._shadowBoxElement.style.left;
        box._element.style.top = dashgrid._shadowBoxElement.style.top;
        box._element.style.width = dashgrid._shadowBoxElement.style.width;
        box._element.style.height = dashgrid._shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            box._element.style.zIndex = 1003;
            dashgrid._shadowBoxElement.style.display = '';
            grid.updateEnd();
        }, dashgrid.snapBackTime);

        if (dashgrid.resizable.resizeEnd) {
            dashgrid.resizable.resizeEnd();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var resizeBox = function resizeBox(box, e) {
        if (newState.row !== prevState.row || newState.column !== prevState.column || newState.rowspan !== prevState.rowspan || newState.columnspan !== prevState.columnspan) {

            var update = grid.updateBox(box, newState, box);

            // updateGridDimension preview box.
            if (update) {
                renderer.setBoxElementXPosition(dashgrid._shadowBoxElement, newState.column);
                renderer.setBoxElementYPosition(dashgrid._shadowBoxElement, newState.row);
                renderer.setBoxElementWidth(dashgrid._shadowBoxElement, newState.columnspan);
                renderer.setBoxElementHeight(dashgrid._shadowBoxElement, newState.rowspan);
            }
        }

        // No point in attempting update if not switched to new cell.
        prevState.row = newState.row;
        prevState.column = newState.column;
        prevState.rowspan = newState.rowspan;
        prevState.columnspan = newState.columnspan;

        if (dashgrid.resizable.resizing) {
            dashgrid.resizable.resizing();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var updateResizingElement = function updateResizingElement(box, e) {
        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        var diffX = mouseX - lastMouseX + mOffX;
        var diffY = mouseY - lastMouseY + mOffY;
        mOffX = mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        var dY = diffY;
        var dX = diffX;

        minTop = dashgrid.yMargin;
        maxTop = dashgrid._element.offsetHeight - dashgrid.yMargin;
        minLeft = dashgrid.xMargin;
        maxLeft = dashgrid._element.offsetWidth - dashgrid.xMargin;

        if (className.indexOf('dashgrid-box-resize-handle-w') > -1 || className.indexOf('dashgrid-box-resize-handle-nw') > -1 || className.indexOf('dashgrid-box-resize-handle-sw') > -1) {
            if (elementWidth - dX < minWidth) {
                diffX = elementWidth - minWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + dX < minLeft) {
                diffX = minLeft - elementLeft;
                mOffX = dX - diffX;
            }
            elementLeft += diffX;
            elementWidth -= diffX;
        }

        if (className.indexOf('dashgrid-box-resize-handle-e') > -1 || className.indexOf('dashgrid-box-resize-handle-ne') > -1 || className.indexOf('dashgrid-box-resize-handle-se') > -1) {

            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxLeft) {
                diffX = maxLeft - elementLeft - elementWidth;
                mOffX = dX - diffX;
            }
            elementWidth += diffX;
        }

        if (className.indexOf('dashgrid-box-resize-handle-n') > -1 || className.indexOf('dashgrid-box-resize-handle-nw') > -1 || className.indexOf('dashgrid-box-resize-handle-ne') > -1) {
            if (elementHeight - dY < minHeight) {
                diffY = elementHeight - minHeight;
                mOffY = dY - diffY;
            } else if (elementTop + dY < minTop) {
                diffY = minTop - elementTop;
                mOffY = dY - diffY;
            }
            elementTop += diffY;
            elementHeight -= diffY;
        }

        if (className.indexOf('dashgrid-box-resize-handle-s') > -1 || className.indexOf('dashgrid-box-resize-handle-sw') > -1 || className.indexOf('dashgrid-box-resize-handle-se') > -1) {
            if (elementHeight + dY < minHeight) {
                diffY = minHeight - elementHeight;
                mOffY = dY - diffY;
            } else if (elementTop + elementHeight + dY > maxTop) {
                diffY = maxTop - elementTop - elementHeight;
                mOffY = dY - diffY;
            }
            elementHeight += diffY;
        }

        box._element.style.top = elementTop + 'px';
        box._element.style.left = elementLeft + 'px';
        box._element.style.width = elementWidth + 'px';
        box._element.style.height = elementHeight + 'px';

        // Scrolling when close to bottom boundary.
        if (e.pageY - document.body.scrollTop < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - dashgrid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + dashgrid.scrollSpeed;
        }

        // Scrolling when close to right boundary.
        if (e.pageX - document.body.scrollLeft < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - dashgrid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + dashgrid.scrollSpeed;
        }
    };

    return Object.freeze({
        resizeStart: resizeStart,
        resize: resize,
        resizeEnd: resizeEnd
    });
}

},{}],10:[function(require,module,exports){
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

},{}]},{},[2]);
