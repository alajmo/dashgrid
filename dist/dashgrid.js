(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var css = "body,\nhtml {\n  width: 100%;\n  height: 100%;\n  font-size: 1.25em;\n  margin: 0;\n  padding: 0;\n  font-family: arial;\n  color: #444444;\n}\n.dashgridContainer {\n  position: relative;\n  top: 1%;\n  margin: 0 auto;\n  width: 98%;\n  height: 98%;\n  /*height: 800px;*/\n}\n.grid,\n.grid-box,\n.grid-shadow-box {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.dashgridBox {\n  background: #E1E1E1;\n}\n.dashgrid {\n  background: #F9F9F9;\n}\n.dragHandle {\n  width: 100%;\n  height: 100px;\n  background: red;\n}\n/**\n * GRID DRAW HELPERS.\n */\n.horizontal-line,\n.vertical-line {\n  background: #FFFFFF;\n  position: absolute;\n}\n.grid-centroid {\n  position: absolute;\n  background: #000000;\n  width: 5px;\n  height: 5px;\n}\n.dashgridBox {\n  position: absolute;\n  cursor: move;\n  transition: opacity .3s, left .3s, top .3s, width .3s, height .3s;\n  z-index: 1002;\n}\n.grid-shadow-box {\n  background-color: #E8E8E8;\n  transition: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "demo/demo.css"})); module.exports = css;
},{"browserify-css":3}],2:[function(require,module,exports){
'use strict';

var _dashgrid = require('../src/dashgrid.js');

var _dashgrid2 = _interopRequireDefault(_dashgrid);

require('./demo.css');

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
    elem.className = 'dragHandle';

    boxes = [{ row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem },
    // {row: 0, column: 9, rowspan: 3, columnspan: 2},
    { row: 2, column: 1, rowspan: 4, columnspan: 2 }];
    // boxes = fillCells(numRows, numColumns);

    var grid = (0, _dashgrid2.default)(document.getElementById('grid'), {
        boxes: boxes,
        floating: true,

        xMargin: 20,
        yMargin: 20,

        draggable: { enabled: true, handle: 'dragHandle' },

        rowHeight: 80,
        numRows: numRows,
        minRows: numRows,
        maxRows: 10,

        columnWidth: 80,
        numColumns: numColumns,
        minColumns: numColumns,
        maxColumns: 10,

        snapback: 200,

        liveChanges: true,
        displayGrid: true
    });
}

},{"../src/dashgrid.js":5,"./demo.css":1}],3:[function(require,module,exports){
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
exports.default = Box;


function Box(comp) {
    var grid = comp.grid;

    /**
     * Create Box element.
     * @param {Object} box box.
     */

    var createBox = function createBox(box) {
        Object.assign(box, boxSettings(box, grid));
        if (box.content) {
            box.element.appendChild(box.content);
        }
        grid.element.appendChild(box.element);
    };

    return Object.freeze({ createBox: createBox });
}

/**
 * Box properties and events.
 */
function boxSettings(boxElement, grid) {
    return {
        _element: function () {
            var el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.cursor = 'move';
            el.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
            el.style.zIndex = '1002';

            createBoxResizeHandlers(el, grid);

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
function createBoxResizeHandlers(boxElement, grid) {
    /**
     * TOP Handler.
     */
    if (grid.resizable.handles.indexOf('n') !== -1) {
        var handle = document.createElement('div');
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 'n-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * BOTTOM Handler.
     */
    if (grid.resizable.handles.indexOf('s') !== -1) {
        var _handle = document.createElement('div');
        _handle.style.left = 0 + 'px';
        _handle.style.bottom = 0 + 'px';
        _handle.style.width = '100%';
        _handle.style.height = grid.resizable.handleWidth + 'px';
        _handle.style.cursor = 's-resize';
        _handle.style.position = 'absolute';
        _handle.style.display = 'block';
        boxElement.appendChild(_handle);
    }

    /**
     * WEST Handler.
     */
    if (grid.resizable.handles.indexOf('w') !== -1) {
        var _handle2 = document.createElement('div');
        _handle2.style.left = 0 + 'px';
        _handle2.style.top = 0 + 'px';
        _handle2.style.width = grid.resizable.handleWidth + 'px';
        _handle2.style.height = '100%';
        _handle2.style.cursor = 'w-resize';
        _handle2.style.position = 'absolute';
        _handle2.style.display = 'block';
        boxElement.appendChild(_handle2);
    }

    /**
     * EAST Handler.
     */
    if (grid.resizable.handles.indexOf('e') !== -1) {
        var _handle3 = document.createElement('div');
        _handle3.style.right = 0 + 'px';
        _handle3.style.top = 0 + 'px';
        _handle3.style.width = grid.resizable.handleWidth + 'px';
        _handle3.style.height = '100%';
        _handle3.style.cursor = 'e-resize';
        _handle3.style.position = 'absolute';
        _handle3.style.display = 'block';
        boxElement.appendChild(_handle3);
    }

    /**
     * NORTH-EAST Handler.
     */
    if (grid.resizable.handles.indexOf('ne') !== -1) {
        var _handle4 = document.createElement('div');
        _handle4.style.right = 0 + 'px';
        _handle4.style.top = 0 + 'px';
        _handle4.style.width = grid.resizable.handleWidth + 'px';
        _handle4.style.height = grid.resizable.handleWidth + 'px';
        _handle4.style.cursor = 'ne-resize';
        _handle4.style.position = 'absolute';
        _handle4.style.display = 'block';
        boxElement.appendChild(_handle4);
    }

    /**
     * SOUTH-EAST Handler.
     */
    if (grid.resizable.handles.indexOf('se') !== -1) {
        var _handle5 = document.createElement('div');
        _handle5.style.right = 0 + 'px';
        _handle5.style.bottom = 0 + 'px';
        _handle5.style.width = grid.resizable.handleWidth + 'px';
        _handle5.style.height = grid.resizable.handleWidth + 'px';
        _handle5.style.cursor = 'se-resize';
        _handle5.style.position = 'absolute';
        _handle5.style.display = 'block';
        boxElement.appendChild(_handle5);
    }

    /**
     * SOUTH-WEST Handler.
     */
    if (grid.resizable.handles.indexOf('sw') !== -1) {
        var _handle6 = document.createElement('div');
        _handle6.style.left = 0 + 'px';
        _handle6.style.bottom = 0 + 'px';
        _handle6.style.width = grid.resizable.handleWidth + 'px';
        _handle6.style.height = grid.resizable.handleWidth + 'px';
        _handle6.style.cursor = 'sw-resize';
        _handle6.style.position = 'absolute';
        _handle6.style.display = 'block';
        boxElement.appendChild(_handle6);
    }

    /**
     * EAST Handler.
     */
    if (grid.resizable.handles.indexOf('nw') !== -1) {
        var _handle7 = document.createElement('div');
        _handle7.style.left = 0 + 'px';
        _handle7.style.top = 0 + 'px';
        _handle7.style.width = grid.resizable.handleWidth + 'px';
        _handle7.style.height = grid.resizable.handleWidth + 'px';
        _handle7.style.cursor = 'nw-resize';
        _handle7.style.position = 'absolute';
        _handle7.style.display = 'block';
        boxElement.appendChild(_handle7);
    }
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('./shims.js');

var _engine = require('./engine.js');

var _engine2 = _interopRequireDefault(_engine);

var _box = require('./box.js');

var _box2 = _interopRequireDefault(_box);

var _renderer = require('./renderer.js');

var _renderer2 = _interopRequireDefault(_renderer);

var _drawer = require('./drawer.js');

var _drawer2 = _interopRequireDefault(_drawer);

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
 * @param {Object} element The grid element.
 * @param {Object} gs Grid settings.
 */

function Dashgrid(element, gs) {
    var grid = Object.assign({}, gridSettings(gs, element));

    var renderer = (0, _renderer2.default)({ grid: grid });
    var boxHandler = (0, _box2.default)({ grid: grid });
    var drawer = (0, _drawer2.default)({ grid: grid, renderer: renderer });
    var engine = (0, _engine2.default)({ grid: grid, renderer: renderer, drawer: drawer, boxHandler: boxHandler });
    var dragger = (0, _drag2.default)({ grid: grid, renderer: renderer, engine: engine });
    var resizer = (0, _resize2.default)({ grid: grid, renderer: renderer, engine: engine });
    var mouse = (0, _mouse2.default)({ dragger: dragger, resizer: resizer, grid: grid, engine: engine });

    // Initialize.
    drawer.initialize();
    engine.initialize();
    mouse.initialize();

    // Event listeners.
    (0, _utils.addEvent)(window, 'resize', engine.refreshGrid);

    // Api.
    return Object.freeze({
        updateBox: engine.updateBox,
        insertBox: engine.insertBox,
        removeBox: engine.removeBox,
        getBoxes: engine.getBoxes,
        refreshGrid: engine.refreshGrid,
        grid: grid
    });
}

/**
 * Grid properties and events.
 */
function gridSettings(gs, element) {
    var grid = {
        _element: function () {
            element.style.position = 'absolute';
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

        draggable: {
            enabled: gs.draggable && gs.draggable.enabled === false ? false : true,
            handles: gs.draggable && gs.draggable.handles || undefined,

            // user cb's.
            dragStart: gs.draggable && gs.draggable.dragStart,
            dragging: gs.draggable && gs.draggable.dragging,
            dragEnd: gs.draggable && gs.draggable.dragEnd
        },

        resizable: {
            enabled: gs.resizable && gs.resizable.enabled === false ? false : true,
            handles: gs.resizable && gs.resizable.handles || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: gs.resizable && gs.resizable.handleWidth !== undefined ? gs.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: gs.resizable && gs.resizable.resizeStart,
            resizing: gs.resizable && gs.resizable.resizing,
            resizeEnd: gs.resizable && gs.resizable.resizeEnd
        },

        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapbacktime: gs.snapbacktime === undefined ? 300 : gs.snapbacktime,
        displayGrid: gs.displayGrid === false ? false : true
    };

    return grid;
}

},{"./box.js":4,"./drag.js":6,"./drawer.js":7,"./engine.js":8,"./mouse.js":9,"./renderer.js":10,"./resize.js":11,"./shims.js":12,"./utils.js":13}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Dragger;


function Dragger(comp) {
    var grid = comp.grid;
    var renderer = comp.renderer;
    var engine = comp.engine;


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
        minTop = grid.yMargin,
        minLeft = grid.xMargin,
        currState = {},
        prevState = {};

    /**
    * Create shadowbox, remove smooth transitions for box,
    * and initialize mouse variables. Finally, make call to api to check if,
    * any box is close to bottom / right
    * @param {}
    * @returns
    */
    var dragStart = function dragStart(box, e) {
        box.element.style.transition = 'None';
        grid.shadowBoxElement.style.left = box.element.style.left;
        grid.shadowBoxElement.style.top = box.element.style.top;
        grid.shadowBoxElement.style.width = box.element.style.width;
        grid.shadowBoxElement.style.height = box.element.style.height;
        grid.shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        eX = parseInt(box.element.offsetLeft, 10);
        eY = parseInt(box.element.offsetTop, 10);
        eW = parseInt(box.element.offsetWidth, 10);
        eH = parseInt(box.element.offsetHeight, 10);

        engine.dragResizeStart(box);

        if (grid.draggable.dragStart) {
            grid.draggable.dragStart();
        } // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    var drag = function drag(box, e) {
        updateMovingElement(box, e);
        engine.draggingResizing(box);
        if (grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box.element.offsetLeft,
                right: box.element.offsetLeft + box.element.offsetWidth,
                top: box.element.offsetTop,
                bottom: box.element.offsetTop + box.element.offsetHeight
            });
            moveBox(box, e);
        }

        if (grid.draggable.dragging) {
            grid.draggable.dragging();
        } // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    var dragEnd = function dragEnd(box, e) {
        if (!grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box.element.offsetLeft,
                right: box.element.offsetLeft + box.element.offsetWidth,
                top: box.element.offsetTop,
                bottom: box.element.offsetTop + box.element.offsetHeight
            });
            moveBox(box, e);
        }

        box.element.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
        box.element.style.left = grid.shadowBoxElement.style.left;
        box.element.style.top = grid.shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = 'none';
            engine.dragResizeEnd();
        }, grid.snapbacktime);

        if (grid.draggable.dragEnd) {
            grid.draggable.dragEnd();
        } // user cb.
    };

    /**
    *
    * @param {Object} box
    * @param {Object} e
    */
    var moveBox = function moveBox(box, e) {
        if (currState.row !== prevState.row || currState.column !== prevState.column) {

            var validMove = engine.updateBox(box, currState, box);
            // UpdateGrid preview box.
            if (validMove) {
                renderer.setBoxYPosition(grid.shadowBoxElement, currState.row);
                renderer.setBoxXPosition(grid.shadowBoxElement, currState.column);
            }
        }

        // No point in attempting move if not switched to new cell.
        prevState = { row: currState.row, column: currState.column };
    };

    /**
    *
    * @param {Object} box
    * @param {Object} e
    */
    var updateMovingElement = function updateMovingElement(box, e) {
        var maxLeft = grid.element.offsetWidth - grid.xMargin;
        var maxTop = grid.element.offsetHeight - grid.yMargin;

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

        box.element.style.top = eY + 'px';
        box.element.style.left = eX + 'px';

        // Scrolling when close to edge.
        if (e.pageY - document.body.scrollTop < grid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - grid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < grid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + grid.scrollSpeed;
        }

        if (e.pageX - document.body.scrollLeft < grid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - grid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < grid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + grid.scrollSpeed;
        }
    };

    return Object.freeze({
        dragStart: dragStart,
        drag: drag,
        dragEnd: dragEnd
    });
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = Drawer(); /**
                             * gridDraw.js: High-level draw.
                             */

function Drawer(comp) {
    var grid = comp.grid;
    var renderer = comp.renderer;

    var drawElement = void 0;

    var initialize = function initialize() {
        if (grid.displayGrid) {
            createGridDraw();
        }
        createShadowBoxElement();
    };

    /**
     * Creates the draw element which is used to show the vertical and
     *     horizontal lines.
     */
    var createGridDraw = function createGridDraw() {
        if (document.getElementById('draw-element') === null) {
            drawElement = document.createElement('div');
            drawElement.id = 'draw-element';
            grid.element.appendChild(drawElement);
        }
    };

    /**
     * Creates the shadow box element which is used when dragging / resizing
     *     a box. It gets attached to the dragging / resizing box, while
     *     box gets to move / resize freely and snaps back to its original
     *     or new position at drag / resize stop.
     */
    var createShadowBoxElement = function createShadowBoxElement() {
        if (document.getElementById('shadow-box') === null) {
            grid._shadowBoxElement = document.createElement('div');
            grid._shadowBoxElement.id = 'shadow-box';
            grid._shadowBoxElement;
            // background-color: #E8E8E8;
            // transition: none;

            grid._shadowBoxElement.className = 'grid-shadow-box';
            grid._shadowBoxElement.style.position = 'absolute';
            grid._shadowBoxElement.style.display = 'block';
            grid._shadowBoxElement.style.zIndex = '1001';
            grid.element.appendChild(grid._shadowBoxElement);
        }
    };

    /**
     *
     */
    var setGridDimensions = function setGridDimensions() {
        renderer.setRowHeight();
        renderer.setColumnWidth();

        renderer.setGridHeight();
        renderer.setGridWidth();

        renderer.setCellCentroids();
    };

    /**
    *
    */
    var updateGrid = function updateGrid() {
        renderer.setGridHeight();
        renderer.setGridWidth();
    };

    /**
    *
    * @param {Object} box
    */
    var drawBox = function drawBox(box) {
        renderer.setBoxYPosition(box.element, box.row);
        renderer.setBoxXPosition(box.element, box.column);
        renderer.setBoxHeight(box.element, box.rowspan);
        renderer.setBoxWidth(box.element, box.columnspan);
    };

    /**
     *
     */
    var drawGrid = function drawGrid() {
        (0, _utils.removeNodes)(drawElement);

        var htmlString = '';
        // Horizontal lines
        for (var i = 0; i <= grid.numRows; i += 1) {
            htmlString += '<div class=\'horizontal-line\'\n                style=\'top: ' + i * (grid.rowHeight + grid.yMargin) + 'px;\n                    left: 0px;\n                    width: 100%;\n                    height: ' + grid.yMargin + 'px;\'>\n                </div>';
        }

        // Vertical lines
        for (var _i = 0; _i <= grid.numColumns; _i += 1) {
            htmlString += '<div class=\'vertical-line\'\n                style=\'top: 0px;\n                    left: ' + _i * (grid.columnWidth + grid.xMargin) + 'px;\n                    height: 100%;\n                    width: ' + grid.xMargin + 'px;\'>\n                </div>';
        }

        // Draw centroids
        for (var _i2 = 0; _i2 < grid.numRows; _i2 += 1) {
            for (var j = 0; j < grid.numColumns; j += 1) {
                htmlString += '<div class=\'grid-centroid\'\n                    style=\'top: ' + (_i2 * (grid.rowHeight + grid.yMargin) + grid.rowHeight / 2 + grid.yMargin) + 'px;\n                        left: ' + (j * (grid.columnWidth + grid.xMargin) + grid.columnWidth / 2 + grid.xMargin) + 'px;\'>\n                    </div>';
            }
        }

        drawElement.innerHTML = htmlString;
    };

    return Object.freeze({
        initialize: initialize,
        setGridDimensions: setGridDimensions,
        createGridDraw: createGridDraw,
        drawBox: drawBox,
        drawGrid: drawGrid,
        updateGrid: updateGrid
    });
};

},{"./utils.js":13}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Engine;

var _utils = require('./utils.js');

/**
 *
 * @param {Object} box
 * @param {Object} updateTo
 * @param {Object} excludeBox Optional parameter, if updateBox is triggered
 *                            by drag / resize event, then don't update
 *                            the element.
 * @returns {boolean} If update succeeded.
 */
function Engine(comp) {
    var grid = comp.grid;
    var renderer = comp.renderer;
    var drawer = comp.drawer;
    var boxHandler = comp.boxHandler;


    var engineRender = EngineRender({ grid: grid, drawer: drawer, renderer: renderer });
    var engineCore = EngineCore({ grid: grid, boxHandler: boxHandler });

    var initialize = function initialize() {
        engineCore.addBoxes();
        engineRender.renderGrid();
        engineRender.refreshGrid();
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
        var movedBoxes = engineCore.updateBox(box, updateTo);

        if (movedBoxes.length > 0) {
            engineRender.updatePositions(movedBoxes, excludeBox);
            engineRender.renderGrid();

            return true;
        }

        return false;
    };

    /**
    *
    * @param {}
    */
    var removeBox = function removeBox() {
        engineBox.removeBox();
        engineRender.renderGrid();
    };

    /**
    *
    * @param {}
    */
    var resizeBox = function resizeBox() {
        engineRender.updatePositions(movedBoxes); // In case box is not updated by dragging / resizing.
        engineRender.renderGrid();
    };

    /**
    * When dragging / resizing is dropped.
    */
    var dragResizeStart = function dragResizeStart(box) {
        engineCore.incrementNumRows(box, 1);
        engineCore.incrementNumColumns(box, 1);
        engineRender.renderGrid();
    };

    /**
    * When dragging / resizing is dropped.
    */
    var draggingResizing = function draggingResizing(box) {
        // engineCore.incrementNumRows(box, 1);
        // engineCore.incrementNumColumns(box, 1);
        // engineRender.renderGrid();
    };

    /**
    * When dragging / resizing is dropped.
    */
    var dragResizeEnd = function dragResizeEnd() {
        engineCore.decreaseNumRows();
        engineCore.decreaseNumColumns();
        engineRender.renderGrid();
    };

    return Object.freeze({
        initialize: initialize,
        updateBox: updateBox,
        insertBox: engineCore.insertBox,
        removeBox: engineCore.removeBox,
        getBox: engineCore.getBox,
        setActiveBox: engineCore.setActiveBox,
        dragResizeStart: dragResizeStart,
        draggingResizing: draggingResizing,
        dragResizeEnd: dragResizeEnd,
        renderGrid: engineRender.renderGrid,
        refreshGrid: engineRender.refreshGrid
    });
}

/**
 *
 * @param {Function} 5
 * @param {Function} 6
 * @param {Function} 7
 */
function EngineRender(comp) {
    var grid = comp.grid;
    var drawer = comp.drawer;
    var renderer = comp.renderer;

    /**
     * Refresh the grid,
     */

    var refreshGrid = function refreshGrid() {
        drawer.setGridDimensions();
        drawer.drawGrid();
        updatePositions(grid.boxes);
    };

    /**
     * Refresh the grid,
     */
    var renderGrid = function renderGrid() {
        drawer.updateGrid();
        renderer.setCellCentroids();
        drawer.drawGrid();
    };

    /**
    * @param {Object} excludeBox Don't redraw this box.
    * @param {Object} boxes List of boxes to redraw.
    */
    var updatePositions = function updatePositions(boxes, excludeBox) {
        window.requestAnimFrame(function () {
            // UpdateGrid moved boxes css.
            boxes.forEach(function (box) {
                if (excludeBox !== box) {
                    drawer.drawBox(box);
                }
            });
        });
    };

    return Object.freeze({
        refreshGrid: refreshGrid,
        renderGrid: renderGrid,
        updatePositions: updatePositions
    });
}

/**
 * @description Handles collision logic and grid dimension.
 * @param {Function} 5
 * @param {Function} 6
 * @param {Function} 7
 */
function EngineCore(comp) {
    var grid = comp.grid;
    var boxHandler = comp.boxHandler;

    var boxes = void 0,
        movingBox = void 0,
        movedBoxes = void 0;

    var addBoxes = function addBoxes() {
        for (var i = 0, len = grid.boxes.length; i < len; i++) {
            boxHandler.createBox(grid.boxes[i]);
        }
        boxes = grid.boxes;
    };

    var getBox = function getBox(element) {
        for (var i = boxes.length - 1; i >= 0; i--) {
            if (boxes[i].element === element) {
                return boxes[i];
            }
        };
    };

    var copyBox = function copyBox(box) {
        return {
            row: box.row,
            column: box.column,
            rowspan: box.rowspan,
            columnspan: box.columnspan
        };
    };

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

    var restoreOldPositions = function restoreOldPositions(prevPositions) {
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].row = prevPositions[i].row, boxes[i].column = prevPositions[i].column, boxes[i].columnspan = prevPositions[i].columnspan, boxes[i].rowspan = prevPositions[i].rowspan;
        };
    };

    var removeBox = function removeBox(boxIndex) {
        var elem = boxes[boxIndex].element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

        updateNumRows();
        updateNumColumns();
    };

    /**
    * Insert a box. Box must contain at least the size and position of the box,
    * content element is optional.
    * @param {Object} box Box dimensions.
    * @returns {Boolean} If insert was possible.
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
     * @returns {Array} movedBoxes
     */
    var updateBox = function updateBox(box, updateTo) {
        movingBox = box;

        var prevPositions = copyBoxes();

        makeChange(box, updateTo);
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
    * If a dimension state is not added, use the box current state.
    * @param {Object} box Box which is updating.
    * @param {Object} updateTo New dimension state.
    * @returns {Boolean}
    */
    var makeChange = function makeChange(box, updateTo) {
        if (updateTo.row !== undefined) {
            box.row = updateTo.row;
        }
        if (updateTo.column !== undefined) {
            box.column = updateTo.column;
        }
        if (updateTo.rowspan !== undefined) {
            box.rowspan = updateTo.rowspan;
        }
        if (updateTo.columnspan !== undefined) {
            box.columnspan = updateTo.columnspan;
        }
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {Object} box
     * @param {objects} excludeBox
     * @param {objects} movedBoxes
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
     * @param {objects} excludeBox
     * @param {Object} movedBoxes
     * @return {bool} If move is allowed
     */
    var collisionHandler = function collisionHandler(box, boxB, excludeBox, movedBoxes) {
        setBoxPosition(box, boxB);
        return moveBox(boxB, excludeBox, movedBoxes);
    };

    /**
    * Calculates new box position based on the box that pushed it.
    * @param {Object} box Box which has moved.
    * @param {Object} boxB Box which is to be moved.
    * @returns {Boolean}
    */
    var setBoxPosition = function setBoxPosition(box, boxB) {
        boxB.row += box.row + box.rowspan - boxB.row;
    };

    /**
     * Given a box, finds other boxes which intersect with it.
     * @param {Object} box
     * @param {Array} excludeBox Array of boxes.
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
    *
    * @param {}
    * @returns {Boolean}
    */
    var updateNumColumns = function updateNumColumns() {
        var currentMaxColumn = (0, _utils.getMaxObj)(boxes, 'column', 'columnspan');

        if (currentMaxColumn >= grid.minColumns) {
            grid.numColumns = currentMaxColumn;
        }

        if (grid.numColumns - movingBox.column - movingBox.columnspan < 1) {
            grid.numColumns += 1;
        } else if (grid.numColumns - movingBox.column - movingBox.columnspan > 1 && movingBox.column + movingBox.columnspan === currentMaxColumn && grid.numColumns > grid.minColumns) {
            grid.numColumns = currentMaxColumn + 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    var incrementNumColumns = function incrementNumColumns(box, numColumns) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if (box.column + box.columnspan === grid.numColumns && grid.numColumns < grid.maxColumns) {
            grid.numColumns += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest leftward box.
     * @param box {Object}
     * @returns boolean true if increase else false.
     */
    var decreaseNumColumns = function decreaseNumColumns() {
        var maxColumnNum = 0;

        // Expand / Decrease number of grid.numRows if needed.
        var box = (0, _utils.getMaxObj)(boxes, 'x');

        boxes.forEach(function (boxB) {
            if (maxColumnNum < boxB.column + boxB.columnspan) {
                maxColumnNum = boxB.column + boxB.columnspan;
            }
        });

        if (maxColumnNum < grid.numColumns) {
            grid.numColumns = maxColumnNum;
        }
        if (maxColumnNum < grid.minColumns) {
            grid.numColumns = grid.minColumns;
        }

        return true;
    };

    /**
     * Number rows depends on three things.
     *  1. Min / Max Rows.
     *  2. Max Box.
     *  3. Dragging box near bottom border.
     *
     * @param {bool} isDragging
     */
    var updateNumRows = function updateNumRows() {
        var currentMaxRow = (0, _utils.getMaxObj)(boxes, 'row', 'rowspan');

        if (currentMaxRow >= grid.minRows) {
            grid.numRows = currentMaxRow;
        }

        // Moving box when close to border.
        if (grid.numRows - movingBox.row - movingBox.rowspan < 1 && grid.numRows < grid.maxRows) {
            grid.numRows += 1;
        } else if (grid.numRows - movingBox.row - movingBox.rowspan > 1 && movingBox.row + movingBox.rowspan === currentMaxRow && grid.numRows > grid.minRows && grid.numRows < grid.maxRows) {
            grid.numRows = currentMaxRow + 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    var incrementNumRows = function incrementNumRows(box, numRows) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if (box.row + box.rowspan === grid.numRows && grid.numRows < grid.maxRows) {
            grid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest downward box.
     * @param box {Object}
     * @returns boolean true if increase else false.
     */
    var decreaseNumRows = function decreaseNumRows() {
        var maxRowNum = 0;

        boxes.forEach(function (boxB) {
            if (maxRowNum < boxB.row + boxB.rowspan) {
                maxRowNum = boxB.row + boxB.rowspan;
            }
        });

        if (maxRowNum < grid.numRows) {
            grid.numRows = maxRowNum;
        }
        if (maxRowNum < grid.minRows) {
            grid.numRows = grid.minRows;
        }

        return true;
    };

    /**
    * Checks min, max box-size.
    * @param {}
    * @returns {Boolean}
    */
    var isUpdateValid = function isUpdateValid(box) {
        if (box.rowspan < grid.minRowspan || box.rowspan > grid.maxRowspan || box.columnspan < grid.minColumnspan || box.columnspan > grid.maxColumnspan) {
            return false;
        }

        return true;
    };

    /**
     * Handles border collisions by reverting back to closest edge point.
     * @param box object
     * @returns boolean True if collided and cannot move wall else false.
     */
    var isBoxOutsideBoundary = function isBoxOutsideBoundary(box) {
        // Top and left border.
        if (box.column < 0 || box.row < 0) {
            return true;
        }

        // Right and bottom border.
        if (box.row + box.rowspan > grid.maxRows || box.column + box.columnspan > grid.maxColumns) {
            return true;
        }

        return false;
    };

    return Object.freeze({
        addBoxes: addBoxes,
        updateBox: updateBox,
        incrementNumRows: incrementNumRows,
        incrementNumColumns: incrementNumColumns,
        decreaseNumRows: decreaseNumRows,
        decreaseNumColumns: decreaseNumColumns,
        getBox: getBox,
        insertBox: insertBox,
        removeBox: removeBox
    });
}

},{"./utils.js":13}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = MouseHandler;

var _utils = require('./utils');

function MouseHandler(comp) {
    var dragger = comp.dragger;
    var resizer = comp.resizer;
    var grid = comp.grid;
    var engine = comp.engine;


    var inputTags = ['select', 'input', 'textarea', 'button'];

    function initialize() {
        grid.element.addEventListener('mousedown', function (e) {
            mouseDown(e, grid.element);e.preventDefault();
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
        if (node.className.indexOf('handle') > -1) {
            handleEvent(e, resizeEvent);
        } else if (node.className.indexOf('dashgridBox') > -1) {
            handleEvent(e, dragEvent);
        } else if (node.className.indexOf(grid.draggable.handle) > -1) {
            handleEvent(e, dragEvent);
        }
    }

    function handleEvent(e, cb) {
        var boxElement = (0, _utils.findParent)(e.target, 'dashgridBox');
        var box = engine.getBox(boxElement);
        if (box) {
            // engine.setActiveBox(box);
            cb(box, e);
        }
    }

    function dragEvent(box, e) {
        if (!grid.draggable.enabled || !box.draggable) {
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
            // engine.setActiveBox({});
        }
    }

    function resizeEvent(box, e) {
        if (!grid.resizable.enabled || !box.resizable) {
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
        initialize: initialize
    });
} /**
   * mouseHandler.js: Initializes and sets up the events for dragging / resizing.
   */

},{"./utils":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Render;


function Render(comp) {
    var grid = comp.grid;

    // Start row / column denotes the pixel at which each cell starts at.

    var startColumn = [];
    var startRow = [];

    var setGridWidth = function setGridWidth() {
        grid.element.style.width = grid.columnWidth ? grid.columnWidth * grid.numColumns + (grid.numColumns + 1) * grid.xMargin + 'px' : grid.element.parentNode.offsetWidth + 'px';
    };

    var setColumnWidth = function setColumnWidth() {
        grid.columnWidth = grid.columnWidth ? grid.columnWidth : (grid.element.parentNode.offsetWidth - (grid.numColumns + 1) * grid.xMargin) / grid.numColumns;
    };

    var setGridHeight = function setGridHeight() {
        grid.element.style.height = grid.rowHeight ? grid.rowHeight * grid.numRows + (grid.numRows + 1) * grid.yMargin + 'px' : grid.element.parentNode.offsetHeight + 'px';
    };

    var setRowHeight = function setRowHeight() {
        grid.rowHeight = grid.rowHeight ? grid.rowHeight : (grid.element.parentNode.offsetHeight - (grid.numRows + 1) * grid.yMargin) / grid.numRows;
    };

    var setBoxXPosition = function setBoxXPosition(element, column) {
        element.style.left = column * grid.columnWidth + grid.xMargin * (column + 1) + 'px';
    };

    var setBoxYPosition = function setBoxYPosition(element, row) {
        element.style.top = row * grid.rowHeight + grid.yMargin * (row + 1) + 'px';
    };

    var setBoxWidth = function setBoxWidth(element, columnspan) {
        element.style.width = columnspan * grid.columnWidth + grid.xMargin * (columnspan - 1) + 'px';
    };

    var setBoxHeight = function setBoxHeight(element, rowspan) {
        element.style.height = rowspan * grid.rowHeight + grid.yMargin * (rowspan - 1) + 'px';
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

        for (var i = 0; i < grid.numRows; i += 1) {
            start = i * (grid.rowHeight + grid.yMargin) + grid.yMargin / 2;
            stop = start + grid.rowHeight + grid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (var _i = 0; _i < grid.numColumns; _i += 1) {
            start = _i * (grid.columnWidth + grid.xMargin) + grid.xMargin / 2;
            stop = start + grid.columnWidth + grid.xMargin;
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
        for (var i = 0; i < grid.numRows; i += 1) {
            if (top >= startRow[i][0] && top <= startRow[i][1]) {
                boxTop = i;
            }
            if (bottom >= startRow[i][0] && bottom <= startRow[i][1]) {
                boxBottom = i;
            }
        }

        // Find left and right intersection cell column.
        for (var j = 0; j < grid.numColumns; j += 1) {
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
            rightOverlap = Math.abs(right - startColumn[boxRight][1] - grid.xMargin);
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
            bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - grid.yMargin);
            if (topOverlap <= bottomOverlap) {
                row = boxTop;
            } else {
                row = boxTop + 1;
            }
        }

        return { row: row, column: column };
    };

    return Object.freeze({
        setCellCentroids: setCellCentroids,
        setColumnWidth: setColumnWidth,
        setRowHeight: setRowHeight,
        setGridHeight: setGridHeight,
        setGridWidth: setGridWidth,
        setBoxXPosition: setBoxXPosition,
        setBoxYPosition: setBoxYPosition,
        setBoxWidth: setBoxWidth,
        setBoxHeight: setBoxHeight,
        findIntersectedCells: findIntersectedCells,
        getClosestCells: getClosestCells
    });
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Resizer;


function Resizer(comp) {
    var grid = comp.grid;
    var renderer = comp.renderer;
    var engine = comp.engine;


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
    * Set active box, create shadowbox, remove smooth transitions for box,
    * and initialize mouse variables. Finally, make call to api to check if,
    * any box is close to bottom / right edge.
    * @param {}
    * @returns
    */
    var resizeStart = function resizeStart(box, e) {
        className = e.target.className;

        // Removes transitions, displays and initializes positions for preview box.
        box.element.style.transition = 'None';
        grid.shadowBoxElement.style.left = box.element.style.left;
        grid.shadowBoxElement.style.top = box.element.style.top;
        grid.shadowBoxElement.style.width = box.element.style.width;
        grid.shadowBoxElement.style.height = box.element.style.height;
        grid.shadowBoxElement.style.display = 'block';

        // Mouse values.
        minWidth = grid.columnWidth;
        minHeight = grid.rowHeight;
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        elementLeft = parseInt(box.element.style.left, 10);
        elementTop = parseInt(box.element.style.top, 10);
        elementWidth = box.element.offsetWidth;
        elementHeight = box.element.offsetHeight;

        engine.updateNumRows(true);
        engine.updateNumColumns(true);
        engine.updateDimensionState();

        if (grid.resizable.resizeStart) {
            grid.resizable.resizeStart();
        } // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    var resize = function resize(box, e) {
        updateResizingElement(box, e);

        if (grid.liveChanges) {
            // Which cell to snap shadowbox to.

            var _renderer$findInterse = renderer.findIntersectedCells({
                left: box.element.offsetLeft,
                right: box.element.offsetLeft + box.element.offsetWidth,
                top: box.element.offsetTop,
                bottom: box.element.offsetTop + box.element.offsetHeight
            });

            var boxLeft = _renderer$findInterse.boxLeft;
            var boxRight = _renderer$findInterse.boxRight;
            var boxTop = _renderer$findInterse.boxTop;
            var boxBottom = _renderer$findInterse.boxBottom;


            newState = { row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1 };
            resizeBox(box, e);
        }

        if (grid.resizable.resizing) {
            grid.resizable.resizing();
        } // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    var resizeEnd = function resizeEnd(box, e) {
        if (!grid.liveChanges) {
            var _renderer$findInterse2 = renderer.findIntersectedCells({
                left: box.element.offsetLeft,
                right: box.element.offsetLeft + box.element.offsetWidth,
                top: box.element.offsetTop,
                bottom: box.element.offsetTop + box.element.offsetHeight,
                numRows: engine.getNumRows(),
                numColumns: engine.getNumColumns()
            });

            var boxLeft = _renderer$findInterse2.boxLeft;
            var boxRight = _renderer$findInterse2.boxRight;
            var boxTop = _renderer$findInterse2.boxTop;
            var boxBottom = _renderer$findInterse2.boxBottom;

            newState = { row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1 };
            resizeBox(box, e);
        }

        box.element.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
        box.element.style.left = grid.shadowBoxElement.style.left;
        box.element.style.top = grid.shadowBoxElement.style.top;
        box.element.style.width = grid.shadowBoxElement.style.width;
        box.element.style.height = grid.shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = 'none';

            engine.updateNumRows(false);
            engine.updateNumColumns(false);
            engine.updateDimensionState();
        }, grid.snapback);

        if (grid.resizable.resizeEnd) {
            grid.resizable.resizeEnd();
        } // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    var resizeBox = function resizeBox(box, e) {
        if (newState.row !== prevState.row || newState.column !== prevState.column || newState.rowspan !== prevState.rowspan || newState.columnspan !== prevState.columnspan) {

            var update = engine.updateBox(box, newState);

            // UpdateGrid preview box.
            if (update) {
                renderer.setBoxXPosition(grid.shadowBoxElement, update.column);
                renderer.setBoxYPosition(grid.shadowBoxElement, update.row);
                renderer.setBoxWidth(grid.shadowBoxElement, update.columnspan);
                renderer.setBoxHeight(grid.shadowBoxElement, update.rowspan);
            }
        }

        // No point in attempting update if not switched to new cell.
        prevState.row = newState.row;
        prevState.column = newState.column;
        prevState.rowspan = newState.rowspan;
        prevState.columnspan = newState.columnspan;

        if (grid.resizable.resizing) {
            grid.resizable.resizing();
        } // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    var updateResizingElement = function updateResizingElement(box, e) {
        // Get the current mouse position.
        mouseX = e.pageX + window.scrollX;
        mouseY = e.pageY + window.scrollY;

        // Get the deltas
        var diffX = mouseX - lastMouseX + mOffX;
        var diffY = mouseY - lastMouseY + mOffY;
        mOffX = mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        var dY = diffY;
        var dX = diffX;

        minTop = grid.yMargin;
        maxTop = grid.element.offsetHeight - grid.yMargin;
        minLeft = grid.xMargin;
        maxLeft = grid.element.offsetWidth - grid.xMargin;

        if (className.indexOf('grid-box-handle-w') > -1 || className.indexOf('grid-box-handle-nw') > -1 || className.indexOf('grid-box-handle-sw') > -1) {
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

        if (className.indexOf('grid-box-handle-e') > -1 || className.indexOf('grid-box-handle-ne') > -1 || className.indexOf('grid-box-handle-se') > -1) {
            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxLeft) {
                diffX = maxLeft - elementLeft - elementWidth;
                mOffX = dX - diffX;
            }
            elementWidth += diffX;
        }

        if (className.indexOf('grid-box-handle-n') > -1 || className.indexOf('grid-box-handle-nw') > -1 || className.indexOf('grid-box-handle-ne') > -1) {
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

        if (className.indexOf('grid-box-handle-s') > -1 || className.indexOf('grid-box-handle-sw') > -1 || className.indexOf('grid-box-handle-se') > -1) {
            if (elementHeight + dY < minHeight) {
                diffY = minHeight - elementHeight;
                mOffY = dY - diffY;
            } else if (elementTop + elementHeight + dY > maxTop) {
                diffY = maxTop - elementTop - elementHeight;
                mOffY = dY - diffY;
            }
            elementHeight += diffY;
        }

        box.element.style.top = elementTop + 'px';
        box.element.style.left = elementLeft + 'px';
        box.element.style.width = elementWidth + 'px';
        box.element.style.height = elementHeight + 'px';
    };

    return Object.freeze({
        resizeStart: resizeStart,
        resize: resize,
        resizeEnd: resizeEnd
    });
}

},{}],12:[function(require,module,exports){
"use strict";

// shim layer with setTimeout fallback for requiestAnimationFrame
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        cb = cb || function () {};
        window.setTimeout(cb, 1000 / 60);
    };
}();

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMaxObj = getMaxObj;
exports.getSortedArr = getSortedArr;
exports.insertByOrder = insertByOrder;
exports.insertionSort = insertionSort;
exports.ObjectLength = ObjectLength;
exports.addEvent = addEvent;
exports.parseArrayOfJSON = parseArrayOfJSON;
exports.removeNodes = removeNodes;
exports.findParent = findParent;

/**
* 
* @param {}  
* @returns 
*/
function getMaxObj(box, at1, at2) {
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
* @param {}  
* @returns 
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
* Returns a new array with the newly inserted object.
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
* @param {}
* @returns
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
* @param {}
* @returns
*/
function ObjectLength(object) {
    var length = 0,
        key = void 0;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            length += 1;
        }
    }
    return length;
}

/**
*
* @param {}
* @returns
*/
function addEvent(elem, type, eventHandle) {
    if (elem === null || typeof elem === 'undefined') return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = eventHandle;
    }
}

/**
*
* @param {}
* @returns
*/
function parseArrayOfJSON(dataFromServer) {
    var parsedJSON = JSON.parse(dataFromServer.d);
    for (var i = 0; i < parsedJSON.length; i += 1) {
        alert(parsedJSON[i].Id);
    }
}

/**
*
* @param {}
* @returns
*/
function removeNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
*
* @param {Object} node
* @param {String} className
* @returns {Boolean}
*/
function findParent(node, className) {
    while (node.nodeType === 1 && node !== document.body) {
        if (node.className.indexOf(className) > -1) {
            return node;
        }
        node = node.parentNode;
    }
    return false;
}

},{}]},{},[2]);
