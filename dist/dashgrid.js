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

function Box(comp) {
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

require('./shims.js');

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

function Dashgrid(element, gs) {
    var dashgrid = Object.assign({}, dashgridSettings(gs, element));

    var renderer = (0, _renderer2.default)({ dashgrid: dashgrid });
    var box = (0, _box2.default)({ dashgrid: dashgrid });
    var grid = (0, _grid2.default)({ dashgrid: dashgrid, renderer: renderer, box: box });
    var dragger = (0, _drag2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var resizer = (0, _resize2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var mouse = (0, _mouse2.default)({ dragger: dragger, resizer: resizer, dashgrid: dashgrid, grid: grid });

    // Initialize.
    if (document.getElementById('dashgrid-shadow-box') === null) {
        var shadowBox = ShadowBox();
        dashgrid._element.appendChild(dashgrid._shadowBoxElement);
    }

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

},{"./box.js":1,"./drag.js":3,"./grid.js":4,"./mouse.js":7,"./renderer.js":8,"./resize.js":9,"./shims.js":10,"./utils.js":11}],3:[function(require,module,exports){
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

},{"./utils.js":11}],6:[function(require,module,exports){
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

},{"./utils.js":11}],7:[function(require,module,exports){
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

},{"./utils":11}],8:[function(require,module,exports){
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

},{"./utils.js":11}],9:[function(require,module,exports){
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
"use strict";

// shim layer with setTimeout fallback for requiestAnimationFrame
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        cb = cb || function () {};
        window.setTimeout(cb, 1000 / 60);
    };
}();

},{}],11:[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYm94LmpzIiwic3JjL2Rhc2hncmlkLmpzIiwic3JjL2RyYWcuanMiLCJzcmMvZ3JpZC5qcyIsInNyYy9ncmlkRW5naW5lLmpzIiwic3JjL2dyaWRWaWV3LmpzIiwic3JjL21vdXNlLmpzIiwic3JjL3JlbmRlcmVyLmpzIiwic3JjL3Jlc2l6ZS5qcyIsInNyYy9zaGltcy5qcyIsInNyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0FlOzs7Ozs7OztBQU9mLFNBQVMsR0FBVCxDQUFhLElBQWIsRUFBbUI7UUFDVixXQUFZLEtBQVo7Ozs7OztBQURVO0FBT2YsUUFBSSxZQUFZLFNBQVosU0FBWSxDQUFVLEdBQVYsRUFBZTtBQUMzQixlQUFPLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLFlBQVksR0FBWixFQUFpQixRQUFqQixDQUFuQixFQUQyQjtBQUUzQixZQUFJLElBQUksT0FBSixFQUFhO0FBQ2IsZ0JBQUksUUFBSixDQUFhLFdBQWIsQ0FBeUIsSUFBSSxPQUFKLENBQXpCLENBRGE7U0FBakI7O0FBSUEsaUJBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFtQyxJQUFJLFFBQUosQ0FBbkMsQ0FOMkI7S0FBZixDQVBEOztBQWdCZixXQUFPLE9BQU8sTUFBUCxDQUFjLEVBQUMsb0JBQUQsRUFBWSxnQ0FBWixFQUFkLENBQVAsQ0FoQmU7Q0FBbkI7Ozs7O0FBc0JBLFNBQVMsV0FBVCxDQUFxQixVQUFyQixFQUFpQyxRQUFqQyxFQUEyQztBQUN2QyxXQUFPO0FBQ0gsa0JBQVcsWUFBWTtBQUNuQixnQkFBSSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFMLENBRGU7QUFFbkIsZUFBRyxTQUFILEdBQWUsY0FBZixDQUZtQjtBQUduQixlQUFHLEtBQUgsQ0FBUyxRQUFULEdBQW9CLFVBQXBCLENBSG1CO0FBSW5CLGVBQUcsS0FBSCxDQUFTLE1BQVQs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QUFLQSxXQUFPLE1BQVAsQ0FSOEI7Q0FBM0I7Ozs7Ozs7OztBQWtCQSxTQUFTLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkIsSUFBM0IsRUFBaUMsV0FBakMsRUFBOEM7QUFDakQsUUFBSSxZQUFZLElBQVosSUFBb0IsT0FBTyxPQUFQLEtBQW9CLFdBQXBCLEVBQWlDLE9BQXpEO0FBQ0EsUUFBSSxRQUFRLGdCQUFSLEVBQTBCO0FBQzFCLGdCQUFRLGdCQUFSLENBQTBCLElBQTFCLEVBQWdDLFdBQWhDLEVBQTZDLEtBQTdDLEVBRDBCO0tBQTlCLE1BRU8sSUFBSSxRQUFRLFdBQVIsRUFBcUI7QUFDNUIsZ0JBQVEsV0FBUixDQUFxQixPQUFPLElBQVAsRUFBYSxXQUFsQyxFQUQ0QjtLQUF6QixNQUVBO0FBQ0gsZ0JBQVEsT0FBTyxJQUFQLENBQVIsR0FBdUIsV0FBdkIsQ0FERztLQUZBO0NBSko7Ozs7OztBQWVBLFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtBQUNqQyxXQUFPLFFBQVEsVUFBUixFQUFvQjtBQUFDLGdCQUFRLFdBQVIsQ0FBb0IsUUFBUSxVQUFSLENBQXBCLENBQUQ7S0FBM0I7Q0FERzs7Ozs7Ozs7QUFVQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUM7QUFDeEMsV0FBTyxLQUFLLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIsU0FBUyxTQUFTLElBQVQsRUFBZTtBQUNsRCxZQUFJLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsU0FBdEIsSUFBbUMsQ0FBQyxDQUFELEVBQUk7QUFBQyxtQkFBTyxJQUFQLENBQUQ7U0FBM0M7QUFDQSxlQUFPLEtBQUssVUFBTCxDQUYyQztLQUF0RDtBQUlBLFdBQU8sS0FBUCxDQUx3QztDQUFyQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBCb3g7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7fVxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gQm94KGNvbXApIHtcbiAgICBsZXQge2Rhc2hncmlkfSA9IGNvbXA7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgQm94IGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBib3guXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihib3gsIGJveFNldHRpbmdzKGJveCwgZGFzaGdyaWQpKTtcbiAgICAgICAgaWYgKGJveC5jb250ZW50KSB7XG4gICAgICAgICAgICBib3guX2VsZW1lbnQuYXBwZW5kQ2hpbGQoYm94LmNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGFzaGdyaWQuX2JveGVzRWxlbWVudC5hcHBlbmRDaGlsZChib3guX2VsZW1lbnQpO1xuICAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe2NyZWF0ZUJveCwgY3JlYXRlU2hhZG93Qm94fSk7XG59XG5cbi8qKlxuICogQm94IHByb3BlcnRpZXMgYW5kIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gYm94U2V0dGluZ3MoYm94RWxlbWVudCwgZGFzaGdyaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfZWxlbWVudDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveCc7XG4gICAgICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBlbC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uID0gZGFzaGdyaWQudHJhbnNpdGlvbjtcbiAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgICAgICBjcmVhdGVCb3hSZXNpemVIYW5kbGVycyhlbCwgZGFzaGdyaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0oKSksXG5cbiAgICAgICAgcm93OiBib3hFbGVtZW50LnJvdyxcbiAgICAgICAgY29sdW1uOiBib3hFbGVtZW50LmNvbHVtbixcbiAgICAgICAgcm93c3BhbjogYm94RWxlbWVudC5yb3dzcGFuIHx8IDEsXG4gICAgICAgIGNvbHVtbnNwYW46IGJveEVsZW1lbnQuY29sdW1uc3BhbiB8fCAxLFxuICAgICAgICBkcmFnZ2FibGU6IChib3hFbGVtZW50LmRyYWdnYWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IChib3hFbGVtZW50LnJlc2l6YWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBwdXNoYWJsZTogKGJveEVsZW1lbnQucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChib3hFbGVtZW50LmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChib3hFbGVtZW50LnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChib3hFbGVtZW50LnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgaW5oZXJpdDogKGJveEVsZW1lbnQuaW5oZXJpdCA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGJveCByZXNpemUgaGFuZGxlcnMgYW5kIGFwcGVuZHMgdGhlbSB0byBib3guXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJveFJlc2l6ZUhhbmRsZXJzKGJveEVsZW1lbnQsIGRhc2hncmlkKSB7XG4gICAgbGV0IGhhbmRsZTtcblxuICAgIC8qKlxuICAgICAqIFRPUCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ24nKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbic7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICduLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCT1RUT00gSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdzJykgIT09IC0xKSB7XG4gICAgICAgIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXMnO1xuICAgICAgICBoYW5kbGUuc3R5bGUubGVmdCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuYm90dG9tID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAncy1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV0VTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ3cnKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtdyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICd3LXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGUuaW5kZXhPZignZScpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1lJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICdlLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOT1JUSC1FQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGUuaW5kZXhPZignbmUnKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbmUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSBkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICduZS1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU09VVEgtRUFTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ3NlJykgIT09IC0xKSB7XG4gICAgICAgIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXNlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnc2UtcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNPVVRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdzdycpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnc3ctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5PUlRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdudycpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1udyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnbnctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCAnLi9zaGltcy5qcyc7XG5cbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZC5qcyc7XG5pbXBvcnQgQm94IGZyb20gXCIuL2JveC5qc1wiO1xuaW1wb3J0IFJlbmRlciBmcm9tICcuL3JlbmRlcmVyLmpzJztcbmltcG9ydCBNb3VzZSBmcm9tICcuL21vdXNlLmpzJztcbmltcG9ydCBEcmFnZ2VyIGZyb20gJy4vZHJhZy5qcyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL3Jlc2l6ZS5qcyc7XG5pbXBvcnQge2FkZEV2ZW50LCByZW1vdmVOb2Rlc30gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hncmlkO1xuXG4vKipcbiAqIFRoZSBET00gcmVwcmVzZW50YXRpb24gaXM6XG4gKiAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWRcIj5cbiAqICAgICAgICA8IS0tIEJveGVzIC0tPlxuICogICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ib3hlc1wiPlxuICogICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94XCI+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1lbGVtZW50XCI+PC9kaXY+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtblwiPjwvZGl2PlxuICogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLWVcIj48L2Rpdj5cbiAqICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS13XCI+PC9kaXY+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtc1wiPjwvZGl2PlxuICogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW5lXCI+PC9kaXY+XG4gKiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbndcIj48L2Rpdj5cbiAqICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zZVwiPjwvZGl2PlxuICogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXN3XCI+PC9kaXY+XG4gKiAgICAgICAgICAgIDwvZGl2PlxuICogICAgICAgIDwvZGl2PlxuICpcbiAqICAgICAgICA8IS0tIFNoYWRvdyBCb3ggLS0+XG4gKiAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLXNoYWRvdy1ib3hcIj48L2Rpdj5cbiAqXG4gKiAgICAgICAgPCEtLSBHcmlkIExpbmVzIC0tPlxuICogICAgICAgIDxkaXYgY2xhc3M9XCJkYXNoZ3JpZC1ncmlkLWxpbmVzXCI+PC9kaXY+XG4gKlxuICogICAgICAgIDwhLS0gR3JpZCBDZW50cm9pZHMgLS0+XG4gKiAgICAgICAgPGRpdiBjbGFzcz1cImRhc2hncmlkLWdyaWQtY2VudHJvaWRzXCI+PC9kaXY+XG4gKiAgICA8L2Rpdj5cbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IFRoZSBkYXNoZ3JpZCBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGdzIEdyaWQgc2V0dGluZ3MuXG4gKi9cbmZ1bmN0aW9uIERhc2hncmlkKGVsZW1lbnQsIGdzKSB7XG4gICAgbGV0IGRhc2hncmlkID0gT2JqZWN0LmFzc2lnbih7fSwgZGFzaGdyaWRTZXR0aW5ncyhncywgZWxlbWVudCkpO1xuXG4gICAgbGV0IHJlbmRlcmVyID0gUmVuZGVyKHtkYXNoZ3JpZH0pO1xuICAgIGxldCBib3ggPSBCb3goe2Rhc2hncmlkfSk7XG4gICAgbGV0IGdyaWQgPSBHcmlkKHtkYXNoZ3JpZCwgcmVuZGVyZXIsIGJveH0pO1xuICAgIGxldCBkcmFnZ2VyID0gRHJhZ2dlcih7ZGFzaGdyaWQsIHJlbmRlcmVyLCBncmlkfSk7XG4gICAgbGV0IHJlc2l6ZXIgPSBSZXNpemVyKHtkYXNoZ3JpZCwgcmVuZGVyZXIsIGdyaWR9KTtcbiAgICBsZXQgbW91c2UgPSBNb3VzZSh7ZHJhZ2dlciwgcmVzaXplciwgZGFzaGdyaWQsIGdyaWR9KTtcblxuICAgIC8vIEluaXRpYWxpemUuXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoZ3JpZC1zaGFkb3ctYm94JykgPT09IG51bGwpIHtcbiAgICAgICAgbGV0IHNoYWRvd0JveCA9IFNoYWRvd0JveCgpO1xuICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5hcHBlbmRDaGlsZChkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ3JpZC5pbml0KCk7XG4gICAgbW91c2UuaW5pdCgpO1xuXG4gICAgLy8gRXZlbnQgbGlzdGVuZXJzLlxuICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Um93SGVpZ2h0KCk7XG4gICAgICAgIGdyaWQucmVmcmVzaEdyaWQoKTtcbiAgICB9KTtcblxuICAgIC8vIFVzZXIgZXZlbnQgYWZ0ZXIgZ3JpZCBpcyBkb25lIGxvYWRpbmcuXG4gICAgaWYgKGRhc2hncmlkLm9uR3JpZFJlYWR5KSB7ZGFzaGdyaWQub25HcmlkUmVhZHkoKTt9IC8vIHVzZXIgZXZlbnQuXG5cbiAgICAvLyBBUEkuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICB1cGRhdGVCb3g6IGdyaWQudXBkYXRlQm94LFxuICAgICAgICBpbnNlcnRCb3g6IGdyaWQuaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3g6IGdyaWQucmVtb3ZlQm94LFxuICAgICAgICBnZXRCb3hlczogZ3JpZC5nZXRCb3hlcyxcbiAgICAgICAgcmVmcmVzaEdyaWQ6IGdyaWQucmVmcmVzaEdyaWQsXG4gICAgICAgIGRhc2hncmlkOiBkYXNoZ3JpZFxuICAgIH0pO1xufVxuXG4vKipcbiAqIEdyaWQgcHJvcGVydGllcyBhbmQgZXZlbnRzLlxuICovXG5mdW5jdGlvbiBkYXNoZ3JpZFNldHRpbmdzKGdzLCBlbGVtZW50KSB7XG4gICAgbGV0IGRhc2hncmlkID0ge1xuICAgICAgICBfZWxlbWVudDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzEwMDAnO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZXMoZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSgpKSxcblxuICAgICAgICBib3hlczogZ3MuYm94ZXMgfHwgW10sXG5cbiAgICAgICAgcm93SGVpZ2h0OiBncy5yb3dIZWlnaHQsXG4gICAgICAgIG51bVJvd3M6IChncy5udW1Sb3dzICE9PSB1bmRlZmluZWQpID8gZ3MubnVtUm93cyA6IDYsXG4gICAgICAgIG1pblJvd3M6IChncy5taW5Sb3dzICE9PSB1bmRlZmluZWQpID8gZ3MubWluUm93cyA6IDYsXG4gICAgICAgIG1heFJvd3M6IChncy5tYXhSb3dzICE9PSB1bmRlZmluZWQpID8gZ3MubWF4Um93cyA6IDEwLFxuXG4gICAgICAgIGV4dHJhUm93czogMCxcbiAgICAgICAgZXh0cmFDb2x1bW5zOiAwLFxuXG4gICAgICAgIGNvbHVtbldpZHRoOiBncy5jb2x1bW5XaWR0aCxcbiAgICAgICAgbnVtQ29sdW1uczogKGdzLm51bUNvbHVtbnMgIT09IHVuZGVmaW5lZCkgPyBncy5udW1Db2x1bW5zIDogNixcbiAgICAgICAgbWluQ29sdW1uczogKGdzLm1pbkNvbHVtbnMgIT09IHVuZGVmaW5lZCkgPyBncy5taW5Db2x1bW5zIDogNixcbiAgICAgICAgbWF4Q29sdW1uczogKGdzLm1heENvbHVtbnMgIT09IHVuZGVmaW5lZCkgPyBncy5tYXhDb2x1bW5zIDogMTAsXG5cbiAgICAgICAgeE1hcmdpbjogKGdzLnhNYXJnaW4gIT09IHVuZGVmaW5lZCkgPyBncy54TWFyZ2luIDogMjAsXG4gICAgICAgIHlNYXJnaW46IChncy55TWFyZ2luICE9PSB1bmRlZmluZWQpID8gZ3MueU1hcmdpbiA6IDIwLFxuXG4gICAgICAgIGRlZmF1bHRCb3hSb3dzcGFuOiAyLFxuICAgICAgICBkZWZhdWx0Qm94Q29sdW1uc3BhbjogMSxcblxuICAgICAgICBtaW5Sb3dzcGFuOiAoZ3MubWluUm93c3BhbiAhPT0gdW5kZWZpbmVkKSA/IGdzLm1pblJvd3NwYW4gOiAxLFxuICAgICAgICBtYXhSb3dzcGFuOiAoZ3MubWF4Um93c3BhbiAhPT0gdW5kZWZpbmVkKSA/IGdzLm1heFJvd3NwYW4gOiA5OTk5LFxuXG4gICAgICAgIG1pbkNvbHVtbnNwYW46IChncy5taW5Db2x1bW5zcGFuICE9PSB1bmRlZmluZWQpID8gZ3MubWluQ29sdW1uc3BhbiA6IDEsXG4gICAgICAgIG1heENvbHVtbnNwYW46IChncy5tYXhDb2x1bW5zcGFuICE9PSB1bmRlZmluZWQpID8gZ3MubWF4Q29sdW1uc3BhbiA6IDk5OTksXG5cbiAgICAgICAgcHVzaGFibGU6IChncy5wdXNoYWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBmbG9hdGluZzogKGdzLmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChncy5zdGFja2luZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIHN3YXBwaW5nOiAoZ3Muc3dhcHBpbmcgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBhbmltYXRlOiAoZ3MuYW5pbWF0ZSA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG5cbiAgICAgICAgbGl2ZUNoYW5nZXM6IChncy5saXZlQ2hhbmdlcyA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuXG4gICAgICAgIC8vIERyYWcgaGFuZGxlIGNhbiBiZSBhIGN1c3RvbSBjbGFzc25hbWUgb3IgaWYgbm90IHNldCByZXZlcnMgdG8gdGhlXG4gICAgICAgIC8vIGJveCBjb250YWluZXIgd2l0aCBjbGFzc25hbWUgJ2Rhc2hncmlkLWJveCcuXG4gICAgICAgIGRyYWdnYWJsZToge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IChncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmVuYWJsZWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoYW5kbGU6IChncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmhhbmRsZSkgfHwgJ2Rhc2hncmlkLWJveCcsXG5cbiAgICAgICAgICAgICAgICAvLyB1c2VyIGNiJ3MuXG4gICAgICAgICAgICAgICAgZHJhZ1N0YXJ0OiBncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmRyYWdTdGFydCxcbiAgICAgICAgICAgICAgICBkcmFnZ2luZzogZ3MuZHJhZ2dhYmxlICYmIGdzLmRyYWdnYWJsZS5kcmFnZ2luZyxcbiAgICAgICAgICAgICAgICBkcmFnRW5kOiBncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmRyYWdFbmRcbiAgICAgICAgfSxcblxuICAgICAgICByZXNpemFibGU6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IChncy5yZXNpemFibGUgJiYgZ3MucmVzaXphYmxlLmVuYWJsZWQgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGhhbmRsZTogKGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUuaGFuZGxlKSB8fCBbJ24nLCAnZScsICdzJywgJ3cnLCAnbmUnLCAnc2UnLCAnc3cnLCAnbncnXSxcbiAgICAgICAgICAgIGhhbmRsZVdpZHRoOiAoZ3MucmVzaXphYmxlICYmICBncy5yZXNpemFibGUuaGFuZGxlV2lkdGggIT09IHVuZGVmaW5lZCkgPyBncy5yZXNpemFibGUuaGFuZGxlV2lkdGggOiAxMCxcblxuICAgICAgICAgICAgLy8gdXNlciBjYidzLlxuICAgICAgICAgICAgcmVzaXplU3RhcnQ6IGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUucmVzaXplU3RhcnQsXG4gICAgICAgICAgICByZXNpemluZzogZ3MucmVzaXphYmxlICYmIGdzLnJlc2l6YWJsZS5yZXNpemluZyxcbiAgICAgICAgICAgIHJlc2l6ZUVuZDogZ3MucmVzaXphYmxlICYmIGdzLnJlc2l6YWJsZS5yZXNpemVFbmRcbiAgICAgICAgfSxcblxuICAgICAgICBvblVwZGF0ZTogKCkgPT4ge30sXG5cbiAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgLjNzLCBsZWZ0IC4zcywgdG9wIC4zcywgd2lkdGggLjNzLCBoZWlnaHQgLjNzJyxcbiAgICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDIwLFxuICAgICAgICBzY3JvbGxTcGVlZDogMTAsXG4gICAgICAgIHNuYXBCYWNrVGltZTogKGdzLnNuYXBCYWNrVGltZSA9PT0gdW5kZWZpbmVkKSA/IDMwMCA6IGdzLnNuYXBCYWNrVGltZSxcblxuICAgICAgICBzaG93R3JpZExpbmVzOiAoZ3Muc2hvd0dyaWRMaW5lcyA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBzaG93R3JpZENlbnRyb2lkczogKGdzLnNob3dHcmlkQ2VudHJvaWRzID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWVcbiAgICB9O1xuXG4gICAgZGFzaGdyaWQuX2JveGVzRWxlbWVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgYm94ZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBib3hlc0VsZW1lbnQuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveGVzJztcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LmFwcGVuZENoaWxkKGJveGVzRWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gYm94ZXNFbGVtZW50O1xuICAgICAgICB9KCkpO1xuXG4gICAgZGFzaGdyaWRcblxuICAgIHJldHVybiBkYXNoZ3JpZDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IERyYWdnZXI7XG5cbmZ1bmN0aW9uIERyYWdnZXIoY29tcCkge1xuICAgIGxldCB7ZGFzaGdyaWQsIHJlbmRlcmVyLCBncmlkfSA9IGNvbXA7XG5cbiAgICBsZXQgZVgsIGVZLCBlVywgZUgsXG4gICAgICAgIG1vdXNlWCA9IDAsXG4gICAgICAgIG1vdXNlWSA9IDAsXG4gICAgICAgIGxhc3RNb3VzZVggPSAwLFxuICAgICAgICBsYXN0TW91c2VZID0gMCxcbiAgICAgICAgbU9mZlggPSAwLFxuICAgICAgICBtT2ZmWSA9IDAsXG4gICAgICAgIG1pblRvcCA9IGRhc2hncmlkLnlNYXJnaW4sXG4gICAgICAgIG1pbkxlZnQgPSBkYXNoZ3JpZC54TWFyZ2luLFxuICAgICAgICBjdXJyU3RhdGUgPSB7fSxcbiAgICAgICAgcHJldlN0YXRlID0ge307XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgc2hhZG93Ym94LCByZW1vdmUgc21vb3RoIHRyYW5zaXRpb25zIGZvciBib3gsXG4gICAgICogYW5kIGluaXQgbW91c2UgdmFyaWFibGVzLiBGaW5hbGx5LCBtYWtlIGNhbGwgdG8gYXBpIHRvIGNoZWNrIGlmLFxuICAgICAqIGFueSBib3ggaXMgY2xvc2UgdG8gYm90dG9tIC8gcmlnaHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgZHJhZ1N0YXJ0ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuekluZGV4ID0gMTAwNDtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnJztcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUubGVmdCA9IGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0O1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS50b3AgPSBib3guX2VsZW1lbnQuc3R5bGUudG9wO1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS53aWR0aCA9IGJveC5fZWxlbWVudC5zdHlsZS53aWR0aDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYm94Ll9lbGVtZW50LnN0eWxlLmhlaWdodDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuXG4gICAgICAgIC8vIE1vdXNlIHZhbHVlcy5cbiAgICAgICAgbGFzdE1vdXNlWCA9IGUucGFnZVg7XG4gICAgICAgIGxhc3RNb3VzZVkgPSBlLnBhZ2VZO1xuICAgICAgICBlWCA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICAgIGVZID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50Lm9mZnNldFRvcCwgMTApO1xuICAgICAgICBlVyA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCwgMTApO1xuICAgICAgICBlSCA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5vZmZzZXRIZWlnaHQsIDEwKTtcblxuICAgICAgICBncmlkLnVwZGF0ZVN0YXJ0KGJveCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLmRyYWdnYWJsZS5kcmFnU3RhcnQpIHtkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ1N0YXJ0KCk7fSAvLyB1c2VyIGV2ZW50LlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCBkcmFnID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICB1cGRhdGVNb3ZpbmdFbGVtZW50KGJveCwgZSk7XG4gICAgICAgIGdyaWQudXBkYXRpbmcoYm94KTtcblxuICAgICAgICBpZiAoZGFzaGdyaWQubGl2ZUNoYW5nZXMpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoIGNlbGwgdG8gc25hcCBwcmV2aWV3IGJveCB0by5cbiAgICAgICAgICAgIGN1cnJTdGF0ZSA9IHJlbmRlcmVyLmdldENsb3Nlc3RDZWxscyh7XG4gICAgICAgICAgICAgICAgbGVmdDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0ICsgYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgIHRvcDogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICBib3R0b206IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgKyBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vdmVCb3goYm94LCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ2dpbmcpIHtkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ2dpbmcoKTt9IC8vIHVzZXIgZXZlbnQuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IGRyYWdFbmQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGlmICghZGFzaGdyaWQubGl2ZUNoYW5nZXMpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoIGNlbGwgdG8gc25hcCBwcmV2aWV3IGJveCB0by5cbiAgICAgICAgICAgIGN1cnJTdGF0ZSA9IHJlbmRlcmVyLmdldENsb3Nlc3RDZWxscyh7XG4gICAgICAgICAgICAgICAgbGVmdDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0ICsgYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgIHRvcDogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICBib3R0b206IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgKyBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vdmVCb3goYm94LCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBib3ggc3R5bGUuXG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gZGFzaGdyaWQudHJhbnNpdGlvbjtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLmxlZnQgPSBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5sZWZ0O1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUudG9wO1xuXG4gICAgICAgIC8vIEdpdmUgdGltZSBmb3IgcHJldmlld2JveCB0byBzbmFwIGJhY2sgdG8gdGlsZS5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBncmlkLnVwZGF0ZUVuZCgpO1xuICAgICAgICB9LCBkYXNoZ3JpZC5zbmFwQmFja1RpbWUpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ0VuZCkge2Rhc2hncmlkLmRyYWdnYWJsZS5kcmFnRW5kKCk7fSAvLyB1c2VyIGV2ZW50LlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCBtb3ZlQm94ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAoY3VyclN0YXRlLnJvdyAhPT0gcHJldlN0YXRlLnJvdyB8fFxuICAgICAgICAgICAgY3VyclN0YXRlLmNvbHVtbiAhPT0gcHJldlN0YXRlLmNvbHVtbikge1xuXG4gICAgICAgICAgICBsZXQgcHJldlNjcm9sbEhlaWdodCA9IGRhc2hncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIGxldCBwcmV2U2Nyb2xsV2lkdGggPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgICAgICBsZXQgdmFsaWRNb3ZlID0gZ3JpZC51cGRhdGVCb3goYm94LCBjdXJyU3RhdGUsIGJveCk7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZUdyaWREaW1lbnNpb24gcHJldmlldyBib3guXG4gICAgICAgICAgICBpZiAodmFsaWRNb3ZlKSB7XG5cbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WVBvc2l0aW9uKGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBjdXJyU3RhdGUucm93KTtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WFBvc2l0aW9uKGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBjdXJyU3RhdGUuY29sdW1uKTtcblxuICAgICAgICAgICAgICAgIGxldCBwb3N0U2Nyb2xsSGVpZ2h0ID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICAgIGxldCBwb3N0U2Nyb2xsV2lkdGggPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gQWNjb3VudCBmb3IgbWluaW1pemluZyBzY3JvbGwgaGVpZ2h0IHdoZW4gbW92aW5nIGJveCB1cHdhcmRzLlxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBidWcgaGFwcGVucyB3aGVyZSB0aGUgZHJhZ2dlZCBib3ggaXMgY2hhbmdlZCBidXQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAvLyBhZnRlcndhcmRzIHRoZSBkYXNoZ3JpZCBlbGVtZW50IGRpbWVuc2lvbiBpcyBjaGFuZ2VkLlxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB3aW5kb3cuc2Nyb2xsWSkgPCAzMCAmJlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsWSA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgcHJldlNjcm9sbEhlaWdodCAhPT0gcG9zdFNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gYm94Ll9lbGVtZW50Lm9mZnNldFRvcCAtIDEwMCAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpbmRvdy5pbm5lcldpZHRoIC0gd2luZG93LnNjcm9sbFgpIDwgMzAgJiZcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIHByZXZTY3JvbGxXaWR0aCAhPT0gcG9zdFNjcm9sbFdpZHRoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLmxlZnQgPSBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCAtIDEwMCAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgbW92ZSBpZiBub3Qgc3dpdGNoZWQgdG8gbmV3IGNlbGwuXG4gICAgICAgIHByZXZTdGF0ZSA9IHtyb3c6IGN1cnJTdGF0ZS5yb3csIGNvbHVtbjogY3VyclN0YXRlLmNvbHVtbn07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtb3ZpbmcgZWxlbWVudCxcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlTW92aW5nRWxlbWVudCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgbGV0IG1heExlZnQgPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIGRhc2hncmlkLnhNYXJnaW47XG4gICAgICAgIGxldCBtYXhUb3AgPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBkYXNoZ3JpZC55TWFyZ2luO1xuXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBtb3VzZSBwb3NpdGlvbi5cbiAgICAgICAgbW91c2VYID0gZS5wYWdlWDtcbiAgICAgICAgbW91c2VZID0gZS5wYWdlWTtcblxuICAgICAgICAvLyBHZXQgdGhlIGRlbHRhc1xuICAgICAgICBsZXQgZGlmZlggPSBtb3VzZVggLSBsYXN0TW91c2VYICsgbU9mZlg7XG4gICAgICAgIGxldCBkaWZmWSA9IG1vdXNlWSAtIGxhc3RNb3VzZVkgKyBtT2ZmWTtcblxuICAgICAgICBtT2ZmWCA9IDA7XG4gICAgICAgIG1PZmZZID0gMDtcblxuICAgICAgICAvLyBVcGRhdGUgbGFzdCBwcm9jZXNzZWQgbW91c2UgcG9zaXRpb25zLlxuICAgICAgICBsYXN0TW91c2VYID0gbW91c2VYO1xuICAgICAgICBsYXN0TW91c2VZID0gbW91c2VZO1xuXG4gICAgICAgIGxldCBkWCA9IGRpZmZYO1xuICAgICAgICBsZXQgZFkgPSBkaWZmWTtcbiAgICAgICAgaWYgKGVYICsgZFggPCBtaW5MZWZ0KSB7XG4gICAgICAgICAgICBkaWZmWCA9IG1pbkxlZnQgLSBlWDtcbiAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgfSBlbHNlIGlmIChlWCArIGVXICsgZFggPiBtYXhMZWZ0KSB7XG4gICAgICAgICAgICBkaWZmWCA9IG1heExlZnQgLSBlWCAtIGVXO1xuICAgICAgICAgICAgbU9mZlggPSBkWCAtIGRpZmZYO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVZICsgZFkgPCBtaW5Ub3ApIHtcbiAgICAgICAgICAgIGRpZmZZID0gbWluVG9wIC0gZVk7XG4gICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgIH0gZWxzZSBpZiAoZVkgKyBlSCArIGRZID4gbWF4VG9wKSB7XG4gICAgICAgICAgICBkaWZmWSA9IG1heFRvcCAtIGVZIC0gZUg7XG4gICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgIH1cbiAgICAgICAgZVggKz0gZGlmZlg7XG4gICAgICAgIGVZICs9IGRpZmZZO1xuXG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50b3AgPSBlWSArICdweCc7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gZVggKyAncHgnO1xuXG4gICAgICAgIC8vIFNjcm9sbGluZyB3aGVuIGNsb3NlIHRvIGJvdHRvbSBib3VuZGFyeS5cbiAgICAgICAgaWYgKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC0gZGFzaGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmlubmVySGVpZ2h0IC0gKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2Nyb2xsaW5nIHdoZW4gY2xvc2UgdG8gcmlnaHQgYm91bmRhcnkuXG4gICAgICAgIGlmIChlLnBhZ2VYIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCAtIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lcldpZHRoIC0gKGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpIDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgZHJhZ1N0YXJ0LFxuICAgICAgICBkcmFnLFxuICAgICAgICBkcmFnRW5kXG4gICAgfSk7XG59XG4iLCJpbXBvcnQgR3JpZFZpZXcgZnJvbSAnLi9ncmlkVmlldy5qcyc7XG5pbXBvcnQgR3JpZEVuZ2luZSBmcm9tICcuL2dyaWRFbmdpbmUuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBHcmlkO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGFzaGdyaWRcbiAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJlclxuICogQHBhcmFtIHtPYmplY3R9IGJveEhhbmRsZXJcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gaW5pdCBJbml0aWFsaXplIEdyaWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZUJveCBBUEkgZm9yIHVwZGF0aW5nIGJveCwgbW92aW5nIC8gcmVzaXppbmcuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGluc2VydEJveCBJbnNlcnQgYSBuZXcgYm94LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSByZW1vdmVCb3ggUmVtb3ZlIGEgYm94LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBnZXRCb3ggUmV0dXJuIGJveCBvYmplY3QgZ2l2ZW4gRE9NIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZVN0YXJ0IFdoZW4gZHJhZyAvIHJlc2l6ZSBzdGFydHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0aW5nIER1cmluZyBkcmFnZ2luZyAvIHJlc2l6aW5nLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSB1cGRhdGVFbmQgQWZ0ZXIgZHJhZyAvIHJlc2l6ZSBlbmRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSByZW5kZXJHcmlkIFVwZGF0ZSBncmlkIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIEdyaWQob2JqKSB7XG4gICAgbGV0IHtkYXNoZ3JpZCwgcmVuZGVyZXIsIGJveEhhbmRsZXJ9ID0gb2JqO1xuXG4gICAgbGV0IGdyaWRWaWV3ID0gR3JpZFZpZXcoe2Rhc2hncmlkLCByZW5kZXJlcn0pO1xuICAgIGxldCBncmlkRW5naW5lID0gR3JpZEVuZ2luZSh7ZGFzaGdyaWQsIGJveEhhbmRsZXJ9KTtcblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZXMgdGhlIG5lY2Vzc2FyeSBib3ggZWxlbWVudHMgYW5kIGNoZWNrcyB0aGF0IHRoZSBib3hlcyBpbnB1dCBpc1xuICAgICAqIGNvcnJlY3QuXG4gICAgICogMS4gQ3JlYXRlIGJveCBlbGVtZW50cy5cbiAgICAgKiAyLiBVcGRhdGUgdGhlIGRhc2hncmlkIHNpbmNlIG5ld2x5IGNyZWF0ZWQgYm94ZXMgbWF5IGxpZSBvdXRzaWRlIHRoZVxuICAgICAqICAgIGluaXRpYWwgZGFzaGdyaWQgc3RhdGUuXG4gICAgICogMy4gUmVuZGVyIHRoZSBkYXNoZ3JpZC5cbiAgICAgKi9cbiAgICBsZXQgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBib3ggZWxlbWVudHMgYW5kIHVwZGF0ZSBudW1iZXIgb2Ygcm93cyAvIGNvbHVtbnMuXG4gICAgICAgIGdyaWRFbmdpbmUuaW5pdCgpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgR3JpZCBWaWV3LlxuICAgICAgICBncmlkVmlldy5pbml0KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1cGRhdGVUb1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBleGNsdWRlQm94IE9wdGlvbmFsIHBhcmFtZXRlciwgaWYgdXBkYXRlQm94IGlzIHRyaWdnZXJlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IGRyYWcgLyByZXNpemUgZXZlbnQsIHRoZW4gZG9uJ3QgdXBkYXRlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElmIHVwZGF0ZSBzdWNjZWVkZWQuXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZUJveCA9IGZ1bmN0aW9uIChib3gsIHVwZGF0ZVRvLCBleGNsdWRlQm94KSB7XG4gICAgICAgIGxldCBtb3ZlZEJveGVzID0gZ3JpZEVuZ2luZS51cGRhdGVCb3goYm94LCB1cGRhdGVUbyk7XG5cbiAgICAgICAgaWYgKG1vdmVkQm94ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ3JpZFZpZXcucmVuZGVyQm94KG1vdmVkQm94ZXMsIGV4Y2x1ZGVCb3gpO1xuICAgICAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGJveC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHJlbW92ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgZ3JpZEVuZ2luZS5yZW1vdmVCb3goYm94KTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemVzIGEgYm94LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplQm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAvLyBJbiBjYXNlIGJveCBpcyBub3QgdXBkYXRlZCBieSBkcmFnZ2luZyAvIHJlc2l6aW5nLlxuICAgICAgICBncmlkVmlldy5yZW5kZXJCb3gobW92ZWRCb3hlcyk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gZWl0aGVyIHJlc2l6ZSBvciBkcmFnIHN0YXJ0cy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHVwZGF0ZVN0YXJ0ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBncmlkRW5naW5lLmluY3JlYXNlTnVtUm93cyhib3gsIDEpO1xuICAgICAgICBncmlkRW5naW5lLmluY3JlYXNlTnVtQ29sdW1ucyhib3gsIDEpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdoZW4gZHJhZ2dpbmcgLyByZXNpemluZyBpcyBkcm9wcGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRpbmcgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIC8vIGdyaWRFbmdpbmUuaW5jcmVhc2VOdW1Sb3dzKGJveCwgMSk7XG4gICAgICAgIC8vIGdyaWRFbmdpbmUuaW5jcmVhc2VOdW1Db2x1bW5zKGJveCwgMSk7XG4gICAgICAgIC8vIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBkcmFnZ2luZyAvIHJlc2l6aW5nIGlzIGRyb3BwZWQuXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZUVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ3JpZEVuZ2luZS5kZWNyZWFzZU51bVJvd3MoKTtcbiAgICAgICAgZ3JpZEVuZ2luZS5kZWNyZWFzZU51bUNvbHVtbnMoKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICBsZXQgcmVmcmVzaEdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckJveChkYXNoZ3JpZC5ib3hlcyk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0OiBpbml0LFxuICAgICAgICB1cGRhdGVCb3g6IHVwZGF0ZUJveCxcbiAgICAgICAgaW5zZXJ0Qm94OiBncmlkRW5naW5lLmluc2VydEJveCxcbiAgICAgICAgcmVtb3ZlQm94OiBncmlkRW5naW5lLnJlbW92ZUJveCxcbiAgICAgICAgZ2V0Qm94OiBncmlkRW5naW5lLmdldEJveCxcbiAgICAgICAgdXBkYXRlU3RhcnQ6IHVwZGF0ZVN0YXJ0LFxuICAgICAgICB1cGRhdGluZzogdXBkYXRpbmcsXG4gICAgICAgIHVwZGF0ZUVuZDogdXBkYXRlRW5kLFxuICAgICAgICByZWZyZXNoR3JpZDogcmVmcmVzaEdyaWRcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7cmVtb3ZlTm9kZXMsIGluc2VydGlvblNvcnQsIGdldE1heE51bX0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IEdyaWRFbmdpbmU7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBIYW5kbGVzIGNvbGxpc2lvbiBsb2dpYyBhbmQgZGFzaGdyaWQgZGltZW5zaW9uLlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5mdW5jdGlvbiBHcmlkRW5naW5lKG9iaikge1xuICAgIGxldCB7ZGFzaGdyaWQsIGJveEhhbmRsZXJ9ID0gb2JqO1xuICAgIGxldCBib3hlcywgbW92aW5nQm94LCBtb3ZlZEJveGVzO1xuXG4gICAgbGV0IGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNyZWF0ZUJveEVsZW1lbnRzKCk7XG4gICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuICAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGJveCBlbGVtZW50cy5cbiAgICAgKi9cbiAgICBsZXQgY3JlYXRlQm94RWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXNoZ3JpZC5ib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgYm94SGFuZGxlci5jcmVhdGVCb3goZGFzaGdyaWQuYm94ZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGJveGVzID0gZGFzaGdyaWQuYm94ZXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHJpZXZlIGNvcnJlc3BvbmRpbmcganMgb2JqZWN0IGZyb20gYm94ZXMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgRE9NIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge09iamVjdH0gYm94IEdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHVybiBjb3JyZXNwb25kaW5nIGJveCBvYmplY3QuXG4gICAgICovXG4gICAgbGV0IGdldEJveCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGJveGVzW2ldLl9lbGVtZW50ID09PSBlbGVtZW50KSB7cmV0dXJuIGJveGVzW2ldfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb3B5IGJveCBwb3NpdGlvbnMuXG4gICAgICogQHJldHVybnMge0FycmF5LjxPYmplY3Q+fSBQcmV2aW91cyBib3ggcG9zaXRpb25zLlxuICAgICAqL1xuICAgIGxldCBjb3B5Qm94ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBwcmV2UG9zaXRpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm94ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHByZXZQb3NpdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93OiBib3hlc1tpXS5yb3csXG4gICAgICAgICAgICAgICAgY29sdW1uOiBib3hlc1tpXS5jb2x1bW4sXG4gICAgICAgICAgICAgICAgY29sdW1uc3BhbjogYm94ZXNbaV0uY29sdW1uc3BhbixcbiAgICAgICAgICAgICAgICByb3dzcGFuOiBib3hlc1tpXS5yb3dzcGFuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcHJldlBvc2l0aW9ucztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZSBPbGQgcG9zaXRpb25zLlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IFByZXZpb3VzIHBvc2l0aW9ucy5cbiAgICAgKi9cbiAgICBsZXQgcmVzdG9yZU9sZFBvc2l0aW9ucyA9IGZ1bmN0aW9uIChwcmV2UG9zaXRpb25zKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm94ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJveGVzW2ldLnJvdyA9IHByZXZQb3NpdGlvbnNbaV0ucm93LFxuICAgICAgICAgICAgYm94ZXNbaV0uY29sdW1uID0gcHJldlBvc2l0aW9uc1tpXS5jb2x1bW4sXG4gICAgICAgICAgICBib3hlc1tpXS5jb2x1bW5zcGFuID0gcHJldlBvc2l0aW9uc1tpXS5jb2x1bW5zcGFuLFxuICAgICAgICAgICAgYm94ZXNbaV0ucm93c3BhbiA9IHByZXZQb3NpdGlvbnNbaV0ucm93c3BhblxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBib3ggZ2l2ZW4gaXRzIGluZGV4IGluIHRoZSBib3hlcyBhcnJheS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm94SW5kZXguXG4gICAgICovXG4gICAgbGV0IHJlbW92ZUJveCA9IGZ1bmN0aW9uIChib3hJbmRleCkge1xuICAgICAgICBsZXQgZWxlbSA9IGJveGVzW2JveEluZGV4XS5fZWxlbWVudDtcbiAgICAgICAgZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW0pO1xuICAgICAgICBib3hlcy5zcGxpY2UoYm94SW5kZXgsIDEpO1xuXG4gICAgICAgIC8vIEluIGNhc2UgZmxvYXRpbmcgaXMgb24uXG4gICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBib3guIEJveCBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgdGhlIHNpemUgYW5kIHBvc2l0aW9uIG9mIHRoZSBib3gsXG4gICAgICogY29udGVudCBlbGVtZW50IGlzIG9wdGlvbmFsLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3ggQm94IGRpbWVuc2lvbnMuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElmIGluc2VydCB3YXMgcG9zc2libGUuXG4gICAgICovXG4gICAgbGV0IGluc2VydEJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgbW92aW5nQm94ID0gYm94O1xuXG4gICAgICAgIGlmIChib3gucm93cyA9PT0gdW5kZWZpbmVkICYmIGJveC5jb2x1bW4gPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgYm94LnJvd3NwYW4gPT09IHVuZGVmaW5lZCAmJiBib3guY29sdW1uc3BhbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVXBkYXRlVmFsaWQoYm94KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHByZXZQb3NpdGlvbnMgPSBjb3B5Qm94ZXMoKTtcblxuICAgICAgICBsZXQgbW92ZWRCb3hlcyA9IFtib3hdO1xuICAgICAgICBsZXQgdmFsaWRNb3ZlID0gbW92ZUJveChib3gsIGJveCwgbW92ZWRCb3hlcyk7XG4gICAgICAgIG1vdmluZ0JveCA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICBib3hIYW5kbGVyLmNyZWF0ZUJveChib3gpO1xuICAgICAgICAgICAgYm94ZXMucHVzaChib3gpO1xuXG4gICAgICAgICAgICB1cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG4gICAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdG9yZU9sZFBvc2l0aW9ucyhwcmV2UG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgYSBwb3NpdGlvbiBvciBzaXplIG9mIGJveC5cbiAgICAgKlxuICAgICAqIFdvcmtzIGluIHBvc3RlcmlvciBmYXNoaW9uLCBha2luIHRvIGFzayBmb3IgZm9yZ2l2ZW5lc3MgcmF0aGVyIHRoYW4gZm9yXG4gICAgICogcGVybWlzc2lvbi5cbiAgICAgKiBMb2dpYzpcbiAgICAgKlxuICAgICAqIDEuIElzIHVwZGF0ZVRvIGEgdmFsaWQgc3RhdGU/XG4gICAgICogICAgMS4xIE5vOiBSZXR1cm4gZmFsc2UuXG4gICAgICogMi4gU2F2ZSBwb3NpdGlvbnMuXG4gICAgICogMy4gTW92ZSBib3guXG4gICAgICogICAgICAzLjEuIElzIGJveCBvdXRzaWRlIGJvcmRlcj9cbiAgICAgKiAgICAgICAgICAzLjEuMS4gWWVzOiBDYW4gYm9yZGVyIGJlIHB1c2hlZD9cbiAgICAgKiAgICAgICAgICAgICAgMy4xLjEuMS4gWWVzOiBFeHBhbmQgYm9yZGVyLlxuICAgICAqICAgICAgICAgICAgICAzLjEuMS4yLiBObzogUmV0dXJuIGZhbHNlLlxuICAgICAqICAgICAgMy4yLiBEb2VzIGJveCBjb2xsaWRlP1xuICAgICAqICAgICAgICAgIDMuMi4xLiBZZXM6IENhbGN1bGF0ZSBuZXcgYm94IHBvc2l0aW9uIGFuZFxuICAgICAqICAgICAgICAgICAgICAgICBnbyBiYWNrIHRvIHN0ZXAgMSB3aXRoIHRoZSBuZXcgY29sbGlkZWQgYm94LlxuICAgICAqICAgICAgICAgIDMuMi4yLiBObzogUmV0dXJuIHRydWUuXG4gICAgICogNC4gSXMgbW92ZSB2YWxpZD9cbiAgICAgKiAgICA0LjEuIFllczogVXBkYXRlIG51bWJlciByb3dzIC8gY29sdW1ucy5cbiAgICAgKiAgICA0LjIuIE5vOiBSZXZlcnQgdG8gb2xkIHBvc2l0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3ggVGhlIGJveCBiZWluZyB1cGRhdGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1cGRhdGVUbyBUaGUgbmV3IHN0YXRlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn0gbW92ZWRCb3hlc1xuICAgICAqL1xuICAgIGxldCB1cGRhdGVCb3ggPSBmdW5jdGlvbiAoYm94LCB1cGRhdGVUbykge1xuICAgICAgICBtb3ZpbmdCb3ggPSBib3g7XG5cbiAgICAgICAgbGV0IHByZXZQb3NpdGlvbnMgPSBjb3B5Qm94ZXMoKVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYm94LCB1cGRhdGVUbyk7XG4gICAgICAgIGlmICghaXNVcGRhdGVWYWxpZChib3gpKSB7XG4gICAgICAgICAgICByZXN0b3JlT2xkUG9zaXRpb25zKHByZXZQb3NpdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1vdmVkQm94ZXMgPSBbYm94XTtcbiAgICAgICAgbGV0IHZhbGlkTW92ZSA9IG1vdmVCb3goYm94LCBib3gsIG1vdmVkQm94ZXMpO1xuXG4gICAgICAgIGlmICh2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1vdmVkQm94ZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXN0b3JlT2xkUG9zaXRpb25zKHByZXZQb3NpdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGFuZCBoYW5kbGVzIGNvbGxpc2lvbnMgd2l0aCB3YWxsIGFuZCBib3hlcy5cbiAgICAgKiBXb3JrcyBhcyBhIHRyZWUsIHByb3BhZ2F0aW5nIG1vdmVzIGRvd24gdGhlIGNvbGxpc2lvbiB0cmVlIGFuZCByZXR1cm5zXG4gICAgICogICAgIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIGlmIHRoZSBib3ggaW5mcm9udCBpcyBhYmxlIHRvIG1vdmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4Y2x1ZGVCb3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBtb3ZlIGlzIHBvc3NpYmxlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgbGV0IG1vdmVCb3ggPSBmdW5jdGlvbiAoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIGlmIChpc0JveE91dHNpZGVCb3VuZGFyeShib3gpKSB7cmV0dXJuIGZhbHNlO31cblxuICAgICAgICBsZXQgaW50ZXJzZWN0ZWRCb3hlcyA9IGdldEludGVyc2VjdGVkQm94ZXMoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKTtcblxuICAgICAgICAvLyBIYW5kbGUgYm94IENvbGxpc2lvbiwgcmVjdXJzaXZlIG1vZGVsLlxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW50ZXJzZWN0ZWRCb3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKCFjb2xsaXNpb25IYW5kbGVyKGJveCwgaW50ZXJzZWN0ZWRCb3hlc1tpXSwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJvcGFnYXRlcyBib3ggY29sbGlzaW9ucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG1vdmVkQm94ZXNcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiBtb3ZlIGlzIGFsbG93ZWRcbiAgICAgKi9cbiAgICBsZXQgY29sbGlzaW9uSGFuZGxlciA9IGZ1bmN0aW9uIChib3gsIGJveEIsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpIHtcbiAgICAgICAgc2V0Qm94UG9zaXRpb24oYm94LCBib3hCKVxuICAgICAgICByZXR1cm4gbW92ZUJveChib3hCLCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBuZXcgYm94IHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBib3ggdGhhdCBwdXNoZWQgaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBCb3ggd2hpY2ggaGFzIG1vdmVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCIEJveCB3aGljaCBpcyB0byBiZSBtb3ZlZC5cbiAgICAgKi9cbiAgICBsZXQgc2V0Qm94UG9zaXRpb24gPSBmdW5jdGlvbiAoYm94LCBib3hCKSB7XG4gICAgICAgIGJveEIucm93ICs9IGJveC5yb3cgKyBib3gucm93c3BhbiAtIGJveEIucm93O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGJveCwgZmluZHMgb3RoZXIgYm94ZXMgd2hpY2ggaW50ZXJzZWN0IHdpdGggaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4Y2x1ZGVCb3ggQXJyYXkgb2YgYm94ZXMuXG4gICAgICovXG4gICAgbGV0IGdldEludGVyc2VjdGVkQm94ZXMgPSBmdW5jdGlvbiAoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIGxldCBpbnRlcnNlY3RlZEJveGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgLy8gRG9uJ3QgY2hlY2sgbW92aW5nIGJveCBhbmQgdGhlIGJveCBpdHNlbGYuXG4gICAgICAgICAgICBpZiAoYm94ICE9PSBib3hlc1tpXSAmJiBib3hlc1tpXSAhPT0gZXhjbHVkZUJveCkge1xuICAgICAgICAgICAgICAgIGlmIChkb0JveGVzSW50ZXJzZWN0KGJveCwgYm94ZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkQm94ZXMucHVzaChib3hlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdGVkQm94ZXMucHVzaChib3hlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluc2VydGlvblNvcnQoaW50ZXJzZWN0ZWRCb3hlcywgJ3JvdycpO1xuXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3RlZEJveGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciAyIGJveGVzIGludGVyc2VjdCB1c2luZyBib3VuZGluZyBib3ggbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hBXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuIFRydWUgaWYgaW50ZXJzZWN0IGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGRvQm94ZXNJbnRlcnNlY3QgPSBmdW5jdGlvbiAoYm94LCBib3hCKSB7XG4gICAgICAgIHJldHVybiAoYm94LmNvbHVtbiA8IGJveEIuY29sdW1uICsgYm94Qi5jb2x1bW5zcGFuICYmXG4gICAgICAgICAgICAgICAgYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuID4gYm94Qi5jb2x1bW4gJiZcbiAgICAgICAgICAgICAgICBib3gucm93IDwgYm94Qi5yb3cgKyBib3hCLnJvd3NwYW4gJiZcbiAgICAgICAgICAgICAgICBib3gucm93c3BhbiArIGJveC5yb3cgPiBib3hCLnJvdyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIG51bWJlciBvZiBjb2x1bW5zLlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVOdW1Db2x1bW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWF4Q29sdW1uID0gZ2V0TWF4TnVtKGJveGVzLCAnY29sdW1uJywgJ2NvbHVtbnNwYW4nKTtcblxuICAgICAgICBpZiAobWF4Q29sdW1uID49IGRhc2hncmlkLm1pbkNvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPSBtYXhDb2x1bW47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1vdmluZ0JveCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLm51bUNvbHVtbnMgLSBtb3ZpbmdCb3guY29sdW1uIC0gbW92aW5nQm94LmNvbHVtbnNwYW4gPT09IDAgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPCBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZGFzaGdyaWQubnVtQ29sdW1ucyAtIG1vdmluZ0JveC5jb2x1bW4tIG1vdmluZ0JveC5jb2x1bW5zcGFuID4gMSAmJlxuICAgICAgICAgICAgbW92aW5nQm94LmNvbHVtbiArIG1vdmluZ0JveC5jb2x1bW5zcGFuID09PSBtYXhDb2x1bW4gJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPiBkYXNoZ3JpZC5taW5Db2x1bW5zICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zIDwgZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA9IG1heENvbHVtbiArIDE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5jcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIGlmIGJveCB0b3VjaGVzIGJvdHRvbSBvZiB3YWxsLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtQ29sdW1uc1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluY3JlYXNlIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGluY3JlYXNlTnVtQ29sdW1ucyA9IGZ1bmN0aW9uIChib3gsIG51bUNvbHVtbnMpIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZW4gdG8gYWRkIGV4dHJhIHJvdyB0byBiZSBhYmxlIHRvIG1vdmUgZG93bjpcbiAgICAgICAgLy8gMS4gQW55dGltZSBkcmFnZ2luZyBzdGFydHMuXG4gICAgICAgIC8vIDIuIFdoZW4gZHJhZ2dpbmcgc3RhcnRzIGFuZCBtb3ZpbmcgYm94IGlzIGNsb3NlIHRvIGJvdHRvbSBib3JkZXIuXG4gICAgICAgIGlmICgoYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuKSA9PT0gZGFzaGdyaWQubnVtQ29sdW1ucyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA8IGRhc2hncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgKz0gMTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNyZWFzZXMgbnVtYmVyIG9mIGRhc2hncmlkLm51bVJvd3MgdG8gZnVydGhlc3QgbGVmdHdhcmQgYm94LlxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkZWNyZWFzZU51bUNvbHVtbnMgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICBsZXQgbWF4Q29sdW1uTnVtID0gMDtcblxuICAgICAgICBib3hlcy5mb3JFYWNoKGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCAoYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuKSkge1xuICAgICAgICAgICAgICAgIG1heENvbHVtbk51bSA9IGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1heENvbHVtbk51bSA8IGRhc2hncmlkLm51bUNvbHVtbnMpIHtkYXNoZ3JpZC5udW1Db2x1bW5zID0gbWF4Q29sdW1uTnVtO31cbiAgICAgICAgaWYgKG1heENvbHVtbk51bSA8IGRhc2hncmlkLm1pbkNvbHVtbnMpIHtkYXNoZ3JpZC5udW1Db2x1bW5zID0gZGFzaGdyaWQubWluQ29sdW1uczt9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciByb3dzIGRlcGVuZHMgb24gdGhyZWUgdGhpbmdzLlxuICAgICAqIDx1bD5cbiAgICAgKiAgICAgPGxpPk1pbiAvIE1heCBSb3dzLjwvbGk+XG4gICAgICogICAgIDxsaT5NYXggQm94LjwvbGk+XG4gICAgICogICAgIDxsaT5EcmFnZ2luZyBib3ggbmVhciBib3R0b20gYm9yZGVyLjwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVOdW1Sb3dzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWF4Um93ID0gZ2V0TWF4TnVtKGJveGVzLCAncm93JywgJ3Jvd3NwYW4nKTtcblxuICAgICAgICBpZiAobWF4Um93ID49IGRhc2hncmlkLm1pblJvd3MpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPSBtYXhSb3c7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1vdmluZ0JveCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW92aW5nIGJveCB3aGVuIGNsb3NlIHRvIGJvcmRlci5cbiAgICAgICAgaWYgKGRhc2hncmlkLm51bVJvd3MgLSBtb3ZpbmdCb3gucm93IC0gbW92aW5nQm94LnJvd3NwYW4gPT09IDAgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPCBkYXNoZ3JpZC5tYXhSb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZGFzaGdyaWQubnVtUm93cyAtIG1vdmluZ0JveC5yb3cgLSBtb3ZpbmdCb3gucm93c3BhbiA+IDEgJiZcbiAgICAgICAgICAgIG1vdmluZ0JveC5yb3cgKyBtb3ZpbmdCb3gucm93c3BhbiA9PT0gbWF4Um93ICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzID4gZGFzaGdyaWQubWluUm93cyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA8IGRhc2hncmlkLm1heFJvd3MpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPSBtYXhSb3cgKyAxO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5jcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIGlmIGJveCB0b3VjaGVzIGJvdHRvbSBvZiB3YWxsLlxuICAgICAqIEBwYXJhbSBib3gge09iamVjdH1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBpbmNyZWFzZU51bVJvd3MgPSBmdW5jdGlvbiAoYm94LCBudW1Sb3dzKSB7XG4gICAgICAgIC8vIERldGVybWluZSB3aGVuIHRvIGFkZCBleHRyYSByb3cgdG8gYmUgYWJsZSB0byBtb3ZlIGRvd246XG4gICAgICAgIC8vIDEuIEFueXRpbWUgZHJhZ2dpbmcgc3RhcnRzLlxuICAgICAgICAvLyAyLiBXaGVuIGRyYWdnaW5nIHN0YXJ0cyBBTkQgbW92aW5nIGJveCBpcyBjbG9zZSB0byBib3R0b20gYm9yZGVyLlxuICAgICAgICBpZiAoKGJveC5yb3cgKyBib3gucm93c3BhbikgPT09IGRhc2hncmlkLm51bVJvd3MgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPCBkYXNoZ3JpZC5tYXhSb3dzKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVhc2VzIG51bWJlciBvZiBkYXNoZ3JpZC5udW1Sb3dzIHRvIGZ1cnRoZXN0IGRvd253YXJkIGJveC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkZWNyZWFzZU51bVJvd3MgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICBsZXQgbWF4Um93TnVtID0gMDtcblxuICAgICAgICBib3hlcy5mb3JFYWNoKGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgICAgIGlmIChtYXhSb3dOdW0gPCAoYm94LnJvdyArIGJveC5yb3dzcGFuKSkge1xuICAgICAgICAgICAgICAgIG1heFJvd051bSA9IGJveC5yb3cgKyBib3gucm93c3BhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1heFJvd051bSA8IGRhc2hncmlkLm51bVJvd3MpIHtkYXNoZ3JpZC5udW1Sb3dzID0gbWF4Um93TnVtO31cbiAgICAgICAgaWYgKG1heFJvd051bSA8IGRhc2hncmlkLm1pblJvd3MpIHtkYXNoZ3JpZC5udW1Sb3dzID0gZGFzaGdyaWQubWluUm93czt9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBtaW4sIG1heCBib3gtc2l6ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgbGV0IGlzVXBkYXRlVmFsaWQgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGlmIChib3gucm93c3BhbiA8IGRhc2hncmlkLm1pblJvd3NwYW4gfHxcbiAgICAgICAgICAgIGJveC5yb3dzcGFuID4gZGFzaGdyaWQubWF4Um93c3BhbiB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbnNwYW4gPCBkYXNoZ3JpZC5taW5Db2x1bW5zcGFuIHx8XG4gICAgICAgICAgICBib3guY29sdW1uc3BhbiA+IGRhc2hncmlkLm1heENvbHVtbnNwYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGJvcmRlciBjb2xsaXNpb25zIGJ5IHJldmVydGluZyBiYWNrIHRvIGNsb3Nlc3QgZWRnZSBwb2ludC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgY29sbGlkZWQgYW5kIGNhbm5vdCBtb3ZlIHdhbGwgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaXNCb3hPdXRzaWRlQm91bmRhcnkgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIC8vIFRvcCBhbmQgbGVmdCBib3JkZXIuXG4gICAgICAgIGlmIChib3guY29sdW1uIDwgMCB8fFxuICAgICAgICAgICAgYm94LnJvdyA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmlnaHQgYW5kIGJvdHRvbSBib3JkZXIuXG4gICAgICAgIGlmIChib3gucm93ICsgYm94LnJvd3NwYW4gPiBkYXNoZ3JpZC5tYXhSb3dzIHx8XG4gICAgICAgICAgICBib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW4gPiBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0LFxuICAgICAgICB1cGRhdGVCb3gsXG4gICAgICAgIHVwZGF0ZU51bVJvd3MsXG4gICAgICAgIGluY3JlYXNlTnVtUm93cyxcbiAgICAgICAgZGVjcmVhc2VOdW1Sb3dzLFxuICAgICAgICB1cGRhdGVOdW1Db2x1bW5zLFxuICAgICAgICBpbmNyZWFzZU51bUNvbHVtbnMsXG4gICAgICAgIGRlY3JlYXNlTnVtQ29sdW1ucyxcbiAgICAgICAgZ2V0Qm94LFxuICAgICAgICBpbnNlcnRCb3gsXG4gICAgICAgIHJlbW92ZUJveFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtyZW1vdmVOb2Rlc30gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IEdyaWRWaWV3O1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIHJlbmRlcmluZyBmcm9tIGphdmFzY3JpcHQgdG8gRE9NLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXNoZ3JpZC5cbiAqIEBwYXJhbSB7cmVuZGVyZXJ9IHJlbmRlcmVyLlxuICovXG5mdW5jdGlvbiBHcmlkVmlldyhvYmopIHtcbiAgICBsZXQge2Rhc2hncmlkLCByZW5kZXJlcn0gPSBvYmo7XG4gICAgbGV0IGdyaWRMaW5lc0VsZW1lbnQ7XG4gICAgbGV0IGdyaWRDZW50cm9pZHNFbGVtZW50O1xuXG4gICAgbGV0IGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkYXNoZ3JpZC5zaG93R3JpZExpbmVzKSB7Y3JlYXRlR3JpZExpbmVzRWxlbWVudCgpO31cbiAgICAgICAgaWYgKGRhc2hncmlkLnNob3dHcmlkQ2VudHJvaWRzKSB7Y3JlYXRlR3JpZENlbnRyb2lkc0VsZW1lbnQoKTt9XG5cbiAgICAgICAgcmVuZGVyZXIuc2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Um93SGVpZ2h0KCk7XG5cbiAgICAgICAgcmVuZGVyR3JpZCgpO1xuICAgICAgICByZW5kZXJCb3goZGFzaGdyaWQuYm94ZXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdmVydGljYWwgYW5kIGhvcml6b250YWwgbGluZSBlbGVtZW50cy5cbiAgICAgKi9cbiAgICBsZXQgY3JlYXRlR3JpZExpbmVzRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGxpbmVFbGVtZW50SUQgPSAnZGFzaGdyaWQtZ3JpZC1saW5lcyc7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsaW5lRWxlbWVudElEKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZ3JpZExpbmVzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZ3JpZExpbmVzRWxlbWVudC5pZCA9IGxpbmVFbGVtZW50SUQ7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5hcHBlbmRDaGlsZChncmlkTGluZXNFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdmVydGljYWwgYW5kIGhvcml6b250YWwgbGluZSBlbGVtZW50cy5cbiAgICAgKi9cbiAgICBsZXQgY3JlYXRlR3JpZENlbnRyb2lkc0VsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBjZW50cm9pZEVsZW1lbnRJRCA9ICdkYXNoZ3JpZC1ncmlkLWNlbnRyb2lkcyc7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjZW50cm9pZEVsZW1lbnRJRCkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGdyaWRDZW50cm9pZHNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBncmlkQ2VudHJvaWRzRWxlbWVudC5pZCA9IGNlbnRyb2lkRWxlbWVudElEO1xuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZ3JpZENlbnRyb2lkc0VsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERyYXcgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgZ3JpZCBsaW5lcyB3aXRoIHRoZSB0aGlja25lc3Mgb2YgeE1hcmdpblxuICAgICAqIHlNYXJnaW4uXG4gICAgICovXG4gICAgbGV0IHJlbmRlckdyaWRMaW5lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGdyaWRMaW5lc0VsZW1lbnQgPT09IG51bGwpIHtyZXR1cm47fVxuXG4gICAgICAgIHJlbW92ZU5vZGVzKGdyaWRMaW5lc0VsZW1lbnQpO1xuICAgICAgICBsZXQgY29sdW1uV2lkdGggPSByZW5kZXJlci5nZXRDb2x1bW5XaWR0aCgpO1xuICAgICAgICBsZXQgcm93SGVpZ2h0ID0gcmVuZGVyZXIuZ2V0Um93SGVpZ2h0KCk7XG5cbiAgICAgICAgbGV0IGh0bWxTdHJpbmcgPSAnJztcbiAgICAgICAgLy8gSG9yaXpvbnRhbCBsaW5lc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBkYXNoZ3JpZC5udW1Sb3dzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGh0bWxTdHJpbmcgKz0gYDxkaXYgY2xhc3M9J2Rhc2hncmlkLWhvcml6b250YWwtbGluZSdcbiAgICAgICAgICAgICAgICBzdHlsZT0ndG9wOiAke2kgKiAocm93SGVpZ2h0ICsgZGFzaGdyaWQueU1hcmdpbil9cHg7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDBweDtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJHtkYXNoZ3JpZC55TWFyZ2lufXB4O1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7Jz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVmVydGljYWwgbGluZXNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZGFzaGdyaWQubnVtQ29sdW1uczsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdkYXNoZ3JpZC12ZXJ0aWNhbC1saW5lJ1xuICAgICAgICAgICAgICAgIHN0eWxlPSd0b3A6IDBweDtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtpICogKGNvbHVtbldpZHRoICsgZGFzaGdyaWQueE1hcmdpbil9cHg7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICR7ZGFzaGdyaWQueE1hcmdpbn1weDtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyc+XG4gICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyaWRMaW5lc0VsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRHJhdyBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBncmlkIGxpbmVzIHdpdGggdGhlIHRoaWNrbmVzcyBvZiB4TWFyZ2luXG4gICAgICogeU1hcmdpbi5cbiAgICAgKi9cbiAgICBsZXQgcmVuZGVyR3JpZENlbnRyb2lkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGdyaWRDZW50cm9pZHNFbGVtZW50ID09PSBudWxsKSB7cmV0dXJufTtcblxuICAgICAgICByZW1vdmVOb2RlcyhncmlkQ2VudHJvaWRzRWxlbWVudCk7XG4gICAgICAgIGxldCBjb2x1bW5XaWR0aCA9IHJlbmRlcmVyLmdldENvbHVtbldpZHRoKCk7XG4gICAgICAgIGxldCByb3dIZWlnaHQgPSByZW5kZXJlci5nZXRSb3dIZWlnaHQoKTtcblxuICAgICAgICBsZXQgaHRtbFN0cmluZyA9ICcnO1xuICAgICAgICAvLyBEcmF3IGNlbnRyb2lkc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhc2hncmlkLm51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXNoZ3JpZC5udW1Db2x1bW5zOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBodG1sU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdkYXNoZ3JpZC1ncmlkLWNlbnRyb2lkJ1xuICAgICAgICAgICAgICAgICAgICBzdHlsZT0ndG9wOiAkeyhpICogKHJvd0hlaWdodCAgKyBkYXNoZ3JpZC55TWFyZ2luKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0IC8gMiArIGRhc2hncmlkLnlNYXJnaW4gKX1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7KGogKiAoY29sdW1uV2lkdGggICsgZGFzaGdyaWQueE1hcmdpbikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbldpZHRoIC8gMiArIGRhc2hncmlkLnhNYXJnaW4pfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsnPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ3JpZENlbnRyb2lkc0VsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIHRoZSBkYXNoZ3JpZDpcbiAgICAgKiAgICAxLiBTZXR0aW5nIGdyaWQgYW5kIGNlbGwgaGVpZ2h0IC8gd2lkdGhcbiAgICAgKiAgICAyLiBQYWludGluZy5cbiAgICAgKi9cbiAgICBsZXQgcmVuZGVyR3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0R3JpZEVsZW1lbnRIZWlnaHQoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0R3JpZEVsZW1lbnRXaWR0aCgpO1xuICAgICAgICByZW5kZXJlci5zZXRDZWxsQ2VudHJvaWRzKCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnNob3dHcmlkTGluZXMpIHtyZW5kZXJHcmlkTGluZXMoKTt9XG4gICAgICAgIGlmIChkYXNoZ3JpZC5zaG93R3JpZENlbnRyb2lkcykge3JlbmRlckdyaWRDZW50cm9pZHMoKTt9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGJveGVzIExpc3Qgb2YgYm94ZXMgdG8gcmVkcmF3LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBleGNsdWRlQm94IERvbid0IHJlZHJhdyB0aGlzIGJveC5cbiAgICAgKi9cbiAgICBsZXQgcmVuZGVyQm94ID0gZnVuY3Rpb24gKGJveGVzLCBleGNsdWRlQm94KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZUdyaWREaW1lbnNpb24gbW92ZWQgYm94ZXMgY3NzLlxuICAgICAgICAgICAgYm94ZXMuZm9yRWFjaChmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4Y2x1ZGVCb3ggIT09IGJveCkge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WVBvc2l0aW9uKGJveC5fZWxlbWVudCwgYm94LnJvdyk7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRYUG9zaXRpb24oYm94Ll9lbGVtZW50LCBib3guY29sdW1uKTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudEhlaWdodChib3guX2VsZW1lbnQsIGJveC5yb3dzcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFdpZHRoKGJveC5fZWxlbWVudCwgYm94LmNvbHVtbnNwYW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGluaXQsXG4gICAgICAgIHJlbmRlckdyaWQsXG4gICAgICAgIHJlbmRlckJveCxcbiAgICAgICAgY3JlYXRlR3JpZExpbmVzRWxlbWVudCxcbiAgICAgICAgY3JlYXRlR3JpZENlbnRyb2lkc0VsZW1lbnRcbiAgICB9KTtcbn1cbiIsIi8qKlxuICogbW91c2VIYW5kbGVyLmpzOiBJbml0aWFsaXplcyBhbmQgc2V0cyB1cCB0aGUgZXZlbnRzIGZvciBkcmFnZ2luZyAvIHJlc2l6aW5nLlxuICovXG5cbmltcG9ydCB7ZmluZFBhcmVudH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vdXNlSGFuZGxlcihjb21wKSB7XG4gICAgbGV0IHtkcmFnZ2VyLCByZXNpemVyLCBkYXNoZ3JpZCwgZ3JpZH0gPSBjb21wO1xuXG4gICAgbGV0IGlucHV0VGFncyA9IFsnc2VsZWN0JywgJ2lucHV0JywgJ3RleHRhcmVhJywgJ2J1dHRvbiddO1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtkYXNoZ3JpZC5fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge21vdXNlRG93bihlLCBkYXNoZ3JpZC5fZWxlbWVudCk7IGUucHJldmVudERlZmF1bHQoKTt9LCBmYWxzZSk7fVxuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGUsIGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBFeGl0IGlmOlxuICAgICAgICAvLyAxLiB0aGUgdGFyZ2V0IGhhcyBpdCdzIG93biBjbGljayBldmVudCBvclxuICAgICAgICAvLyAyLiB0YXJnZXQgaGFzIG9uY2xpY2sgYXR0cmlidXRlIG9yXG4gICAgICAgIC8vIDMuIFJpZ2h0IC8gbWlkZGxlIGJ1dHRvbiBjbGlja2VkIGluc3RlYWQgb2YgbGVmdC5cbiAgICAgICAgaWYgKGlucHV0VGFncy5pbmRleE9mKG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkgPiAtMSkge3JldHVybjt9XG4gICAgICAgIGlmIChub2RlLmhhc0F0dHJpYnV0ZSgnb25jbGljaycpKSB7cmV0dXJuO31cbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDIgfHwgZS53aGljaCA9PT0gMykge3JldHVybjt9XG5cbiAgICAgICAgLy8gSGFuZGxlIGRyYWcgLyByZXNpemUgZXZlbnQuXG4gICAgICAgIGlmIChub2RlLmNsYXNzTmFtZS5zZWFyY2goL2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLykgPiAtMSkge2hhbmRsZUV2ZW50KGUsIHJlc2l6ZUV2ZW50KTt9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NOYW1lLnNlYXJjaChkYXNoZ3JpZC5kcmFnZ2FibGUuaGFuZGxlKSA+IC0xKSB7aGFuZGxlRXZlbnQoZSwgZHJhZ0V2ZW50KTt9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIG1vdXNlIGV2ZW50LCBjbGljayBvciByZXNpemUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUV2ZW50KGUsIGNiKSB7XG4gICAgICAgIGxldCBib3hFbGVtZW50ID0gZmluZFBhcmVudChlLnRhcmdldCwgL15kYXNoZ3JpZC1ib3gkLyk7XG4gICAgICAgIGxldCBib3ggPSBncmlkLmdldEJveChib3hFbGVtZW50KTtcbiAgICAgICAgaWYgKGJveCkgeyBjYihib3gsIGUpOyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhZyBldmVudCwgc2V0cyBvZmYgc3RhcnQgZHJhZywgZHVyaW5nIGRyYWcgYW5kIGVuZCBkcmFnLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRyYWdFdmVudChib3gsIGUpIHtcbiAgICAgICAgaWYgKCFkYXNoZ3JpZC5kcmFnZ2FibGUuZW5hYmxlZCB8fCAhYm94LmRyYWdnYWJsZSkge3JldHVybjt9XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2RyYWdzdGFydCcpO1xuICAgICAgICBkcmFnZ2VyLmRyYWdTdGFydChib3gsIGUpO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBkcmFnRW5kLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcsIGZhbHNlKTtcblxuICAgICAgICBmdW5jdGlvbiBkcmFnKGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnJyk7XG4gICAgICAgICAgICBkcmFnZ2VyLmRyYWcoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYWdFbmQoZSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2RyYWdlbmQnKTtcbiAgICAgICAgICAgIGRyYWdnZXIuZHJhZ0VuZChib3gsIGUpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGRyYWdFbmQsIGZhbHNlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2l6ZSBldmVudCwgc2V0cyBvZmYgc3RhcnQgcmVzaXplLCBkdXJpbmcgcmVzaXplIGFuZCBlbmQgcmVzaXplLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2l6ZUV2ZW50KGJveCwgZSkge1xuICAgICAgICBpZiAoIWRhc2hncmlkLnJlc2l6YWJsZS5lbmFibGVkIHx8ICFib3gucmVzaXphYmxlKSB7cmV0dXJuO31cbiAgICAgICAgcmVzaXplci5yZXNpemVTdGFydChib3gsIGUpO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZXNpemVFbmQsIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgcmVzaXplLCBmYWxzZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzaXplKGUpIHtyZXNpemVyLnJlc2l6ZShib3gsIGUpO2UucHJldmVudERlZmF1bHQoKTt9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzaXplRW5kKGUpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZXNpemVFbmQsIGZhbHNlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlc2l6ZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICByZXNpemVyLnJlc2l6ZUVuZChib3gsIGUpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0XG4gICAgfSk7XG5cbn1cbiIsImltcG9ydCB7cmVtb3ZlTm9kZXN9IGZyb20gJy4vdXRpbHMuanMnO1xuZXhwb3J0IGRlZmF1bHQgUmVuZGVyO1xuXG5mdW5jdGlvbiBSZW5kZXIoY29tcCkge1xuICAgIGxldCB7ZGFzaGdyaWR9ID0gY29tcDtcblxuICAgIC8vIFN0YXJ0IHJvdyAvIGNvbHVtbiBkZW5vdGVzIHRoZSBwaXhlbCBhdCB3aGljaCBlYWNoIGNlbGwgc3RhcnRzIGF0LlxuICAgIGxldCBzdGFydENvbHVtbiA9IFtdO1xuICAgIGxldCBzdGFydFJvdyA9IFtdO1xuICAgIGxldCBjb2x1bW5XaWR0aCwgcm93SGVpZ2h0O1xuXG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgIGxldCBnZXRDb2x1bW5XaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbldpZHRoO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIFxuICAgICovXG4gICAgbGV0IGdldFJvd0hlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJvd0hlaWdodDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEdyaWRFbGVtZW50V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhc2hncmlkLl9lbGVtZW50LnN0eWxlLndpZHRoID0gKGNvbHVtbldpZHRoKSA/XG4gICAgICAgICAgICBjb2x1bW5XaWR0aCAqIGRhc2hncmlkLm51bUNvbHVtbnMgKyAoZGFzaGdyaWQubnVtQ29sdW1ucyArIDEpICogZGFzaGdyaWQueE1hcmdpbiArICdweCcgOlxuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQucGFyZW50Tm9kZS5vZmZzZXRXaWR0aCArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBzZXRDb2x1bW5XaWR0aCA9IGZ1bmN0aW9uICgpIHsgICAgICAgICAgICBcbiAgICAgICAgY29sdW1uV2lkdGggPSAoZGFzaGdyaWQuY29sdW1uV2lkdGggIT09ICdhdXRvJykgP1xuICAgICAgICAgICAgZGFzaGdyaWQuY29sdW1uV2lkdGggOlxuICAgICAgICAgICAgKGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0V2lkdGggLSAoZGFzaGdyaWQubnVtQ29sdW1ucyArIDEpICogZGFzaGdyaWQueE1hcmdpbikgLyBkYXNoZ3JpZC5udW1Db2x1bW5zO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0R3JpZEVsZW1lbnRIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhc2hncmlkLl9lbGVtZW50LnN0eWxlLmhlaWdodCA9IChyb3dIZWlnaHQpID9cbiAgICAgICAgICAgIHJvd0hlaWdodCAqIGRhc2hncmlkLm51bVJvd3MgKyAoZGFzaGdyaWQubnVtUm93cyArIDEpICogZGFzaGdyaWQueU1hcmdpbiArICdweCcgOlxuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Um93SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByb3dIZWlnaHQgPSAoZGFzaGdyaWQucm93SGVpZ2h0ICE9PSAnYXV0bycpID9cbiAgICAgICAgICAgIGRhc2hncmlkLnJvd0hlaWdodCA6XG4gICAgICAgICAgICAoZGFzaGdyaWQuX2VsZW1lbnQucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQgLSAoZGFzaGdyaWQubnVtUm93cyArIDEpICogZGFzaGdyaWQueU1hcmdpbikgLyBkYXNoZ3JpZC5udW1Sb3dzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Qm94RWxlbWVudFhQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb2x1bW4pIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gY29sdW1uICogY29sdW1uV2lkdGggKyBkYXNoZ3JpZC54TWFyZ2luICogKGNvbHVtbiArIDEpICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEJveEVsZW1lbnRZUG9zaXRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgcm93KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gcm93ICogcm93SGVpZ2h0ICsgZGFzaGdyaWQueU1hcmdpbiAqIChyb3cgKyAxKSArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBzZXRCb3hFbGVtZW50V2lkdGggPSBmdW5jdGlvbiAoZWxlbWVudCwgY29sdW1uc3Bhbikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gY29sdW1uc3BhbiAqIGNvbHVtbldpZHRoICsgZGFzaGdyaWQueE1hcmdpbiAqIChjb2x1bW5zcGFuIC0gMSkgKyAncHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Qm94RWxlbWVudEhlaWdodCA9IGZ1bmN0aW9uIChlbGVtZW50LCByb3dzcGFuKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcm93c3BhbiAqIHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4gKiAocm93c3BhbiAtIDEpICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgY2VsbCBjZW50cm9pZHMgd2hpY2ggYXJlIHVzZWQgdG8gY29tcHV0ZSBjbG9zZXN0IGNlbGxcbiAgICAgKiAgICAgd2hlbiBkcmFnZ2luZyBhIGJveC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtUm93cyBUaGUgdG90YWwgbnVtYmVyIG9mIHJvd3MuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bUNvbHVtbnMgVGhlIHRvdGFsIG51bWJlciBvZiByb3dzLlxuICAgICAqL1xuICAgIGxldCBzZXRDZWxsQ2VudHJvaWRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzdGFydFJvdyA9IFtdO1xuICAgICAgICBzdGFydENvbHVtbiA9IFtdO1xuICAgICAgICBsZXQgc3RhcnQ7XG4gICAgICAgIGxldCBzdG9wO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGFzaGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBzdGFydCA9IGkgKiAocm93SGVpZ2h0ICsgZGFzaGdyaWQueU1hcmdpbikgKyBkYXNoZ3JpZC55TWFyZ2luIC8gMjtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydCArIHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW47XG4gICAgICAgICAgICBzdGFydFJvdy5wdXNoKFtNYXRoLmZsb29yKHN0YXJ0KSwgTWF0aC5jZWlsKHN0b3ApXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhc2hncmlkLm51bUNvbHVtbnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgc3RhcnQgPSBpICogKGNvbHVtbldpZHRoICsgZGFzaGdyaWQueE1hcmdpbikgKyBkYXNoZ3JpZC54TWFyZ2luIC8gMjtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydCArIGNvbHVtbldpZHRoICsgZGFzaGdyaWQueE1hcmdpbjtcbiAgICAgICAgICAgIHN0YXJ0Q29sdW1uLnB1c2goW01hdGguZmxvb3Ioc3RhcnQpLCBNYXRoLmNlaWwoc3RvcCldKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyB3aGljaCBjZWxscyBib3ggaW50ZXJzZWN0cyB3aXRoLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hQb3NpdGlvbiBDb250YWlucyB0b3AvYm90dG9tL2xlZnQvcmlnaHQgYm94IHBvc2l0aW9uXG4gICAgICogICAgIGluIHB4LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1Sb3dzIEhvdyBtYW55IHJvd3MgdGhlIGJveCBzcGFucy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtQ29sdW1ucyBIb3cgbWFueSByb3dzIHRoZSBib3ggc3BhbnMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgcm93IG9yIGNvbHVtbiB3aGljaCBlYWNoIHNpZGUgaXMgZm91bmQgaW4uXG4gICAgICogICAgIEZvciBpbnN0YW5jZSwgYm94TGVmdDogY29sdW1uID0gMCwgYm94UmlnaHQ6IGNvbHVtbiA9IDEsXG4gICAgICogICAgIEJveFRvcDogcm93ID0gMCwgQm94Qm90dG9tOiByb3cgPSAzLlxuICAgICAqL1xuICAgIGxldCBmaW5kSW50ZXJzZWN0ZWRDZWxscyA9IGZ1bmN0aW9uIChjb21wKSB7XG4gICAgICAgIGxldCB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0fSA9IGNvbXA7XG4gICAgICAgIGxldCBib3hMZWZ0LCBib3hSaWdodCwgYm94VG9wLCBib3hCb3R0b207XG5cbiAgICAgICAgLy8gRmluZCB0b3AgYW5kIGJvdHRvbSBpbnRlcnNlY3Rpb24gY2VsbCByb3cuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGFzaGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAodG9wID49IHN0YXJ0Um93W2ldWzBdICYmIHRvcCA8PSBzdGFydFJvd1tpXVsxXSkge2JveFRvcCA9IGk7fVxuICAgICAgICAgICAgaWYgKGJvdHRvbSA+PSBzdGFydFJvd1tpXVswXSAmJiBib3R0b20gPD0gc3RhcnRSb3dbaV1bMV0pIHtib3hCb3R0b20gPSBpO31cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgbGVmdCBhbmQgcmlnaHQgaW50ZXJzZWN0aW9uIGNlbGwgY29sdW1uLlxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhc2hncmlkLm51bUNvbHVtbnM7IGogKz0gMSkge1xuICAgICAgICAgICAgaWYgKGxlZnQgPj0gc3RhcnRDb2x1bW5bal1bMF0gJiYgbGVmdCA8PSBzdGFydENvbHVtbltqXVsxXSkge2JveExlZnQgPSBqO31cbiAgICAgICAgICAgIGlmIChyaWdodCA+PSBzdGFydENvbHVtbltqXVswXSAmJiByaWdodCA8PSBzdGFydENvbHVtbltqXVsxXSkge2JveFJpZ2h0ID0gajt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2JveExlZnQsIGJveFJpZ2h0LCBib3hUb3AsIGJveEJvdHRvbX07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCBjbG9zZXN0IGNlbGwgZ2l2ZW4gKHJvdywgY29sdW1uKSBwb3NpdGlvbiBpbiBweC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94UG9zaXRpb24gQ29udGFpbnMgdG9wL2JvdHRvbS9sZWZ0L3JpZ2h0IGJveCBwb3NpdGlvblxuICAgICAqICAgICBpbiBweC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtUm93c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1Db2x1bW5zXG4gICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAgKi9cbiAgICBsZXQgZ2V0Q2xvc2VzdENlbGxzID0gZnVuY3Rpb24gKGNvbXApIHtcbiAgICAgICAgbGV0IHt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnR9ID0gY29tcDtcbiAgICAgICAgbGV0IHtib3hMZWZ0LCBib3hSaWdodCwgYm94VG9wLCBib3hCb3R0b219ID0gZmluZEludGVyc2VjdGVkQ2VsbHMoY29tcCk7XG5cbiAgICAgICAgbGV0IGNvbHVtbjtcbiAgICAgICAgbGV0IGxlZnRPdmVybGFwO1xuICAgICAgICBsZXQgcmlnaHRPdmVybGFwO1xuICAgICAgICAvLyBEZXRlcm1pbmUgaWYgZW5vdWdoIG92ZXJsYXAgZm9yIGhvcml6b250YWwgbW92ZS5cbiAgICAgICAgaWYgKGJveExlZnQgIT09IHVuZGVmaW5lZCAmJiBib3hSaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZWZ0T3ZlcmxhcCA9IE1hdGguYWJzKGxlZnQgLSBzdGFydENvbHVtbltib3hMZWZ0XVswXSk7XG4gICAgICAgICAgICByaWdodE92ZXJsYXAgPSBNYXRoLmFicyhyaWdodCAtIHN0YXJ0Q29sdW1uW2JveFJpZ2h0XVsxXSAtIGRhc2hncmlkLnhNYXJnaW4pO1xuICAgICAgICAgICAgaWYgKGxlZnRPdmVybGFwIDw9IHJpZ2h0T3ZlcmxhcCkge2NvbHVtbiA9IGJveExlZnQ7fVxuICAgICAgICAgICAgZWxzZSB7Y29sdW1uID0gYm94TGVmdCArIDE7fVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJvdztcbiAgICAgICAgbGV0IHRvcE92ZXJsYXA7XG4gICAgICAgIGxldCBib3R0b21PdmVybGFwO1xuICAgICAgICAvLyBEZXRlcm1pbmUgaWYgZW5vdWdoIG92ZXJsYXAgZm9yIHZlcnRpY2FsIG1vdmUuXG4gICAgICAgIGlmIChib3hUb3AgIT09IHVuZGVmaW5lZCAmJiBib3hCb3R0b20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9wT3ZlcmxhcCA9IE1hdGguYWJzKHRvcCAtIHN0YXJ0Um93W2JveFRvcF1bMF0pO1xuICAgICAgICAgICAgYm90dG9tT3ZlcmxhcCA9IE1hdGguYWJzKGJvdHRvbSAtIHN0YXJ0Um93W2JveEJvdHRvbV1bMV0gLSBkYXNoZ3JpZC55TWFyZ2luKTtcbiAgICAgICAgICAgIGlmICh0b3BPdmVybGFwIDw9IGJvdHRvbU92ZXJsYXApIHtyb3cgPSBib3hUb3A7fVxuICAgICAgICAgICAgZWxzZSB7cm93ID0gYm94VG9wICsgMTt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3JvdywgY29sdW1ufTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGdldENvbHVtbldpZHRoLFxuICAgICAgICBnZXRSb3dIZWlnaHQsXG4gICAgICAgIHNldENvbHVtbldpZHRoLFxuICAgICAgICBzZXRSb3dIZWlnaHQsXG4gICAgICAgIHNldEdyaWRFbGVtZW50SGVpZ2h0LFxuICAgICAgICBzZXRHcmlkRWxlbWVudFdpZHRoLFxuICAgICAgICBzZXRCb3hFbGVtZW50WFBvc2l0aW9uLFxuICAgICAgICBzZXRCb3hFbGVtZW50WVBvc2l0aW9uLFxuICAgICAgICBzZXRCb3hFbGVtZW50V2lkdGgsXG4gICAgICAgIHNldEJveEVsZW1lbnRIZWlnaHQsXG4gICAgICAgIGZpbmRJbnRlcnNlY3RlZENlbGxzLFxuICAgICAgICBzZXRDZWxsQ2VudHJvaWRzLFxuICAgICAgICBnZXRDbG9zZXN0Q2VsbHNcbiAgIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgUmVzaXplcjtcblxuZnVuY3Rpb24gUmVzaXplcihjb21wKSB7XG4gICAgbGV0IHtkYXNoZ3JpZCwgcmVuZGVyZXIsIGdyaWR9ID0gY29tcDtcblxuICAgIGxldCBtaW5XaWR0aCwgbWluSGVpZ2h0LCBlbGVtZW50TGVmdCwgZWxlbWVudFRvcCwgZWxlbWVudFdpZHRoLCBlbGVtZW50SGVpZ2h0LCBtaW5Ub3AsIG1heFRvcCwgbWluTGVmdCwgbWF4TGVmdCwgY2xhc3NOYW1lLFxuICAgIG1vdXNlWCA9IDAsXG4gICAgbW91c2VZID0gMCxcbiAgICBsYXN0TW91c2VYID0gMCxcbiAgICBsYXN0TW91c2VZID0gMCxcbiAgICBtT2ZmWCA9IDAsXG4gICAgbU9mZlkgPSAwLFxuICAgIG5ld1N0YXRlID0ge30sXG4gICAgcHJldlN0YXRlID0ge307XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplU3RhcnQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGUudGFyZ2V0LmNsYXNzTmFtZTtcblxuICAgICAgICAvLyBSZW1vdmVzIHRyYW5zaXRpb25zLCBkaXNwbGF5cyBhbmQgaW5pdHMgcG9zaXRpb25zIGZvciBwcmV2aWV3IGJveC5cbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDQ7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJyc7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmxlZnQgPSBib3guX2VsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUudG9wID0gYm94Ll9lbGVtZW50LnN0eWxlLnRvcDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUud2lkdGggPSBib3guX2VsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmhlaWdodCA9IGJveC5fZWxlbWVudC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcblxuICAgICAgICAvLyBNb3VzZSB2YWx1ZXMuXG4gICAgICAgIG1pbldpZHRoID0gcmVuZGVyZXIuZ2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgbWluSGVpZ2h0ID0gcmVuZGVyZXIuZ2V0Um93SGVpZ2h0KCk7XG4gICAgICAgIGxhc3RNb3VzZVggPSBlLnBhZ2VYO1xuICAgICAgICBsYXN0TW91c2VZID0gZS5wYWdlWTtcbiAgICAgICAgZWxlbWVudExlZnQgPSBwYXJzZUludChib3guX2VsZW1lbnQuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICBlbGVtZW50VG9wID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50LnN0eWxlLnRvcCwgMTApO1xuICAgICAgICBlbGVtZW50V2lkdGggPSBib3guX2VsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGVsZW1lbnRIZWlnaHQgPSBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIGdyaWQudXBkYXRlU3RhcnQoYm94KTtcblxuICAgICAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6ZVN0YXJ0KSB7ZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6ZVN0YXJ0KCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCByZXNpemUgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIHVwZGF0ZVJlc2l6aW5nRWxlbWVudChib3gsIGUpO1xuICAgICAgICBncmlkLnVwZGF0aW5nKGJveCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICAvLyBXaGljaCBjZWxsIHRvIHNuYXAgc2hhZG93Ym94IHRvLlxuICAgICAgICAgICAgbGV0IHtib3hMZWZ0LCBib3hSaWdodCwgYm94VG9wLCBib3hCb3R0b219ID0gcmVuZGVyZXIuXG4gICAgICAgICAgICAgICAgZmluZEludGVyc2VjdGVkQ2VsbHMoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0ICsgYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IGJveC5fZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCArIGJveC5fZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHtyb3c6IGJveFRvcCwgY29sdW1uOiBib3hMZWZ0LCByb3dzcGFuOiBib3hCb3R0b20gLSBib3hUb3AgKyAxLCBjb2x1bW5zcGFuOiBib3hSaWdodCAtIGJveExlZnQgKyAxfTtcblxuICAgICAgICAgICAgcmVzaXplQm94KGJveCwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6aW5nKSB7ZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6aW5nKCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCByZXNpemVFbmQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGlmICghZGFzaGdyaWQubGl2ZUNoYW5nZXMpIHtcbiAgICAgICAgICAgIGxldCB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfSA9IHJlbmRlcmVyLlxuICAgICAgICAgICAgICAgIGZpbmRJbnRlcnNlY3RlZENlbGxzKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgKyBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBudW1Sb3dzOiBncmlkLmdldE51bVJvd3MoKSxcbiAgICAgICAgICAgICAgICAgICAgbnVtQ29sdW1uczogZ3JpZC5nZXROdW1Db2x1bW5zKClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5ld1N0YXRlID0ge3JvdzogYm94VG9wLCBjb2x1bW46IGJveExlZnQsIHJvd3NwYW46IGJveEJvdHRvbSAtIGJveFRvcCArIDEsIGNvbHVtbnNwYW46IGJveFJpZ2h0IC0gYm94TGVmdCArIDF9O1xuICAgICAgICAgICAgcmVzaXplQm94KGJveCwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgYm94IHN0eWxlLlxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IGRhc2hncmlkLnRyYW5zaXRpb247XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcDtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLndpZHRoID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5oZWlnaHQ7XG5cbiAgICAgICAgLy8gR2l2ZSB0aW1lIGZvciBwcmV2aWV3Ym94IHRvIHNuYXAgYmFjayB0byB0aWxlLlxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgICAgZ3JpZC51cGRhdGVFbmQoKTtcbiAgICAgICAgfSwgZGFzaGdyaWQuc25hcEJhY2tUaW1lKTtcblxuICAgICAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6ZUVuZCkge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVFbmQoKTt9IC8vIHVzZXIgY2IuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IHJlc2l6ZUJveCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgaWYgKG5ld1N0YXRlLnJvdyAhPT0gcHJldlN0YXRlLnJvdyAgfHxcbiAgICAgICAgICAgIG5ld1N0YXRlLmNvbHVtbiAhPT0gcHJldlN0YXRlLmNvbHVtbiAgfHxcbiAgICAgICAgICAgIG5ld1N0YXRlLnJvd3NwYW4gIT09IHByZXZTdGF0ZS5yb3dzcGFuICB8fFxuICAgICAgICAgICAgbmV3U3RhdGUuY29sdW1uc3BhbiAhPT0gcHJldlN0YXRlLmNvbHVtbnNwYW4gKSB7XG5cbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSBncmlkLnVwZGF0ZUJveChib3gsIG5ld1N0YXRlLCBib3gpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGVHcmlkRGltZW5zaW9uIHByZXZpZXcgYm94LlxuICAgICAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRYUG9zaXRpb24oZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQsIG5ld1N0YXRlLmNvbHVtbik7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFlQb3NpdGlvbihkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCwgbmV3U3RhdGUucm93KTtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50V2lkdGgoZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQsIG5ld1N0YXRlLmNvbHVtbnNwYW4pO1xuICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRIZWlnaHQoZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQsIG5ld1N0YXRlLnJvd3NwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gcG9pbnQgaW4gYXR0ZW1wdGluZyB1cGRhdGUgaWYgbm90IHN3aXRjaGVkIHRvIG5ldyBjZWxsLlxuICAgICAgICBwcmV2U3RhdGUucm93ID0gbmV3U3RhdGUucm93O1xuICAgICAgICBwcmV2U3RhdGUuY29sdW1uID0gbmV3U3RhdGUuY29sdW1uO1xuICAgICAgICBwcmV2U3RhdGUucm93c3BhbiA9IG5ld1N0YXRlLnJvd3NwYW47XG4gICAgICAgIHByZXZTdGF0ZS5jb2x1bW5zcGFuID0gbmV3U3RhdGUuY29sdW1uc3BhbjtcblxuICAgICAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6aW5nKSB7ZGFzaGdyaWQucmVzaXphYmxlLnJlc2l6aW5nKCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCB1cGRhdGVSZXNpemluZ0VsZW1lbnQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBtb3VzZSBwb3NpdGlvbi5cbiAgICAgICAgbW91c2VYID0gZS5wYWdlWDtcbiAgICAgICAgbW91c2VZID0gZS5wYWdlWTtcblxuICAgICAgICAvLyBHZXQgdGhlIGRlbHRhc1xuICAgICAgICBsZXQgZGlmZlggPSBtb3VzZVggLSBsYXN0TW91c2VYICsgbU9mZlg7XG4gICAgICAgIGxldCBkaWZmWSA9IG1vdXNlWSAtIGxhc3RNb3VzZVkgKyBtT2ZmWTtcbiAgICAgICAgbU9mZlggPSBtT2ZmWSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGxhc3QgcHJvY2Vzc2VkIG1vdXNlIHBvc2l0aW9ucy5cbiAgICAgICAgbGFzdE1vdXNlWCA9IG1vdXNlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IG1vdXNlWTtcblxuICAgICAgICBsZXQgZFkgPSBkaWZmWTtcbiAgICAgICAgbGV0IGRYID0gZGlmZlg7XG5cbiAgICAgICAgbWluVG9wID0gZGFzaGdyaWQueU1hcmdpbjtcbiAgICAgICAgbWF4VG9wID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZGFzaGdyaWQueU1hcmdpbjtcbiAgICAgICAgbWluTGVmdCA9IGRhc2hncmlkLnhNYXJnaW47XG4gICAgICAgIG1heExlZnQgPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIGRhc2hncmlkLnhNYXJnaW47XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS13JykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW53JykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXN3JykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRXaWR0aCAtIGRYIDwgbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBkaWZmWCA9IGVsZW1lbnRXaWR0aCAtIG1pbldpZHRoO1xuICAgICAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudExlZnQgKyBkWCA8IG1pbkxlZnQpIHtcbiAgICAgICAgICAgICAgICBkaWZmWCA9IG1pbkxlZnQgLSBlbGVtZW50TGVmdDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50TGVmdCArPSBkaWZmWDtcbiAgICAgICAgICAgIGVsZW1lbnRXaWR0aCAtPSBkaWZmWDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtZScpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1uZScpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zZScpID4gLTEpIHtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnRXaWR0aCArIGRYIDwgbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBkaWZmWCA9IG1pbldpZHRoIC0gZWxlbWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGggKyBkWCA+IG1heExlZnQpIHtcbiAgICAgICAgICAgICAgICBkaWZmWCA9IG1heExlZnQgLSBlbGVtZW50TGVmdCAtIGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50V2lkdGggKz0gZGlmZlg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW4nKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbncnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbmUnKSA+IC0xKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudEhlaWdodCAtIGRZIDwgbWluSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZGlmZlkgPSBlbGVtZW50SGVpZ2h0IC0gbWluSGVpZ2h0O1xuICAgICAgICAgICAgICAgIG1PZmZZID0gZFkgLSBkaWZmWTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudFRvcCArIGRZIDwgbWluVG9wKSB7XG4gICAgICAgICAgICAgICAgZGlmZlkgPSBtaW5Ub3AgLSBlbGVtZW50VG9wO1xuICAgICAgICAgICAgICAgIG1PZmZZID0gZFkgLSBkaWZmWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnRUb3AgKz0gZGlmZlk7XG4gICAgICAgICAgICBlbGVtZW50SGVpZ2h0IC09IGRpZmZZO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zJykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXN3JykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXNlJykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRIZWlnaHQgKyBkWSA8IG1pbkhlaWdodCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gbWluSGVpZ2h0IC0gZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0ICsgZFkgPiBtYXhUb3ApIHtcbiAgICAgICAgICAgICAgICBkaWZmWSA9IG1heFRvcCAtIGVsZW1lbnRUb3AgLSBlbGVtZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIG1PZmZZID0gZFkgLSBkaWZmWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnRIZWlnaHQgKz0gZGlmZlk7XG4gICAgICAgIH1cblxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gZWxlbWVudFRvcCArICdweCc7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gZWxlbWVudExlZnQgKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUud2lkdGggPSBlbGVtZW50V2lkdGggKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZWxlbWVudEhlaWdodCArICdweCc7XG5cbiAgICAgICAgLy8gU2Nyb2xsaW5nIHdoZW4gY2xvc2UgdG8gYm90dG9tIGJvdW5kYXJ5LlxuICAgICAgICBpZiAoZS5wYWdlWSAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLSBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgLSAoZS5wYWdlWSAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZGFzaGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTY3JvbGxpbmcgd2hlbiBjbG9zZSB0byByaWdodCBib3VuZGFyeS5cbiAgICAgICAgaWYgKGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IC0gZGFzaGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmlubmVyV2lkdGggLSAoZS5wYWdlWCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCkgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZGFzaGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICByZXNpemVTdGFydCxcbiAgICAgICAgcmVzaXplLFxuICAgICAgICByZXNpemVFbmRcbiAgICB9KTtcbn1cbiIsIi8vIHNoaW0gbGF5ZXIgd2l0aCBzZXRUaW1lb3V0IGZhbGxiYWNrIGZvciByZXF1aWVzdEFuaW1hdGlvbkZyYW1lXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24gKGNiKXtcbiAgICAgICAgICAgIGNiID0gY2IgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYiwgMTAwMCAvIDYwKTtcbiAgICAgICAgfTtcbn0pKCk7IiwiXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYm94XG4gKiBAcGFyYW0ge3N0cmluZ30gYXQxXG4gKiBAcGFyYW0ge3N0cmluZ30gYXQyXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4TnVtKGJveCwgYXQxLCBhdDIpIHtcbiAgICBsZXQgbWF4VmFsID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYm94Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChib3hbaV1bYXQxXSArIGJveFtpXVthdDJdID49IG1heFZhbCkge1xuICAgICAgICAgICAgbWF4VmFsID0gYm94W2ldW2F0MV0gKyBib3hbaV1bYXQyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXhWYWw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmRlclxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG9ianNcbiAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRlZEFycihvcmRlciwgYXR0ciwgb2Jqcykge1xuICAgIGxldCBrZXk7XG4gICAgbGV0IGFyciA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXMob2JqcykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpbnNlcnRCeU9yZGVyKG9yZGVyLCBhdHRyLCBvYmpzW2ldLCBhcnIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBTb3J0IGFycmF5IHdpdGggbmV3bHkgaW5zZXJ0ZWQgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGJveFxuICogQHBhcmFtIHtzdHJpbmd9IGF0MVxuICogQHBhcmFtIHtPYmplY3R9IGF0MlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QnlPcmRlcihvcmRlciwgYXR0ciwgbywgYXJyKSB7XG4gICAgbGV0IGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluc2VydCBieSBvcmRlciwgc3RhcnQgZnVydGhlc3QgZG93bi5cbiAgICAgICAgLy8gSW5zZXJ0IGJldHdlZW4gMCBhbmQgbiAtMS5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKG9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5yb3cgPiBhcnJbaV0ucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgbyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8ucm93IDwgYXJyW2ldLnJvdykge1xuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIG8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBub3QgaW5iZXR3ZWVuIDAgYW5kIG4gLSAxLCBpbnNlcnQgbGFzdC5cbiAgICAgICAgaWYgKGxlbiA9PT0gYXJyLmxlbmd0aCkge2Fyci5wdXNoKG8pO31cbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRpb25Tb3J0KGEsIGF0dHIpIHtcbiAgICBpZiAoYS5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSA9IGEubGVuZ3RoO1xuICAgIHZhciB0ZW1wO1xuICAgIHZhciBqO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaiA9IGk7XG4gICAgICAgIHdoaWxlIChqID4gMCAmJiBhW2ogLSAxXVthdHRyXSA8IGFbal1bYXR0cl0pIHtcbiAgICAgICAgICAgIHRlbXAgPSBhW2pdO1xuICAgICAgICAgICAgYVtqXSA9IGFbaiAtIDFdO1xuICAgICAgICAgICAgYVtqIC0gMV0gPSB0ZW1wO1xuICAgICAgICAgICAgaiAtPSAxO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2YgcHJvcGVydGllcyBpbiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBPYmplY3RMZW5ndGgob2JqKSB7XG4gICAgbGV0IGxlbmd0aCA9IDAsXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xufVxuXG4vKipcbiAqIEFkZCBldmVudCwgYW5kIG5vdCBvdmVyd3JpdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV2ZW50SGFuZGxlXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQoZWxlbWVudCwgdHlwZSwgZXZlbnRIYW5kbGUpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCB8fCB0eXBlb2YoZWxlbWVudCkgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlLCBmYWxzZSApO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCAnb24nICsgdHlwZSwgZXZlbnRIYW5kbGUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSA9IGV2ZW50SGFuZGxlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgbm9kZXMgZnJvbSBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU5vZGVzKGVsZW1lbnQpIHtcbiAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7ZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO31cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAqIEByZXR1cm5zIHtPYmplY3R8Qm9vbGVhbn0gRE9NIGVsZW1lbnQgb2JqZWN0IG9yIGZhbHNlIGlmIG5vdCBmb3VuZC4gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGNsYXNzTmFtZSkge1xuICAgIHdoaWxlIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lLnNlYXJjaChjbGFzc05hbWUpID4gLTEpIHtyZXR1cm4gbm9kZTt9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==
