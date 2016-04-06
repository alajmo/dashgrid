(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var css = "body,\nhtml {\n  width: 100%;\n  height: 100%;\n  font-size: 1.25em;\n  margin: 0;\n  padding: 0;\n  font-family: arial;\n  color: #444444;\n}\n.dashgridContainer {\n  position: relative;\n  top: 1%;\n  margin: 0 auto;\n  width: 98%;\n  height: 98%;\n  /*height: 800px;*/\n  display: block;\n}\n.grid,\n.grid-box,\n.grid-shadow-box {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.dashgrid {\n  background: #F9F9F9;\n  position: relative;\n  display: block;\n}\n.dashgridBox {\n  background: #E1E1E1;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.dragHandle {\n  width: 100%;\n  height: 100px;\n  background: red;\n}\n/**\n * GRID DRAW HELPERS.\n */\n.horizontal-line,\n.vertical-line {\n  background: #FFFFFF;\n  position: absolute;\n}\n.grid-centroid {\n  position: absolute;\n  background: #000000;\n  width: 5px;\n  height: 5px;\n}\n.dashgridBox {\n  position: absolute;\n  cursor: move;\n  transition: opacity .3s, left .3s, top .3s, width .3s, height .3s;\n  z-index: 1002;\n}\n.grid-shadow-box {\n  background-color: #E8E8E8;\n  transition: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "demo/demo.css"})); module.exports = css;
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
    elem.className = 'dashgridBox';

    var elemTwo = document.createElement('div');
    elemTwo.className = 'dashgridBox';

    var elemThree = document.createElement('div');
    elemThree.className = 'dashgridBox';

    boxes = [{ row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem }, { row: 2, column: 1, rowspan: 4, columnspan: 2, content: elemTwo }, { row: 15, column: 3, rowspan: 2, columnspan: 2, content: elemThree }];
    // boxes = fillCells(numRows, numColumns);

    var grid = (0, _dashgrid2.default)(document.getElementById('grid'), {
        boxes: boxes,
        floating: true,

        xMargin: 20,
        yMargin: 20,

        draggable: { enabled: true, handle: 'dashgridBox' },

        rowHeight: 80,
        numRows: numRows,
        minRows: numRows,
        maxRows: 25,

        columnWidth: 80,
        numColumns: numColumns,
        minColumns: numColumns,
        maxColumns: 2,

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
            box._element.appendChild(box.content);
        }
        grid._element.appendChild(box._element);
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

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
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

    var scrollHeight = grid._element.scrollHeight;

    /**
     * Create shadowbox, remove smooth transitions for box,
     * and initialize mouse variables. Finally, make call to api to check if,
     * any box is close to bottom / right
     * @param {Object} box
     * @param {Object} e
     */
    var dragStart = function dragStart(box, e) {
        box._element.style.transition = 'None';
        grid._shadowBoxElement.style.left = box._element.style.left;
        grid._shadowBoxElement.style.top = box._element.style.top;
        grid._shadowBoxElement.style.width = box._element.style.width;
        grid._shadowBoxElement.style.height = box._element.style.height;
        grid._shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        eX = parseInt(box._element.offsetLeft, 10);
        eY = parseInt(box._element.offsetTop, 10);
        eW = parseInt(box._element.offsetWidth, 10);
        eH = parseInt(box._element.offsetHeight, 10);

        scrollHeight = grid._element.scrollHeight;

        engine.dragResizeStart(box);

        if (grid.draggable.dragStart) {
            grid.draggable.dragStart();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var drag = function drag(box, e) {
        updateMovingElement(box, e);
        engine.draggingResizing(box);

        if (grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });

            moveBox(box, e);
        }

        if (grid.draggable.dragging) {
            grid.draggable.dragging();
        } // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    var dragEnd = function dragEnd(box, e) {
        if (!grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        box._element.style.transition = grid.transition;
        box._element.style.left = grid._shadowBoxElement.style.left;
        box._element.style.top = grid._shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid._shadowBoxElement.style.display = 'none';
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

            var prevScrollHeight = grid._element.offsetHeight - window.innerHeight;
            var prevScrollWidth = grid._element.offsetWidth - window.innerWidth;
            var validMove = engine.updateBox(box, currState, box);

            // updateGridDimension preview box.
            if (validMove) {
                renderer.setBoxYPosition(grid._shadowBoxElement, currState.row);
                renderer.setBoxXPosition(grid._shadowBoxElement, currState.column);

                var postScrollHeight = grid._element.offsetHeight - window.innerHeight;
                var postScrollWidth = grid._element.offsetWidth - window.innerWidth;

                // Account for minimizing scroll height when moving box upwards.
                // Otherwise bug happens where the dragged box is changed but directly
                // afterwards the grid element dimension is changed.

                if (Math.abs(grid._element.offsetHeight - window.innerHeight - window.scrollY) < 30 && window.scrollY > 0 && prevScrollHeight !== postScrollHeight) {
                    box._element.style.top = box._element.offsetTop - 100 + 'px';
                }

                if (Math.abs(grid._element.offsetWidth - window.innerWidth - window.scrollX) < 30 && window.scrollX > 0 && prevScrollWidth !== postScrollWidth) {

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
        var maxLeft = grid._element.offsetWidth - grid.xMargin;
        var maxTop = grid._element.offsetHeight - grid.yMargin;

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

        scrollHeight = grid._element.scrollHeight;

        // Scrolling when close to bottom edge.
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

exports.default = Drawer; /**
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
            grid._element.appendChild(drawElement);
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
            grid._element.appendChild(grid._shadowBoxElement);
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
    var updateGridDimension = function updateGridDimension() {
        renderer.setGridHeight();
        renderer.setGridWidth();
    };

    /**
    *
    * @param {Object} box
    */
    var drawBox = function drawBox(box) {
        renderer.setBoxYPosition(box._element, box.row);
        renderer.setBoxXPosition(box._element, box.column);
        renderer.setBoxHeight(box._element, box.rowspan);
        renderer.setBoxWidth(box._element, box.columnspan);
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
        updateGridDimension: updateGridDimension
    });
};

},{"./utils.js":13}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

exports.default = Engine;

/**
 *
 * @param {Object} box
 * @param {Object} updateTo
 * @param {Object} excludeBox Optional parameter, if updateBox is triggered
 *                            by drag / resize event, then don't update
 *                            the element.
 * @returns {boolean} If update succeeded.
 */

function Engine(obj) {
    var grid = obj.grid;
    var renderer = obj.renderer;
    var drawer = obj.drawer;
    var boxHandler = obj.boxHandler;


    var engineRender = EngineRender({ grid: grid, drawer: drawer, renderer: renderer });
    var engineCore = EngineCore({ grid: grid, boxHandler: boxHandler });

    /**
     * Initialization function that creates the necessary box elements and checks
     * that the boxes input is correct.
     */
    var initialize = function initialize() {
        engineCore.createBoxElements();
        engineCore.updateNumRows();
        engineCore.updateNumColumns();
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
     * Removes a box.
     * @param {Object} box
     */
    var removeBox = function removeBox(box) {
        engineBox.removeBox();
        engineRender.renderGrid();
    };

    /**
     * Resizes a box.
     * @param {Object} box
     */
    var resizeBox = function resizeBox(box) {
        // In case box is not updated by dragging / resizing.
        engineRender.updatePositions(movedBoxes);
        engineRender.renderGrid();
    };

    /**
     * Called when either resize or drag starts.
     * @param {Object} box
     */
    var dragResizeStart = function dragResizeStart(box) {
        engineCore.increaseNumRows(box, 1);
        engineCore.increaseNumColumns(box, 1);
        engineRender.renderGrid();
    };

    /**
     * When dragging / resizing is dropped.
     * @param {Object} box
     */
    var draggingResizing = function draggingResizing(box) {
        // engineCore.increaseNumRows(box, 1);
        // engineCore.increaseNumColumns(box, 1);
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
function EngineRender(obj) {
    var grid = obj.grid;
    var drawer = obj.drawer;
    var renderer = obj.renderer;

    /**
     * Refresh the grid,
     */

    var renderGrid = function renderGrid() {
        drawer.updateGridDimension();
        renderer.setCellCentroids();
        drawer.drawGrid();
    };

    /**
     * Refresh the grid,
     */
    var refreshGrid = function refreshGrid() {
        drawer.setGridDimensions();
        drawer.drawGrid();
        updatePositions(grid.boxes);
    };

    /**
     * @param {Object} excludeBox Don't redraw this box.
     * @param {Object} boxes List of boxes to redraw.
     */
    var updatePositions = function updatePositions(boxes, excludeBox) {
        window.requestAnimFrame(function () {
            // updateGridDimension moved boxes css.
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
 * @param {Object} obj
 */
function EngineCore(obj) {
    var grid = obj.grid;
    var boxHandler = obj.boxHandler;

    var boxes = void 0,
        movingBox = void 0,
        movedBoxes = void 0;

    /**
     * Add
     * @param {}
     * @returns
     */
    var createBoxElements = function createBoxElements() {
        for (var i = 0, len = grid.boxes.length; i < len; i++) {
            boxHandler.createBox(grid.boxes[i]);
        }
        boxes = grid.boxes;
    };

    /**
     * Given a DOM element, retrieve corresponding js object from boxes.
     * @param {Object} element
     * @returns
     */
    var getBox = function getBox(element) {
        for (var i = boxes.length - 1; i >= 0; i--) {
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
     * Remove a box.
     * @param {number} boxIndex
     */
    var removeBox = function removeBox(boxIndex) {
        var elem = boxes[boxIndex]._element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

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

        if (maxColumn >= grid.minColumns) {
            grid.numColumns = maxColumn;
        }

        if (!movingBox) {
            return;
        }

        if (grid.numColumns - movingBox.column - movingBox.columnspan === 0 && grid.numColumns < grid.maxColumns) {
            grid.numColumns += 1;
        } else if (grid.numColumns - movingBox.column - movingBox.columnspan > 1 && movingBox.column + movingBox.columnspan === maxColumn && grid.numColumns > grid.minColumns && grid.numColumns < grid.maxColumns) {
            grid.numcolumns = maxColumn + 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param {Object} box
     * @param {number} numColumns
     * @returns {boolean} true if increase else false.
     */
    var increaseNumColumns = function increaseNumColumns(box, numColumns) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts and moving box is close to bottom border.
        if (box.column + box.columnspan === grid.numColumns && grid.numColumns < grid.maxColumns) {
            grid.numColumns += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest leftward box.
     * @returns boolean true if increase else false.
     */
    var decreaseNumColumns = function decreaseNumColumns() {
        var maxColumnNum = 0;

        boxes.forEach(function (box) {
            if (maxColumnNum < box.column + box.columnspan) {
                maxColumnNum = box.column + box.columnspan;
            }
        });

        if (maxColumnNum < grid.numColumns) {
            grid.numColumns = maxColumnNum;
        }
        if (maxColumnNum < grid.minRows) {
            grid.numColumns = grid.minRows;
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

        if (maxRow >= grid.minRows) {
            grid.numRows = maxRow;
        }

        if (!movingBox) {
            return;
        }

        // Moving box when close to border.
        if (grid.numRows - movingBox.row - movingBox.rowspan === 0 && grid.numRows < grid.maxRows) {
            grid.numRows += 1;
        } else if (grid.numRows - movingBox.row - movingBox.rowspan > 1 && movingBox.row + movingBox.rowspan === maxRow && grid.numRows > grid.minRows && grid.numRows < grid.maxRows) {
            grid.numRows = maxRow + 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    var increaseNumRows = function increaseNumRows(box, numRows) {
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
     * @returns {boolean} true if increase else false.
     */
    var decreaseNumRows = function decreaseNumRows() {
        var maxRowNum = 0;

        boxes.forEach(function (box) {
            if (maxRowNum < box.row + box.rowspan) {
                maxRowNum = box.row + box.rowspan;
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
     * @param {Object} box
     * @returns {boolean}
     */
    var isUpdateValid = function isUpdateValid(box) {
        if (box.rowspan < grid.minRowspan || box.rowspan > grid.maxRowspan || box.columnspan < grid.minColumnspan || box.columnspan > grid.maxColumnspan) {
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
        if (box.row + box.rowspan > grid.maxRows || box.column + box.columnspan > grid.maxColumns) {
            return true;
        }

        return false;
    };

    return Object.freeze({
        createBoxElements: createBoxElements,
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
        grid._element.addEventListener('mousedown', function (e) {
            mouseDown(e, grid._element);e.preventDefault();
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

        var box = engine.getBox(boxElement.parentElement);
        if (box) {
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
        grid._element.style.width = grid.columnWidth ? grid.columnWidth * grid.numColumns + (grid.numColumns + 1) * grid.xMargin + 'px' : grid._element.parentNode.offsetWidth + 'px';
    };

    var setColumnWidth = function setColumnWidth() {
        grid.columnWidth = grid.columnWidth ? grid.columnWidth : (grid._element.parentNode.offsetWidth - (grid.numColumns + 1) * grid.xMargin) / grid.numColumns;
    };

    var setGridHeight = function setGridHeight() {
        grid._element.style.height = grid.rowHeight ? grid.rowHeight * grid.numRows + (grid.numRows + 1) * grid.yMargin + 'px' : grid._element.parentNode.offsetHeight + 'px';
    };

    var setRowHeight = function setRowHeight() {
        grid.rowHeight = grid.rowHeight ? grid.rowHeight : (grid._element.parentNode.offsetHeight - (grid.numRows + 1) * grid.yMargin) / grid.numRows;
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

            // updateGridDimension preview box.
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
        maxTop = grid._element.offsetHeight - grid.yMargin;
        minLeft = grid.xMargin;
        maxLeft = grid._element.offsetWidth - grid.xMargin;

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
exports.getMaxNum = getMaxNum;
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2RlbW8uY3NzIiwiZGVtby9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktY3NzL2Jyb3dzZXIuanMiLCJzcmMvYm94LmpzIiwic3JjL2Rhc2hncmlkLmpzIiwic3JjL2RyYWcuanMiLCJzcmMvZHJhd2VyLmpzIiwic3JjL2VuZ2luZS5qcyIsInNyYy9tb3VzZS5qcyIsInNyYy9yZW5kZXJlci5qcyIsInNyYy9yZXNpemUuanMiLCJzcmMvc2hpbXMuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFFQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JELFdBRHFEO0NBQVgsQ0FBOUM7O0FBSUEsU0FBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLFVBQTVCLEVBQXdDO0FBQ3BDLFFBQUksYUFBSixDQURvQztBQUVwQyxRQUFJLFdBQVcsRUFBWCxDQUZnQztBQUdwQyxRQUFJLEtBQUssQ0FBTCxDQUhnQztBQUlwQyxTQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFKLEVBQWEsS0FBSyxDQUFMLEVBQVE7QUFDakMsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksVUFBSixFQUFnQixLQUFLLENBQUwsRUFBUTtBQUNwQyxtQkFBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUCxDQURvQztBQUVwQyxpQkFBSyxTQUFMLEdBQWlCLFlBQWpCLENBRm9DO0FBR3BDLGlCQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLE1BQW5CLENBSG9DO0FBSXBDLGlCQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQXBCLENBSm9DO0FBS3BDLGtCQUFNLENBQU4sQ0FMb0M7QUFNcEMscUJBQVMsSUFBVCxDQUFjLEVBQUMsS0FBSyxDQUFMLEVBQVEsUUFBUSxDQUFSLEVB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UUFBSSxhQUFhLEtBQUssS0FBTCxDQUFXLGVBQWUsQ0FBZixDQUF4QixDQUR3QztBQUU1QyxTQUFLLElBQUksSUFBSSxDQUFKLEVBQU0sSUFBSSxXQUFXLE1BQVgsRUFBbUIsS0FBSyxDQUFMLEVBQVE7QUFDMUMsY0FBTSxXQUFXLENBQVgsRUFBYyxFQUFkLENBQU4sQ0FEMEM7S0FBOUM7Q0FGRzs7Ozs7OztBQVlBLFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtBQUNqQyxXQUFPLFFBQVEsVUFBUixFQUFvQjtBQUFDLGdCQUFRLFdBQVIsQ0FBb0IsUUFBUSxVQUFSLENBQXBCLENBQUQ7S0FBM0I7Q0FERzs7Ozs7Ozs7QUFVQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUM7QUFDeEMsV0FBTyxLQUFLLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIsU0FBUyxTQUFTLElBQVQsRUFBZTtBQUNsRCxZQUFJLEtBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsU0FBdkIsSUFBb0MsQ0FBQyxDQUFELEVBQUk7QUFBQyxtQkFBTyxJQUFQLENBQUQ7U0FBNUM7QUFDQSxlQUFPLEtBQUssVUFBTCxDQUYyQztLQUF0RDtBQUlBLFdBQU8sS0FBUCxDQUx3QztDQUFyQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY3NzID0gXCJib2R5LFxcbmh0bWwge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBmb250LXNpemU6IDEuMjVlbTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LWZhbWlseTogYXJpYWw7XFxuICBjb2xvcjogIzQ0NDQ0NDtcXG59XFxuLmRhc2hncmlkQ29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHRvcDogMSU7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIHdpZHRoOiA5OCU7XFxuICBoZWlnaHQ6IDk4JTtcXG4gIC8qaGVpZ2h0OiA4MDBweDsqL1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbi5ncmlkLFxcbi5ncmlkLWJveCxcXG4uZ3JpZC1zaGFkb3ctYm94IHtcXG4gIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcbi5kYXNoZ3JpZCB7XFxuICBiYWNrZ3JvdW5kOiAjRjlGOUY5O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbi5kYXNoZ3JpZEJveCB7XFxuICBiYWNrZ3JvdW5kOiAjRTFFMUUxO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbn1cXG4uZHJhZ0hhbmRsZSB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwcHg7XFxuICBiYWNrZ3JvdW5kOiByZWQ7XFxufVxcbi8qKlxcbiAqIEdSSUQgRFJBVyBIRUxQRVJTLlxcbiAqL1xcbi5ob3Jpem9udGFsLWxpbmUsXFxuLnZlcnRpY2FsLWxpbmUge1xcbiAgYmFja2dyb3VuZDogI0ZGRkZGRjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG59XFxuLmdyaWQtY2VudHJvaWQge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYmFja2dyb3VuZDogIzAwMDAwMDtcXG4gIHdpZHRoOiA1cHg7XFxuICBoZWlnaHQ6IDVweDtcXG59XFxuLmRhc2hncmlkQm94IHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGN1cnNvcjogbW92ZTtcXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjNzLCBsZWZ0IC4zcywgdG9wIC4zcywgd2lkdGggLjNzLCBoZWlnaHQgLjNzO1xcbiAgei1pbmRleDogMTAwMjtcXG59XFxuLmdyaWQtc2hhZG93LWJveCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRThFOEU4O1xcbiAgdHJhbnNpdGlvbjogbm9uZTtcXG59XFxuXCI7IChyZXF1aXJlKFwiYnJvd3NlcmlmeS1jc3NcIikuY3JlYXRlU3R5bGUoY3NzLCB7IFwiaHJlZlwiOiBcImRlbW8vZGVtby5jc3NcIn0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiaW1wb3J0IGRhc2hHcmlkR2xvYmFsIGZyb20gJy4uL3NyYy9kYXNoZ3JpZC5qcyc7XG5pbXBvcnQgJy4vZGVtby5jc3MnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgbWFpbigpO1xufSk7XG5cbmZ1bmN0aW9uIGZpbGxDZWxscyhudW1Sb3dzLCBudW1Db2x1bW5zKSB7XG4gICAgbGV0IGVsZW07XG4gICAgbGV0IGJveGVzQWxsID0gW107XG4gICAgbGV0IGlkID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbHVtbnM7IGogKz0gMSkge1xuICAgICAgICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSAnZHJhZ0hhbmRsZSc7XG4gICAgICAgICAgICBlbGVtLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICAgICAgZWxlbS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgICAgICBpZCArPSAxO1xuICAgICAgICAgICAgYm94ZXNBbGwucHVzaCh7cm93OiBpLCBjb2x1bW46IGosIHJvd3NwYW46IDEsIGNvbHVtbnNwYW46IDF9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBib3hlc0FsbDtcbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgYm94ZXM7XG4gICAgbGV0IG51bVJvd3MgPSA2O1xuICAgIGxldCBudW1Db2x1bW5zID0gNjtcblxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbS5jbGFzc05hbWUgPSAnZGFzaGdyaWRCb3gnO1xuXG4gICAgbGV0IGVsZW1Ud28gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtVHdvLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZEJveCc7XG5cbiAgICBsZXQgZWxlbVRocmVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbVRocmVlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZEJveCc7XG5cbiAgICBib3hlcyA9IFtcbiAgICAgICAge3JvdzogMCwgY29sdW1uOiAxLCByb3dzcGFuOiAyLCBjb2x1bW5zcGFuOiAyLCBjb250ZW50OiBlbGVtfSxcbiAgICAgICAge3JvdzogMiwgY29sdW1uOiAxLCByb3dzcGFuOiA0LCBjb2x1bW5zcGFuOiAyLCBjb250ZW50OiBlbGVtVHdvfSxcbiAgICAgICAge3JvdzogMTUsIGNvbHVtbjogMywgcm93c3BhbjogMiwgY29sdW1uc3BhbjogMiwgY29udGVudDogZWxlbVRocmVlfVxuICAgIF07XG4gICAgLy8gYm94ZXMgPSBmaWxsQ2VsbHMobnVtUm93cywgbnVtQ29sdW1ucyk7XG5cbiAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkJyksIHtcbiAgICAgICAgYm94ZXM6IGJveGVzLFxuICAgICAgICBmbG9hdGluZzogdHJ1ZSxcblxuICAgICAgICB4TWFyZ2luOiAyMCxcbiAgICAgICAgeU1hcmdpbjogMjAsXG5cbiAgICAgICAgZHJhZ2dhYmxlOiB7ZW5hYmxlZDogdHJ1ZSwgaGFuZGxlOiAnZGFzaGdyaWRCb3gnfSxcblxuICAgICAgICByb3dIZWlnaHQ6IDgwLFxuICAgICAgICBudW1Sb3dzOiBudW1Sb3dzLFxuICAgICAgICBtaW5Sb3dzOiBudW1Sb3dzLFxuICAgICAgICBtYXhSb3dzOiAyNSxcblxuICAgICAgICBjb2x1bW5XaWR0aDogODAsXG4gICAgICAgIG51bUNvbHVtbnM6IG51bUNvbHVtbnMsXG4gICAgICAgIG1pbkNvbHVtbnM6IG51bUNvbHVtbnMsXG4gICAgICAgIG1heENvbHVtbnM6IDIsXG5cbiAgICAgICAgc25hcGJhY2s6IDIwMCxcblxuICAgICAgICBsaXZlQ2hhbmdlczogdHJ1ZSxcbiAgICAgICAgZGlzcGxheUdyaWQ6IHRydWVcbiAgICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGJyb3dzZXIgZmllbGQsIGNoZWNrIG91dCB0aGUgYnJvd3NlciBmaWVsZCBhdCBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svYnJvd3NlcmlmeS1oYW5kYm9vayNicm93c2VyLWZpZWxkLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBDcmVhdGUgYSA8bGluaz4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlTGluazogZnVuY3Rpb24oaHJlZiwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGUgYSA8c3R5bGU+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZVN0eWxlOiBmdW5jdGlvbihjc3NUZXh0LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoc3R5bGUuc2hlZXQpIHsgLy8gZm9yIGpzZG9tIGFuZCBJRTkrXG4gICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3NUZXh0O1xuICAgICAgICAgICAgc3R5bGUuc2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7IC8vIGZvciBJRTggYW5kIGJlbG93XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmlcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IEJveDtcblxuZnVuY3Rpb24gQm94KGNvbXApIHtcbiAgICBsZXQge2dyaWR9ID0gY29tcDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBCb3ggZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IGJveC5cbiAgICAgKi9cbiAgICBsZXQgY3JlYXRlQm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGJveCwgYm94U2V0dGluZ3MoYm94LCBncmlkKSk7XG4gICAgICAgIGlmIChib3guY29udGVudCkge1xuICAgICAgICAgICAgYm94Ll9lbGVtZW50LmFwcGVuZENoaWxkKGJveC5jb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBncmlkLl9lbGVtZW50LmFwcGVuZENoaWxkKGJveC5fZWxlbWVudCk7XG4gICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7Y3JlYXRlQm94fSk7XG59XG5cbi8qKlxuICogQm94IHByb3BlcnRpZXMgYW5kIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gYm94U2V0dGluZ3MoYm94RWxlbWVudCwgZ3JpZCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIF9lbGVtZW50OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBlbC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgLjNzLCBsZWZ0IC4zcywgdG9wIC4zcywgd2lkdGggLjNzLCBoZWlnaHQgLjNzJztcbiAgICAgICAgICAgIGVsLnN0eWxlLnpJbmRleCA9ICcxMDAyJztcblxuICAgICAgICAgICAgY3JlYXRlQm94UmVzaXplSGFuZGxlcnMoZWwsIGdyaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0oKSksXG5cbiAgICAgICAgcm93OiBib3hFbGVtZW50LnJvdyxcbiAgICAgICAgY29sdW1uOiBib3hFbGVtZW50LmNvbHVtbixcbiAgICAgICAgcm93c3BhbjogYm94RWxlbWVudC5yb3dzcGFuIHx8IDEsXG4gICAgICAgIGNvbHVtbnNwYW46IGJveEVsZW1lbnQuY29sdW1uc3BhbiB8fCAxLFxuICAgICAgICBkcmFnZ2FibGU6IChib3hFbGVtZW50LmRyYWdnYWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IChib3hFbGVtZW50LnJlc2l6YWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBwdXNoYWJsZTogKGJveEVsZW1lbnQucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChib3hFbGVtZW50LmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChib3hFbGVtZW50LnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChib3hFbGVtZW50LnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgaW5oZXJpdDogKGJveEVsZW1lbnQuaW5oZXJpdCA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGJveCByZXNpemUgaGFuZGxlcnMgYW5kIGFwcGVuZHMgdGhlbSB0byBib3guXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJveFJlc2l6ZUhhbmRsZXJzKGJveEVsZW1lbnQsIGdyaWQpIHtcbiAgICAvKipcbiAgICAgKiBUT1AgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZ3JpZC5yZXNpemFibGUuaGFuZGxlcy5pbmRleE9mKCduJykgIT09IC0xKSB7XG4gICAgICAgIGxldCBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLnN0eWxlLmxlZnQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5oZWlnaHQgPSBncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnbi1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCT1RUT00gSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZ3JpZC5yZXNpemFibGUuaGFuZGxlcy5pbmRleE9mKCdzJykgIT09IC0xKSB7XG4gICAgICAgIGxldCBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLnN0eWxlLmxlZnQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmJvdHRvbSA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5oZWlnaHQgPSBncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAncy1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXRVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGdyaWQucmVzaXphYmxlLmhhbmRsZXMuaW5kZXhPZigndycpICE9PSAtMSkge1xuICAgICAgICBsZXQgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuY3Vyc29yID0gJ3ctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRUFTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChncmlkLnJlc2l6YWJsZS5oYW5kbGVzLmluZGV4T2YoJ2UnKSAhPT0gLTEpIHtcbiAgICAgICAgbGV0IGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSBncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnZS1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOT1JUSC1FQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGdyaWQucmVzaXphYmxlLmhhbmRsZXMuaW5kZXhPZignbmUnKSAhPT0gLTEpIHtcbiAgICAgICAgbGV0IGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSBncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5oZWlnaHQgPSBncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnbmUtcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU09VVEgtRUFTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChncmlkLnJlc2l6YWJsZS5oYW5kbGVzLmluZGV4T2YoJ3NlJykgIT09IC0xKSB7XG4gICAgICAgIGxldCBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuY3Vyc29yID0gJ3NlLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNPVVRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZ3JpZC5yZXNpemFibGUuaGFuZGxlcy5pbmRleE9mKCdzdycpICE9PSAtMSkge1xuICAgICAgICBsZXQgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuY3Vyc29yID0gJ3N3LXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVBU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZ3JpZC5yZXNpemFibGUuaGFuZGxlcy5pbmRleE9mKCdudycpICE9PSAtMSkge1xuICAgICAgICBsZXQgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuY3Vyc29yID0gJ253LXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCAnLi9zaGltcy5qcyc7XG5cbmltcG9ydCBFbmdpbmUgZnJvbSAnLi9lbmdpbmUuanMnO1xuaW1wb3J0IEJveCBmcm9tIFwiLi9ib3guanNcIjtcbmltcG9ydCBSZW5kZXIgZnJvbSAnLi9yZW5kZXJlci5qcyc7XG5pbXBvcnQgRHJhd2VyIGZyb20gJy4vZHJhd2VyLmpzJztcbmltcG9ydCBNb3VzZSBmcm9tICcuL21vdXNlLmpzJztcbmltcG9ydCBEcmFnZ2VyIGZyb20gJy4vZHJhZy5qcyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL3Jlc2l6ZS5qcyc7XG5pbXBvcnQge2FkZEV2ZW50LCByZW1vdmVOb2Rlc30gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hncmlkO1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IFRoZSBncmlkIGVsZW1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gZ3MgR3JpZCBzZXR0aW5ncy5cbiAqL1xuZnVuY3Rpb24gRGFzaGdyaWQoZWxlbWVudCwgZ3MpIHtcbiAgICBsZXQgZ3JpZCA9IE9iamVjdC5hc3NpZ24oe30sIGdyaWRTZXR0aW5ncyhncywgZWxlbWVudCkpO1xuXG4gICAgbGV0IHJlbmRlcmVyID0gUmVuZGVyKHtncmlkfSk7XG4gICAgbGV0IGJveEhhbmRsZXIgPSBCb3goe2dyaWR9KTtcbiAgICBsZXQgZHJhd2VyID0gRHJhd2VyKHtncmlkLCByZW5kZXJlcn0pO1xuICAgIGxldCBlbmdpbmUgPSBFbmdpbmUoe2dyaWQsIHJlbmRlcmVyLCBkcmF3ZXIsIGJveEhhbmRsZXJ9KTtcbiAgICBsZXQgZHJhZ2dlciA9IERyYWdnZXIoe2dyaWQsIHJlbmRlcmVyLCBlbmdpbmV9KTtcbiAgICBsZXQgcmVzaXplciA9IFJlc2l6ZXIoe2dyaWQsIHJlbmRlcmVyLCBlbmdpbmV9KTtcbiAgICBsZXQgbW91c2UgPSBNb3VzZSh7ZHJhZ2dlciwgcmVzaXplciwgZ3JpZCwgZW5naW5lfSk7XG5cbiAgICAvLyBJbml0aWFsaXplLlxuICAgIGRyYXdlci5pbml0aWFsaXplKCk7XG4gICAgZW5naW5lLmluaXRpYWxpemUoKTtcbiAgICBtb3VzZS5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBFdmVudCBsaXN0ZW5lcnMuXG4gICAgYWRkRXZlbnQod2luZG93LCAncmVzaXplJywgZW5naW5lLnJlZnJlc2hHcmlkKTtcblxuICAgIC8vIEFwaS5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIHVwZGF0ZUJveDogZW5naW5lLnVwZGF0ZUJveCxcbiAgICAgICAgaW5zZXJ0Qm94OiBlbmdpbmUuaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3g6IGVuZ2luZS5yZW1vdmVCb3gsXG4gICAgICAgIGdldEJveGVzOiBlbmdpbmUuZ2V0Qm94ZXMsXG4gICAgICAgIHJlZnJlc2hHcmlkOiBlbmdpbmUucmVmcmVzaEdyaWQsXG4gICAgICAgIGdyaWQ6IGdyaWRcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBHcmlkIHByb3BlcnRpZXMgYW5kIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gZ3JpZFNldHRpbmdzKGdzLCBlbGVtZW50KSB7XG4gICAgbGV0IGdyaWQgPSB7XG4gICAgICAgIF9lbGVtZW50OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG4gICAgICAgICAgICByZW1vdmVOb2RlcyhlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9KCkpLFxuXG4gICAgICAgIGJveGVzOiBncy5ib3hlcyB8fCBbXSxcblxuICAgICAgICByb3dIZWlnaHQ6IGdzLnJvd0hlaWdodCxcbiAgICAgICAgbnVtUm93czogKGdzLm51bVJvd3MgIT09IHVuZGVmaW5lZCkgPyBncy5udW1Sb3dzIDogNixcbiAgICAgICAgbWluUm93czogKGdzLm1pblJvd3MgIT09IHVuZGVmaW5lZCkgPyBncy5taW5Sb3dzIDogNixcbiAgICAgICAgbWF4Um93czogKGdzLm1heFJvd3MgIT09IHVuZGVmaW5lZCkgPyBncy5tYXhSb3dzIDogMTAsXG5cbiAgICAgICAgY29sdW1uV2lkdGg6IGdzLmNvbHVtbldpZHRoLFxuICAgICAgICBudW1Db2x1bW5zOiAoZ3MubnVtQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IGdzLm51bUNvbHVtbnMgOiA2LFxuICAgICAgICBtaW5Db2x1bW5zOiAoZ3MubWluQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IGdzLm1pbkNvbHVtbnMgOiA2LFxuICAgICAgICBtYXhDb2x1bW5zOiAoZ3MubWF4Q29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IGdzLm1heENvbHVtbnMgOiAxMCxcblxuICAgICAgICB4TWFyZ2luOiAoZ3MueE1hcmdpbiAhPT0gdW5kZWZpbmVkKSA/IGdzLnhNYXJnaW4gOiAyMCxcbiAgICAgICAgeU1hcmdpbjogKGdzLnlNYXJnaW4gIT09IHVuZGVmaW5lZCkgPyBncy55TWFyZ2luIDogMjAsXG5cbiAgICAgICAgZGVmYXVsdEJveFJvd3NwYW46IDIsXG4gICAgICAgIGRlZmF1bHRCb3hDb2x1bW5zcGFuOiAxLFxuXG4gICAgICAgIG1pblJvd3NwYW46IChncy5taW5Sb3dzcGFuICE9PSB1bmRlZmluZWQpID8gZ3MubWluUm93c3BhbiA6IDEsXG4gICAgICAgIG1heFJvd3NwYW46IChncy5tYXhSb3dzcGFuICE9PSB1bmRlZmluZWQpID8gZ3MubWF4Um93c3BhbiA6IDk5OTksXG5cbiAgICAgICAgbWluQ29sdW1uc3BhbjogKGdzLm1pbkNvbHVtbnNwYW4gIT09IHVuZGVmaW5lZCkgPyBncy5taW5Db2x1bW5zcGFuIDogMSxcbiAgICAgICAgbWF4Q29sdW1uc3BhbjogKGdzLm1heENvbHVtbnNwYW4gIT09IHVuZGVmaW5lZCkgPyBncy5tYXhDb2x1bW5zcGFuIDogOTk5OSxcblxuICAgICAgICBwdXNoYWJsZTogKGdzLnB1c2hhYmxlID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIGZsb2F0aW5nOiAoZ3MuZmxvYXRpbmcgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBzdGFja2luZzogKGdzLnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChncy5zd2FwcGluZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGU6IChncy5hbmltYXRlID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcblxuICAgICAgICBsaXZlQ2hhbmdlczogKGdzLmxpdmVDaGFuZ2VzID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG5cbiAgICAgICAgZHJhZ2dhYmxlOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogKGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZW5hYmxlZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IChncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmhhbmRsZXMpIHx8IHVuZGVmaW5lZCxcblxuICAgICAgICAgICAgICAgIC8vIHVzZXIgY2Incy5cbiAgICAgICAgICAgICAgICBkcmFnU3RhcnQ6IGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZHJhZ1N0YXJ0LFxuICAgICAgICAgICAgICAgIGRyYWdnaW5nOiBncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmRyYWdnaW5nLFxuICAgICAgICAgICAgICAgIGRyYWdFbmQ6IGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZHJhZ0VuZFxuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2l6YWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogKGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUuZW5hYmxlZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgaGFuZGxlczogKGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUuaGFuZGxlcykgfHwgWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ3N3JywgJ253J10sXG4gICAgICAgICAgICBoYW5kbGVXaWR0aDogKGdzLnJlc2l6YWJsZSAmJiAgZ3MucmVzaXphYmxlLmhhbmRsZVdpZHRoICE9PSB1bmRlZmluZWQpID8gZ3MucmVzaXphYmxlLmhhbmRsZVdpZHRoIDogMTAsXG5cbiAgICAgICAgICAgIC8vIHVzZXIgY2Incy5cbiAgICAgICAgICAgIHJlc2l6ZVN0YXJ0OiBncy5yZXNpemFibGUgJiYgZ3MucmVzaXphYmxlLnJlc2l6ZVN0YXJ0LFxuICAgICAgICAgICAgcmVzaXppbmc6IGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUucmVzaXppbmcsXG4gICAgICAgICAgICByZXNpemVFbmQ6IGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUucmVzaXplRW5kXG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgLjNzLCBsZWZ0IC4zcywgdG9wIC4zcywgd2lkdGggLjNzLCBoZWlnaHQgLjNzJyxcbiAgICAgICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDIwLFxuICAgICAgICBzY3JvbGxTcGVlZDogMTAsXG4gICAgICAgIHNuYXBiYWNrdGltZTogKGdzLnNuYXBiYWNrdGltZSA9PT0gdW5kZWZpbmVkKSA/IDMwMCA6IGdzLnNuYXBiYWNrdGltZSxcbiAgICAgICAgZGlzcGxheUdyaWQ6IChncy5kaXNwbGF5R3JpZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlXG4gICAgfTtcblxuICAgIHJldHVybiBncmlkO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgRHJhZ2dlcjtcblxuZnVuY3Rpb24gRHJhZ2dlcihjb21wKSB7XG4gICAgbGV0IHtncmlkLCByZW5kZXJlciwgZW5naW5lfSA9IGNvbXA7XG5cbiAgICBsZXQgZVgsIGVZLCBlVywgZUgsXG4gICAgICAgIG1vdXNlWCA9IDAsXG4gICAgICAgIG1vdXNlWSA9IDAsXG4gICAgICAgIGxhc3RNb3VzZVggPSAwLFxuICAgICAgICBsYXN0TW91c2VZID0gMCxcbiAgICAgICAgbU9mZlggPSAwLFxuICAgICAgICBtT2ZmWSA9IDAsXG4gICAgICAgIG1pblRvcCA9IGdyaWQueU1hcmdpbixcbiAgICAgICAgbWluTGVmdCA9IGdyaWQueE1hcmdpbixcbiAgICAgICAgY3VyclN0YXRlID0ge30sXG4gICAgICAgIHByZXZTdGF0ZSA9IHt9O1xuXG4gICAgbGV0IHNjcm9sbEhlaWdodCA9IGdyaWQuX2VsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHNoYWRvd2JveCwgcmVtb3ZlIHNtb290aCB0cmFuc2l0aW9ucyBmb3IgYm94LFxuICAgICAqIGFuZCBpbml0aWFsaXplIG1vdXNlIHZhcmlhYmxlcy4gRmluYWxseSwgbWFrZSBjYWxsIHRvIGFwaSB0byBjaGVjayBpZixcbiAgICAgKiBhbnkgYm94IGlzIGNsb3NlIHRvIGJvdHRvbSAvIHJpZ2h0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IGRyYWdTdGFydCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnTm9uZSc7XG4gICAgICAgIGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUubGVmdCA9IGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0O1xuICAgICAgICBncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcCA9IGJveC5fZWxlbWVudC5zdHlsZS50b3A7XG4gICAgICAgIGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUud2lkdGggPSBib3guX2VsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYm94Ll9lbGVtZW50LnN0eWxlLmhlaWdodDtcbiAgICAgICAgZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cbiAgICAgICAgLy8gTW91c2UgdmFsdWVzLlxuICAgICAgICBsYXN0TW91c2VYID0gZS5wYWdlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IGUucGFnZVk7XG4gICAgICAgIGVYID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsIDEwKTtcbiAgICAgICAgZVkgPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0VG9wLCAxMCk7XG4gICAgICAgIGVXID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoLCAxMCk7XG4gICAgICAgIGVIID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodCwgMTApO1xuXG4gICAgICAgIHNjcm9sbEhlaWdodCA9IGdyaWQuX2VsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICAgIGVuZ2luZS5kcmFnUmVzaXplU3RhcnQoYm94KTtcblxuICAgICAgICBpZiAoZ3JpZC5kcmFnZ2FibGUuZHJhZ1N0YXJ0KSB7Z3JpZC5kcmFnZ2FibGUuZHJhZ1N0YXJ0KCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCBkcmFnID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICB1cGRhdGVNb3ZpbmdFbGVtZW50KGJveCwgZSk7XG4gICAgICAgIGVuZ2luZS5kcmFnZ2luZ1Jlc2l6aW5nKGJveCk7XG5cbiAgICAgICAgaWYgKGdyaWQubGl2ZUNoYW5nZXMpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoIGNlbGwgdG8gc25hcCBwcmV2aWV3IGJveCB0by5cbiAgICAgICAgICAgIGN1cnJTdGF0ZSA9IHJlbmRlcmVyLmdldENsb3Nlc3RDZWxscyh7XG4gICAgICAgICAgICAgICAgbGVmdDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0ICsgYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgIHRvcDogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICBib3R0b206IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgKyBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbW92ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nKSB7Z3JpZC5kcmFnZ2FibGUuZHJhZ2dpbmcoKTt9IC8vIHVzZXIgY2IuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IGRyYWdFbmQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGlmICghZ3JpZC5saXZlQ2hhbmdlcykge1xuICAgICAgICAgICAgLy8gV2hpY2ggY2VsbCB0byBzbmFwIHByZXZpZXcgYm94IHRvLlxuICAgICAgICAgICAgY3VyclN0YXRlID0gcmVuZGVyZXIuZ2V0Q2xvc2VzdENlbGxzKHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICByaWdodDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQgKyBib3guX2VsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgdG9wOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCArIGJveC5fZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW92ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBncmlkLnRyYW5zaXRpb247XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5sZWZ0O1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS50b3A7XG5cbiAgICAgICAgLy8gR2l2ZSB0aW1lIGZvciBwcmV2aWV3Ym94IHRvIHNuYXAgYmFjayB0byB0aWxlLlxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGVuZ2luZS5kcmFnUmVzaXplRW5kKCk7XG4gICAgICAgIH0sIGdyaWQuc25hcGJhY2t0aW1lKTtcblxuICAgICAgICBpZiAoZ3JpZC5kcmFnZ2FibGUuZHJhZ0VuZCkge2dyaWQuZHJhZ2dhYmxlLmRyYWdFbmQoKTt9IC8vIHVzZXIgY2IuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IG1vdmVCb3ggPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGlmIChjdXJyU3RhdGUucm93ICE9PSBwcmV2U3RhdGUucm93IHx8XG4gICAgICAgICAgICBjdXJyU3RhdGUuY29sdW1uICE9PSBwcmV2U3RhdGUuY29sdW1uKSB7XG5cbiAgICAgICAgICAgIGxldCBwcmV2U2Nyb2xsSGVpZ2h0ID0gZ3JpZC5fZWxlbWVudC5vZmZzZXRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICBsZXQgcHJldlNjcm9sbFdpZHRoID0gZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgICAgICBsZXQgdmFsaWRNb3ZlID0gZW5naW5lLnVwZGF0ZUJveChib3gsIGN1cnJTdGF0ZSwgYm94KTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlR3JpZERpbWVuc2lvbiBwcmV2aWV3IGJveC5cbiAgICAgICAgICAgIGlmICh2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hZUG9zaXRpb24oZ3JpZC5fc2hhZG93Qm94RWxlbWVudCwgY3VyclN0YXRlLnJvdyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94WFBvc2l0aW9uKGdyaWQuX3NoYWRvd0JveEVsZW1lbnQsIGN1cnJTdGF0ZS5jb2x1bW4pO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBvc3RTY3JvbGxIZWlnaHQgPSBncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgcG9zdFNjcm9sbFdpZHRoID0gZ3JpZC5fZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAgICAgLy8gQWNjb3VudCBmb3IgbWluaW1pemluZyBzY3JvbGwgaGVpZ2h0IHdoZW4gbW92aW5nIGJveCB1cHdhcmRzLlxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBidWcgaGFwcGVucyB3aGVyZSB0aGUgZHJhZ2dlZCBib3ggaXMgY2hhbmdlZCBidXQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAvLyBhZnRlcndhcmRzIHRoZSBncmlkIGVsZW1lbnQgZGltZW5zaW9uIGlzIGNoYW5nZWQuXG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZ3JpZC5fZWxlbWVudC5vZmZzZXRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB3aW5kb3cuc2Nyb2xsWSkgPCAzMCAmJlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsWSA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgcHJldlNjcm9sbEhlaWdodCAhPT0gcG9zdFNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gYm94Ll9lbGVtZW50Lm9mZnNldFRvcCAtIDEwMCAgKyAncHgnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhncmlkLl9lbGVtZW50Lm9mZnNldFdpZHRoIC0gd2luZG93LmlubmVyV2lkdGggLSB3aW5kb3cuc2Nyb2xsWCkgPCAzMCAmJlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsWCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgcHJldlNjcm9sbFdpZHRoICE9PSBwb3N0U2Nyb2xsV2lkdGgpIHtcblxuICAgICAgICAgICAgICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0IC0gMTAwICArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gcG9pbnQgaW4gYXR0ZW1wdGluZyBtb3ZlIGlmIG5vdCBzd2l0Y2hlZCB0byBuZXcgY2VsbC5cbiAgICAgICAgcHJldlN0YXRlID0ge3JvdzogY3VyclN0YXRlLnJvdywgY29sdW1uOiBjdXJyU3RhdGUuY29sdW1ufTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1vdmluZyBlbGVtZW50LFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCB1cGRhdGVNb3ZpbmdFbGVtZW50ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBsZXQgbWF4TGVmdCA9IGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSBncmlkLnhNYXJnaW47XG4gICAgICAgIGxldCBtYXhUb3AgPSBncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIGdyaWQueU1hcmdpbjtcblxuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24uXG4gICAgICAgIG1vdXNlWCA9IGUucGFnZVg7XG4gICAgICAgIG1vdXNlWSA9IGUucGFnZVk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWx0YXNcbiAgICAgICAgbGV0IGRpZmZYID0gbW91c2VYIC0gbGFzdE1vdXNlWCArIG1PZmZYO1xuICAgICAgICBsZXQgZGlmZlkgPSBtb3VzZVkgLSBsYXN0TW91c2VZICsgbU9mZlk7XG5cbiAgICAgICAgbU9mZlggPSAwO1xuICAgICAgICBtT2ZmWSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGxhc3QgcHJvY2Vzc2VkIG1vdXNlIHBvc2l0aW9ucy5cbiAgICAgICAgbGFzdE1vdXNlWCA9IG1vdXNlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IG1vdXNlWTtcblxuICAgICAgICBsZXQgZFggPSBkaWZmWDtcbiAgICAgICAgbGV0IGRZID0gZGlmZlk7XG4gICAgICAgIGlmIChlWCArIGRYIDwgbWluTGVmdCkge1xuICAgICAgICAgICAgZGlmZlggPSBtaW5MZWZ0IC0gZVg7XG4gICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgIH0gZWxzZSBpZiAoZVggKyBlVyArIGRYID4gbWF4TGVmdCkge1xuICAgICAgICAgICAgZGlmZlggPSBtYXhMZWZ0IC0gZVggLSBlVztcbiAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlWSArIGRZIDwgbWluVG9wKSB7XG4gICAgICAgICAgICBkaWZmWSA9IG1pblRvcCAtIGVZO1xuICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICB9IGVsc2UgaWYgKGVZICsgZUggKyBkWSA+IG1heFRvcCkge1xuICAgICAgICAgICAgZGlmZlkgPSBtYXhUb3AgLSBlWSAtIGVIO1xuICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICB9XG4gICAgICAgIGVYICs9IGRpZmZYO1xuICAgICAgICBlWSArPSBkaWZmWTtcblxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gZVkgKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGVYICsgJ3B4JztcblxuICAgICAgICBzY3JvbGxIZWlnaHQgPSBncmlkLl9lbGVtZW50LnNjcm9sbEhlaWdodDtcblxuICAgICAgICAvLyBTY3JvbGxpbmcgd2hlbiBjbG9zZSB0byBib3R0b20gZWRnZS5cbiAgICAgICAgaWYgKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA8IGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLSBncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAtIChlLnBhZ2VZIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIDwgZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS5wYWdlWCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA8IGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCAtIGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmlubmVyV2lkdGggLSAoZS5wYWdlWCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCkgPCBncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBkcmFnU3RhcnQsXG4gICAgICAgIGRyYWcsXG4gICAgICAgIGRyYWdFbmRcbiAgICB9KTtcbn1cbiIsIi8qKlxuICogZ3JpZERyYXcuanM6IEhpZ2gtbGV2ZWwgZHJhdy5cbiAqL1xuXG5pbXBvcnQge3JlbW92ZU5vZGVzfSBmcm9tICcuL3V0aWxzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgRHJhd2VyO1xuXG5mdW5jdGlvbiBEcmF3ZXIoY29tcCkge1xuICAgIGxldCB7Z3JpZCwgcmVuZGVyZXJ9ID0gY29tcDtcbiAgICBsZXQgZHJhd0VsZW1lbnQ7XG5cbiAgICBsZXQgaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGdyaWQuZGlzcGxheUdyaWQpIHtjcmVhdGVHcmlkRHJhdygpO31cbiAgICAgICAgY3JlYXRlU2hhZG93Qm94RWxlbWVudCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBkcmF3IGVsZW1lbnQgd2hpY2ggaXMgdXNlZCB0byBzaG93IHRoZSB2ZXJ0aWNhbCBhbmRcbiAgICAgKiAgICAgaG9yaXpvbnRhbCBsaW5lcy5cbiAgICAgKi9cbiAgICBsZXQgY3JlYXRlR3JpZERyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhdy1lbGVtZW50JykgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGRyYXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcmF3RWxlbWVudC5pZCA9ICdkcmF3LWVsZW1lbnQnO1xuICAgICAgICAgICAgZ3JpZC5fZWxlbWVudC5hcHBlbmRDaGlsZChkcmF3RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgc2hhZG93IGJveCBlbGVtZW50IHdoaWNoIGlzIHVzZWQgd2hlbiBkcmFnZ2luZyAvIHJlc2l6aW5nXG4gICAgICogICAgIGEgYm94LiBJdCBnZXRzIGF0dGFjaGVkIHRvIHRoZSBkcmFnZ2luZyAvIHJlc2l6aW5nIGJveCwgd2hpbGVcbiAgICAgKiAgICAgYm94IGdldHMgdG8gbW92ZSAvIHJlc2l6ZSBmcmVlbHkgYW5kIHNuYXBzIGJhY2sgdG8gaXRzIG9yaWdpbmFsXG4gICAgICogICAgIG9yIG5ldyBwb3NpdGlvbiBhdCBkcmFnIC8gcmVzaXplIHN0b3AuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZVNoYWRvd0JveEVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hhZG93LWJveCcpID09PSBudWxsKSB7XG4gICAgICAgICAgICBncmlkLl9zaGFkb3dCb3hFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBncmlkLl9zaGFkb3dCb3hFbGVtZW50LmlkID0gJ3NoYWRvdy1ib3gnO1xuICAgICAgICAgICAgZ3JpZC5fc2hhZG93Qm94RWxlbWVudFxuICAgICAgICAgICAgLy8gYmFja2dyb3VuZC1jb2xvcjogI0U4RThFODtcbiAgICAgICAgICAgIC8vIHRyYW5zaXRpb246IG5vbmU7XG5cbiAgICAgICAgICAgIGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuY2xhc3NOYW1lID0gJ2dyaWQtc2hhZG93LWJveCc7XG4gICAgICAgICAgICBncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnpJbmRleCA9ICcxMDAxJztcbiAgICAgICAgICAgIGdyaWQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBsZXQgc2V0R3JpZERpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFJvd0hlaWdodCgpO1xuICAgICAgICByZW5kZXJlci5zZXRDb2x1bW5XaWR0aCgpO1xuXG4gICAgICAgIHJlbmRlcmVyLnNldEdyaWRIZWlnaHQoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0R3JpZFdpZHRoKCk7XG5cbiAgICAgICAgcmVuZGVyZXIuc2V0Q2VsbENlbnRyb2lkcygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKi9cbiAgICBsZXQgdXBkYXRlR3JpZERpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0R3JpZEhlaWdodCgpO1xuICAgICAgICByZW5kZXJlci5zZXRHcmlkV2lkdGgoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICovXG4gICAgbGV0IGRyYXdCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEJveFlQb3NpdGlvbihib3guX2VsZW1lbnQsIGJveC5yb3cpO1xuICAgICAgICByZW5kZXJlci5zZXRCb3hYUG9zaXRpb24oYm94Ll9lbGVtZW50LCBib3guY29sdW1uKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Qm94SGVpZ2h0KGJveC5fZWxlbWVudCwgYm94LnJvd3NwYW4pO1xuICAgICAgICByZW5kZXJlci5zZXRCb3hXaWR0aChib3guX2VsZW1lbnQsIGJveC5jb2x1bW5zcGFuKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBsZXQgZHJhd0dyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbW92ZU5vZGVzKGRyYXdFbGVtZW50KTtcblxuICAgICAgICBsZXQgaHRtbFN0cmluZyA9ICcnO1xuICAgICAgICAvLyBIb3Jpem9udGFsIGxpbmVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdob3Jpem9udGFsLWxpbmUnXG4gICAgICAgICAgICAgICAgc3R5bGU9J3RvcDogJHtpICogKGdyaWQucm93SGVpZ2h0ICsgZ3JpZC55TWFyZ2luKX1weDtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMHB4O1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAke2dyaWQueU1hcmdpbn1weDsnPlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWZXJ0aWNhbCBsaW5lc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBncmlkLm51bUNvbHVtbnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgaHRtbFN0cmluZyArPSBgPGRpdiBjbGFzcz0ndmVydGljYWwtbGluZSdcbiAgICAgICAgICAgICAgICBzdHlsZT0ndG9wOiAwcHg7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7aSAqIChncmlkLmNvbHVtbldpZHRoICsgZ3JpZC54TWFyZ2luKX1weDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJHtncmlkLnhNYXJnaW59cHg7Jz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyBjZW50cm9pZHNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLm51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncmlkLm51bUNvbHVtbnM7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGh0bWxTdHJpbmcgKz0gYDxkaXYgY2xhc3M9J2dyaWQtY2VudHJvaWQnXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPSd0b3A6ICR7KGkgKiAoZ3JpZC5yb3dIZWlnaHQgICsgZ3JpZC55TWFyZ2luKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5yb3dIZWlnaHQgLyAyICsgZ3JpZC55TWFyZ2luICl9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkeyhqICogKGdyaWQuY29sdW1uV2lkdGggICsgZ3JpZC54TWFyZ2luKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5jb2x1bW5XaWR0aCAvIDIgKyBncmlkLnhNYXJnaW4pfXB4Oyc+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3RWxlbWVudC5pbm5lckhUTUwgPSBodG1sU3RyaW5nO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGluaXRpYWxpemUsXG4gICAgICAgIHNldEdyaWREaW1lbnNpb25zLFxuICAgICAgICBjcmVhdGVHcmlkRHJhdyxcbiAgICAgICAgZHJhd0JveCxcbiAgICAgICAgZHJhd0dyaWQsXG4gICAgICAgIHVwZGF0ZUdyaWREaW1lbnNpb25cbiAgICB9KVxuXG59O1xuIiwiaW1wb3J0IHtpbnNlcnRpb25Tb3J0LCBnZXRNYXhOdW19IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBFbmdpbmU7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAqIEBwYXJhbSB7T2JqZWN0fSB1cGRhdGVUb1xuICogQHBhcmFtIHtPYmplY3R9IGV4Y2x1ZGVCb3ggT3B0aW9uYWwgcGFyYW1ldGVyLCBpZiB1cGRhdGVCb3ggaXMgdHJpZ2dlcmVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBkcmFnIC8gcmVzaXplIGV2ZW50LCB0aGVuIGRvbid0IHVwZGF0ZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgdXBkYXRlIHN1Y2NlZWRlZC5cbiAqL1xuZnVuY3Rpb24gRW5naW5lKG9iaikge1xuICAgIGxldCB7Z3JpZCwgcmVuZGVyZXIsIGRyYXdlciwgYm94SGFuZGxlcn0gPSBvYmo7XG5cbiAgICBsZXQgZW5naW5lUmVuZGVyID0gRW5naW5lUmVuZGVyKHtncmlkLCBkcmF3ZXIsIHJlbmRlcmVyfSk7XG4gICAgbGV0IGVuZ2luZUNvcmUgPSBFbmdpbmVDb3JlKHtncmlkLCBib3hIYW5kbGVyfSk7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXphdGlvbiBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgdGhlIG5lY2Vzc2FyeSBib3ggZWxlbWVudHMgYW5kIGNoZWNrc1xuICAgICAqIHRoYXQgdGhlIGJveGVzIGlucHV0IGlzIGNvcnJlY3QuXG4gICAgICovXG4gICAgbGV0IGluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVuZ2luZUNvcmUuY3JlYXRlQm94RWxlbWVudHMoKTtcbiAgICAgICAgZW5naW5lQ29yZS51cGRhdGVOdW1Sb3dzKCk7XG4gICAgICAgIGVuZ2luZUNvcmUudXBkYXRlTnVtQ29sdW1ucygpO1xuICAgICAgICBlbmdpbmVSZW5kZXIucmVuZGVyR3JpZCgpO1xuICAgICAgICBlbmdpbmVSZW5kZXIucmVmcmVzaEdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVRvXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4Y2x1ZGVCb3ggT3B0aW9uYWwgcGFyYW1ldGVyLCBpZiB1cGRhdGVCb3ggaXMgdHJpZ2dlcmVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgZHJhZyAvIHJlc2l6ZSBldmVudCwgdGhlbiBkb24ndCB1cGRhdGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgdXBkYXRlIHN1Y2NlZWRlZC5cbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlQm94ID0gZnVuY3Rpb24gKGJveCwgdXBkYXRlVG8sIGV4Y2x1ZGVCb3gpIHtcbiAgICAgICAgbGV0IG1vdmVkQm94ZXMgPSBlbmdpbmVDb3JlLnVwZGF0ZUJveChib3gsIHVwZGF0ZVRvKTtcblxuICAgICAgICBpZiAobW92ZWRCb3hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbmdpbmVSZW5kZXIudXBkYXRlUG9zaXRpb25zKG1vdmVkQm94ZXMsIGV4Y2x1ZGVCb3gpO1xuICAgICAgICAgICAgZW5naW5lUmVuZGVyLnJlbmRlckdyaWQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBib3guXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCByZW1vdmVCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGVuZ2luZUJveC5yZW1vdmVCb3goKTtcbiAgICAgICAgZW5naW5lUmVuZGVyLnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyBhIGJveC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IHJlc2l6ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgLy8gSW4gY2FzZSBib3ggaXMgbm90IHVwZGF0ZWQgYnkgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAgICAgICAgZW5naW5lUmVuZGVyLnVwZGF0ZVBvc2l0aW9ucyhtb3ZlZEJveGVzKTtcbiAgICAgICAgZW5naW5lUmVuZGVyLnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gZWl0aGVyIHJlc2l6ZSBvciBkcmFnIHN0YXJ0cy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICovXG4gICAgbGV0IGRyYWdSZXNpemVTdGFydCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgZW5naW5lQ29yZS5pbmNyZWFzZU51bVJvd3MoYm94LCAxKTtcbiAgICAgICAgZW5naW5lQ29yZS5pbmNyZWFzZU51bUNvbHVtbnMoYm94LCAxKTtcbiAgICAgICAgZW5naW5lUmVuZGVyLnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBkcmFnZ2luZyAvIHJlc2l6aW5nIGlzIGRyb3BwZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCBkcmFnZ2luZ1Jlc2l6aW5nID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAvLyBlbmdpbmVDb3JlLmluY3JlYXNlTnVtUm93cyhib3gsIDEpO1xuICAgICAgICAvLyBlbmdpbmVDb3JlLmluY3JlYXNlTnVtQ29sdW1ucyhib3gsIDEpO1xuICAgICAgICAvLyBlbmdpbmVSZW5kZXIucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGRyYWdnaW5nIC8gcmVzaXppbmcgaXMgZHJvcHBlZC5cbiAgICAgKi9cbiAgICBsZXQgZHJhZ1Jlc2l6ZUVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZW5naW5lQ29yZS5kZWNyZWFzZU51bVJvd3MoKTtcbiAgICAgICAgZW5naW5lQ29yZS5kZWNyZWFzZU51bUNvbHVtbnMoKTtcbiAgICAgICAgZW5naW5lUmVuZGVyLnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0aWFsaXplOiBpbml0aWFsaXplLFxuICAgICAgICB1cGRhdGVCb3g6IHVwZGF0ZUJveCxcbiAgICAgICAgaW5zZXJ0Qm94OiBlbmdpbmVDb3JlLmluc2VydEJveCxcbiAgICAgICAgcmVtb3ZlQm94OiBlbmdpbmVDb3JlLnJlbW92ZUJveCxcbiAgICAgICAgZ2V0Qm94OiBlbmdpbmVDb3JlLmdldEJveCxcbiAgICAgICAgc2V0QWN0aXZlQm94OiBlbmdpbmVDb3JlLnNldEFjdGl2ZUJveCxcbiAgICAgICAgZHJhZ1Jlc2l6ZVN0YXJ0OiBkcmFnUmVzaXplU3RhcnQsXG4gICAgICAgIGRyYWdnaW5nUmVzaXppbmc6IGRyYWdnaW5nUmVzaXppbmcsXG4gICAgICAgIGRyYWdSZXNpemVFbmQ6IGRyYWdSZXNpemVFbmQsXG4gICAgICAgIHJlbmRlckdyaWQ6IGVuZ2luZVJlbmRlci5yZW5kZXJHcmlkLFxuICAgICAgICByZWZyZXNoR3JpZDogZW5naW5lUmVuZGVyLnJlZnJlc2hHcmlkXG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IDVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IDZcbiAqIEBwYXJhbSB7RnVuY3Rpb259IDdcbiAqL1xuZnVuY3Rpb24gRW5naW5lUmVuZGVyKG9iaikge1xuICAgIGxldCB7Z3JpZCwgZHJhd2VyLCByZW5kZXJlcn0gPSBvYmo7XG5cbiAgICAvKipcbiAgICAgKiBSZWZyZXNoIHRoZSBncmlkLFxuICAgICAqL1xuICAgIGxldCByZW5kZXJHcmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkcmF3ZXIudXBkYXRlR3JpZERpbWVuc2lvbigpO1xuICAgICAgICByZW5kZXJlci5zZXRDZWxsQ2VudHJvaWRzKCk7XG4gICAgICAgIGRyYXdlci5kcmF3R3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWZyZXNoIHRoZSBncmlkLFxuICAgICAqL1xuICAgIGxldCByZWZyZXNoR3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZHJhd2VyLnNldEdyaWREaW1lbnNpb25zKCk7XG4gICAgICAgIGRyYXdlci5kcmF3R3JpZCgpO1xuICAgICAgICB1cGRhdGVQb3NpdGlvbnMoZ3JpZC5ib3hlcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBleGNsdWRlQm94IERvbid0IHJlZHJhdyB0aGlzIGJveC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94ZXMgTGlzdCBvZiBib3hlcyB0byByZWRyYXcuXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZVBvc2l0aW9ucyA9IGZ1bmN0aW9uIChib3hlcywgZXhjbHVkZUJveCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyB1cGRhdGVHcmlkRGltZW5zaW9uIG1vdmVkIGJveGVzIGNzcy5cbiAgICAgICAgICAgIGJveGVzLmZvckVhY2goZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAgICAgICAgIGlmIChleGNsdWRlQm94ICE9PSBib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgZHJhd2VyLmRyYXdCb3goYm94KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgcmVmcmVzaEdyaWQsXG4gICAgICAgIHJlbmRlckdyaWQsXG4gICAgICAgIHVwZGF0ZVBvc2l0aW9uc1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBIYW5kbGVzIGNvbGxpc2lvbiBsb2dpYyBhbmQgZ3JpZCBkaW1lbnNpb24uXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cbmZ1bmN0aW9uIEVuZ2luZUNvcmUob2JqKSB7XG4gICAgbGV0IHtncmlkLCBib3hIYW5kbGVyfSA9IG9iajtcbiAgICBsZXQgYm94ZXMsIG1vdmluZ0JveCwgbW92ZWRCb3hlcztcblxuICAgIC8qKlxuICAgICAqIEFkZFxuICAgICAqIEBwYXJhbSB7fVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUJveEVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZ3JpZC5ib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgYm94SGFuZGxlci5jcmVhdGVCb3goZ3JpZC5ib3hlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgYm94ZXMgPSBncmlkLmJveGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIERPTSBlbGVtZW50LCByZXRyaWV2ZSBjb3JyZXNwb25kaW5nIGpzIG9iamVjdCBmcm9tIGJveGVzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBsZXQgZ2V0Qm94ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGJveGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoYm94ZXNbaV0uX2VsZW1lbnQgPT09IGVsZW1lbnQpIHtyZXR1cm4gYm94ZXNbaV19XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvcHkgYm94IHBvc2l0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXkuPE9iamVjdD59IFByZXZpb3VzIGJveCBwb3NpdGlvbnMuXG4gICAgICovXG4gICAgbGV0IGNvcHlCb3hlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHByZXZQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib3hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJldlBvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3c6IGJveGVzW2ldLnJvdyxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGJveGVzW2ldLmNvbHVtbixcbiAgICAgICAgICAgICAgICBjb2x1bW5zcGFuOiBib3hlc1tpXS5jb2x1bW5zcGFuLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IGJveGVzW2ldLnJvd3NwYW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBwcmV2UG9zaXRpb25zO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlIE9sZCBwb3NpdGlvbnMuXG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gUHJldmlvdXMgcG9zaXRpb25zLlxuICAgICAqL1xuICAgIGxldCByZXN0b3JlT2xkUG9zaXRpb25zID0gZnVuY3Rpb24gKHByZXZQb3NpdGlvbnMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib3hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm94ZXNbaV0ucm93ID0gcHJldlBvc2l0aW9uc1tpXS5yb3csXG4gICAgICAgICAgICBib3hlc1tpXS5jb2x1bW4gPSBwcmV2UG9zaXRpb25zW2ldLmNvbHVtbixcbiAgICAgICAgICAgIGJveGVzW2ldLmNvbHVtbnNwYW4gPSBwcmV2UG9zaXRpb25zW2ldLmNvbHVtbnNwYW4sXG4gICAgICAgICAgICBib3hlc1tpXS5yb3dzcGFuID0gcHJldlBvc2l0aW9uc1tpXS5yb3dzcGFuXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGJveC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm94SW5kZXhcbiAgICAgKi9cbiAgICBsZXQgcmVtb3ZlQm94ID0gZnVuY3Rpb24gKGJveEluZGV4KSB7XG4gICAgICAgIGxldCBlbGVtID0gYm94ZXNbYm94SW5kZXhdLl9lbGVtZW50O1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICAgIGJveGVzLnNwbGljZShib3hJbmRleCwgMSk7XG5cbiAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIGJveC4gQm94IG11c3QgY29udGFpbiBhdCBsZWFzdCB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gb2YgdGhlIGJveCxcbiAgICAgKiBjb250ZW50IGVsZW1lbnQgaXMgb3B0aW9uYWwuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBCb3ggZGltZW5zaW9ucy5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgaW5zZXJ0IHdhcyBwb3NzaWJsZS5cbiAgICAgKi9cbiAgICBsZXQgaW5zZXJ0Qm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBtb3ZpbmdCb3ggPSBib3g7XG5cbiAgICAgICAgaWYgKGJveC5yb3dzID09PSB1bmRlZmluZWQgJiYgYm94LmNvbHVtbiA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBib3gucm93c3BhbiA9PT0gdW5kZWZpbmVkICYmIGJveC5jb2x1bW5zcGFuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNVcGRhdGVWYWxpZChib3gpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJldlBvc2l0aW9ucyA9IGNvcHlCb3hlcygpO1xuXG4gICAgICAgIGxldCBtb3ZlZEJveGVzID0gW2JveF07XG4gICAgICAgIGxldCB2YWxpZE1vdmUgPSBtb3ZlQm94KGJveCwgYm94LCBtb3ZlZEJveGVzKTtcbiAgICAgICAgbW92aW5nQm94ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmICh2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgIGJveEhhbmRsZXIuY3JlYXRlQm94KGJveCk7XG4gICAgICAgICAgICBib3hlcy5wdXNoKGJveCk7XG5cbiAgICAgICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcbiAgICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cblxuICAgICAgICByZXN0b3JlT2xkUG9zaXRpb25zKHByZXZQb3NpdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBhIHBvc2l0aW9uIG9yIHNpemUgb2YgYm94LlxuICAgICAqXG4gICAgICogV29ya3MgaW4gcG9zdGVyaW9yIGZhc2hpb24sIGFraW4gdG8gYXNrIGZvciBmb3JnaXZlbmVzcyByYXRoZXIgdGhhbiBmb3JcbiAgICAgKiBwZXJtaXNzaW9uLlxuICAgICAqIExvZ2ljOlxuICAgICAqXG4gICAgICogMS4gSXMgdXBkYXRlVG8gYSB2YWxpZCBzdGF0ZT9cbiAgICAgKiAgICAxLjEgTm86IFJldHVybiBmYWxzZS5cbiAgICAgKiAyLiBTYXZlIHBvc2l0aW9ucy5cbiAgICAgKiAzLiBNb3ZlIGJveC5cbiAgICAgKiAgICAgIDMuMS4gSXMgYm94IG91dHNpZGUgYm9yZGVyP1xuICAgICAqICAgICAgICAgIDMuMS4xLiBZZXM6IENhbiBib3JkZXIgYmUgcHVzaGVkP1xuICAgICAqICAgICAgICAgICAgICAzLjEuMS4xLiBZZXM6IEV4cGFuZCBib3JkZXIuXG4gICAgICogICAgICAgICAgICAgIDMuMS4xLjIuIE5vOiBSZXR1cm4gZmFsc2UuXG4gICAgICogICAgICAzLjIuIERvZXMgYm94IGNvbGxpZGU/XG4gICAgICogICAgICAgICAgMy4yLjEuIFllczogQ2FsY3VsYXRlIG5ldyBib3ggcG9zaXRpb24gYW5kXG4gICAgICogICAgICAgICAgICAgICAgIGdvIGJhY2sgdG8gc3RlcCAxIHdpdGggdGhlIG5ldyBjb2xsaWRlZCBib3guXG4gICAgICogICAgICAgICAgMy4yLjIuIE5vOiBSZXR1cm4gdHJ1ZS5cbiAgICAgKiA0LiBJcyBtb3ZlIHZhbGlkP1xuICAgICAqICAgIDQuMS4gWWVzOiBVcGRhdGUgbnVtYmVyIHJvd3MgLyBjb2x1bW5zLlxuICAgICAqICAgIDQuMi4gTm86IFJldmVydCB0byBvbGQgcG9zaXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBUaGUgYm94IGJlaW5nIHVwZGF0ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVRvIFRoZSBuZXcgc3RhdGUuXG4gICAgICogQHJldHVybnMge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZUJveCA9IGZ1bmN0aW9uIChib3gsIHVwZGF0ZVRvKSB7XG4gICAgICAgIG1vdmluZ0JveCA9IGJveDtcblxuICAgICAgICBsZXQgcHJldlBvc2l0aW9ucyA9IGNvcHlCb3hlcygpXG5cbiAgICAgICAgbWFrZUNoYW5nZShib3gsIHVwZGF0ZVRvKTtcbiAgICAgICAgaWYgKCFpc1VwZGF0ZVZhbGlkKGJveCkpIHtcbiAgICAgICAgICAgIHJlc3RvcmVPbGRQb3NpdGlvbnMocHJldlBvc2l0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbW92ZWRCb3hlcyA9IFtib3hdO1xuICAgICAgICBsZXQgdmFsaWRNb3ZlID0gbW92ZUJveChib3gsIGJveCwgbW92ZWRCb3hlcyk7XG5cbiAgICAgICAgaWYgKHZhbGlkTW92ZSkge1xuICAgICAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuXG4gICAgICAgICAgICByZXR1cm4gbW92ZWRCb3hlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3RvcmVPbGRQb3NpdGlvbnMocHJldlBvc2l0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJZiBhIGRpbWVuc2lvbiBzdGF0ZSBpcyBub3QgYWRkZWQsIHVzZSB0aGUgYm94IGN1cnJlbnQgc3RhdGUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBCb3ggd2hpY2ggaXMgdXBkYXRpbmcuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVRvIE5ldyBkaW1lbnNpb24gc3RhdGUuXG4gICAgICovXG4gICAgbGV0IG1ha2VDaGFuZ2UgPSBmdW5jdGlvbiAoYm94LCB1cGRhdGVUbykge1xuICAgICAgICBpZiAodXBkYXRlVG8ucm93ICE9PSB1bmRlZmluZWQpIHtib3gucm93ID0gdXBkYXRlVG8ucm93O31cbiAgICAgICAgaWYgKHVwZGF0ZVRvLmNvbHVtbiAhPT0gdW5kZWZpbmVkKSB7Ym94LmNvbHVtbiA9IHVwZGF0ZVRvLmNvbHVtbjt9XG4gICAgICAgIGlmICh1cGRhdGVUby5yb3dzcGFuICE9PSB1bmRlZmluZWQpIHtib3gucm93c3BhbiA9IHVwZGF0ZVRvLnJvd3NwYW47fVxuICAgICAgICBpZiAodXBkYXRlVG8uY29sdW1uc3BhbiAhPT0gdW5kZWZpbmVkKSB7Ym94LmNvbHVtbnNwYW4gPSB1cGRhdGVUby5jb2x1bW5zcGFuO31cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGFuZCBoYW5kbGVzIGNvbGxpc2lvbnMgd2l0aCB3YWxsIGFuZCBib3hlcy5cbiAgICAgKiBXb3JrcyBhcyBhIHRyZWUsIHByb3BhZ2F0aW5nIG1vdmVzIGRvd24gdGhlIGNvbGxpc2lvbiB0cmVlIGFuZCByZXR1cm5zXG4gICAgICogICAgIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIGlmIHRoZSBib3ggaW5mcm9udCBpcyBhYmxlIHRvIG1vdmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4Y2x1ZGVCb3hcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBtb3ZlIGlzIHBvc3NpYmxlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgbGV0IG1vdmVCb3ggPSBmdW5jdGlvbiAoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIGlmIChpc0JveE91dHNpZGVCb3VuZGFyeShib3gpKSB7cmV0dXJuIGZhbHNlO31cblxuICAgICAgICBsZXQgaW50ZXJzZWN0ZWRCb3hlcyA9IGdldEludGVyc2VjdGVkQm94ZXMoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKTtcblxuICAgICAgICAvLyBIYW5kbGUgYm94IENvbGxpc2lvbiwgcmVjdXJzaXZlIG1vZGVsLlxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW50ZXJzZWN0ZWRCb3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKCFjb2xsaXNpb25IYW5kbGVyKGJveCwgaW50ZXJzZWN0ZWRCb3hlc1tpXSwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJvcGFnYXRlcyBib3ggY29sbGlzaW9ucy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG1vdmVkQm94ZXNcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiBtb3ZlIGlzIGFsbG93ZWRcbiAgICAgKi9cbiAgICBsZXQgY29sbGlzaW9uSGFuZGxlciA9IGZ1bmN0aW9uIChib3gsIGJveEIsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpIHtcbiAgICAgICAgc2V0Qm94UG9zaXRpb24oYm94LCBib3hCKVxuICAgICAgICByZXR1cm4gbW92ZUJveChib3hCLCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBuZXcgYm94IHBvc2l0aW9uIGJhc2VkIG9uIHRoZSBib3ggdGhhdCBwdXNoZWQgaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBCb3ggd2hpY2ggaGFzIG1vdmVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hCIEJveCB3aGljaCBpcyB0byBiZSBtb3ZlZC5cbiAgICAgKi9cbiAgICBsZXQgc2V0Qm94UG9zaXRpb24gPSBmdW5jdGlvbiAoYm94LCBib3hCKSB7XG4gICAgICAgIGJveEIucm93ICs9IGJveC5yb3cgKyBib3gucm93c3BhbiAtIGJveEIucm93O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGJveCwgZmluZHMgb3RoZXIgYm94ZXMgd2hpY2ggaW50ZXJzZWN0IHdpdGggaXQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4Y2x1ZGVCb3ggQXJyYXkgb2YgYm94ZXMuXG4gICAgICovXG4gICAgbGV0IGdldEludGVyc2VjdGVkQm94ZXMgPSBmdW5jdGlvbiAoYm94LCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSB7XG4gICAgICAgIGxldCBpbnRlcnNlY3RlZEJveGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBib3hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgLy8gRG9uJ3QgY2hlY2sgbW92aW5nIGJveCBhbmQgdGhlIGJveCBpdHNlbGYuXG4gICAgICAgICAgICBpZiAoYm94ICE9PSBib3hlc1tpXSAmJiBib3hlc1tpXSAhPT0gZXhjbHVkZUJveCkge1xuICAgICAgICAgICAgICAgIGlmIChkb0JveGVzSW50ZXJzZWN0KGJveCwgYm94ZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkQm94ZXMucHVzaChib3hlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdGVkQm94ZXMucHVzaChib3hlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluc2VydGlvblNvcnQoaW50ZXJzZWN0ZWRCb3hlcywgJ3JvdycpO1xuXG4gICAgICAgIHJldHVybiBpbnRlcnNlY3RlZEJveGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciAyIGJveGVzIGludGVyc2VjdCB1c2luZyBib3VuZGluZyBib3ggbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hBXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuIFRydWUgaWYgaW50ZXJzZWN0IGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGRvQm94ZXNJbnRlcnNlY3QgPSBmdW5jdGlvbiAoYm94LCBib3hCKSB7XG4gICAgICAgIHJldHVybiAoYm94LmNvbHVtbiA8IGJveEIuY29sdW1uICsgYm94Qi5jb2x1bW5zcGFuICYmXG4gICAgICAgICAgICAgICAgYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuID4gYm94Qi5jb2x1bW4gJiZcbiAgICAgICAgICAgICAgICBib3gucm93IDwgYm94Qi5yb3cgKyBib3hCLnJvd3NwYW4gJiZcbiAgICAgICAgICAgICAgICBib3gucm93c3BhbiArIGJveC5yb3cgPiBib3hCLnJvdyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIG51bWJlciBvZiBjb2x1bW5zLlxuICAgICAqL1xuICAgIGxldCB1cGRhdGVOdW1Db2x1bW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWF4Q29sdW1uID0gZ2V0TWF4TnVtKGJveGVzLCAnY29sdW1uJywgJ2NvbHVtbnNwYW4nKTtcblxuICAgICAgICBpZiAobWF4Q29sdW1uID49IGdyaWQubWluQ29sdW1ucykge1xuICAgICAgICAgICAgZ3JpZC5udW1Db2x1bW5zID0gbWF4Q29sdW1uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtb3ZpbmdCb3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChncmlkLm51bUNvbHVtbnMgLSBtb3ZpbmdCb3guY29sdW1uIC0gbW92aW5nQm94LmNvbHVtbnNwYW4gPT09IDAgJiZcbiAgICAgICAgICAgIGdyaWQubnVtQ29sdW1ucyA8IGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZ3JpZC5udW1Db2x1bW5zICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZ3JpZC5udW1Db2x1bW5zIC0gbW92aW5nQm94LmNvbHVtbi0gbW92aW5nQm94LmNvbHVtbnNwYW4gPiAxICYmXG4gICAgICAgICAgICBtb3ZpbmdCb3guY29sdW1uICsgbW92aW5nQm94LmNvbHVtbnNwYW4gPT09IG1heENvbHVtbiAmJlxuICAgICAgICAgICAgZ3JpZC5udW1Db2x1bW5zID4gZ3JpZC5taW5Db2x1bW5zICYmXG4gICAgICAgICAgICBncmlkLm51bUNvbHVtbnMgPCBncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIGdyaWQubnVtY29sdW1ucyA9IG1heENvbHVtbiArIDE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5jcmVhc2VzIG51bWJlciBvZiBncmlkLm51bVJvd3MgaWYgYm94IHRvdWNoZXMgYm90dG9tIG9mIHdhbGwuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1Db2x1bW5zXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaW5jcmVhc2VOdW1Db2x1bW5zID0gZnVuY3Rpb24gKGJveCwgbnVtQ29sdW1ucykge1xuICAgICAgICAvLyBEZXRlcm1pbmUgd2hlbiB0byBhZGQgZXh0cmEgcm93IHRvIGJlIGFibGUgdG8gbW92ZSBkb3duOlxuICAgICAgICAvLyAxLiBBbnl0aW1lIGRyYWdnaW5nIHN0YXJ0cy5cbiAgICAgICAgLy8gMi4gV2hlbiBkcmFnZ2luZyBzdGFydHMgYW5kIG1vdmluZyBib3ggaXMgY2xvc2UgdG8gYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKChib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW4pID09PSBncmlkLm51bUNvbHVtbnMgJiZcbiAgICAgICAgICAgIGdyaWQubnVtQ29sdW1ucyA8IGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZ3JpZC5udW1Db2x1bW5zICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVhc2VzIG51bWJlciBvZiBncmlkLm51bVJvd3MgdG8gZnVydGhlc3QgbGVmdHdhcmQgYm94LlxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gdHJ1ZSBpZiBpbmNyZWFzZSBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBkZWNyZWFzZU51bUNvbHVtbnMgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICBsZXQgbWF4Q29sdW1uTnVtID0gMDtcblxuICAgICAgICBib3hlcy5mb3JFYWNoKGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCAoYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuKSkge1xuICAgICAgICAgICAgICAgIG1heENvbHVtbk51bSA9IGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1heENvbHVtbk51bSA8IGdyaWQubnVtQ29sdW1ucykge2dyaWQubnVtQ29sdW1ucyA9IG1heENvbHVtbk51bTt9XG4gICAgICAgIGlmIChtYXhDb2x1bW5OdW0gPCBncmlkLm1pblJvd3MpIHtncmlkLm51bUNvbHVtbnMgPSBncmlkLm1pblJvd3M7fVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgcm93cyBkZXBlbmRzIG9uIHRocmVlIHRoaW5ncy5cbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT5NaW4gLyBNYXggUm93cy48L2xpPlxuICAgICAqICAgICA8bGk+TWF4IEJveC48L2xpPlxuICAgICAqICAgICA8bGk+RHJhZ2dpbmcgYm94IG5lYXIgYm90dG9tIGJvcmRlci48L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICpcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlTnVtUm93cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1heFJvdyA9IGdldE1heE51bShib3hlcywgJ3JvdycsICdyb3dzcGFuJyk7XG5cbiAgICAgICAgaWYgKG1heFJvdyA+PSBncmlkLm1pblJvd3MpIHtcbiAgICAgICAgICAgIGdyaWQubnVtUm93cyA9IG1heFJvdztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbW92aW5nQm94KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZpbmcgYm94IHdoZW4gY2xvc2UgdG8gYm9yZGVyLlxuICAgICAgICBpZiAoZ3JpZC5udW1Sb3dzIC0gbW92aW5nQm94LnJvdyAtIG1vdmluZ0JveC5yb3dzcGFuID09PSAwICYmXG4gICAgICAgICAgICBncmlkLm51bVJvd3MgPCBncmlkLm1heFJvd3MpIHtcbiAgICAgICAgICAgIGdyaWQubnVtUm93cyArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGdyaWQubnVtUm93cyAtIG1vdmluZ0JveC5yb3cgLSBtb3ZpbmdCb3gucm93c3BhbiA+IDEgJiZcbiAgICAgICAgICAgIG1vdmluZ0JveC5yb3cgKyBtb3ZpbmdCb3gucm93c3BhbiA9PT0gbWF4Um93ICYmXG4gICAgICAgICAgICBncmlkLm51bVJvd3MgPiBncmlkLm1pblJvd3MgJiZcbiAgICAgICAgICAgIGdyaWQubnVtUm93cyA8IGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZ3JpZC5udW1Sb3dzID0gbWF4Um93ICsgMTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmNyZWFzZXMgbnVtYmVyIG9mIGdyaWQubnVtUm93cyBpZiBib3ggdG91Y2hlcyBib3R0b20gb2Ygd2FsbC5cbiAgICAgKiBAcGFyYW0gYm94IHtPYmplY3R9XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaW5jcmVhc2VOdW1Sb3dzID0gZnVuY3Rpb24gKGJveCwgbnVtUm93cykge1xuICAgICAgICAvLyBEZXRlcm1pbmUgd2hlbiB0byBhZGQgZXh0cmEgcm93IHRvIGJlIGFibGUgdG8gbW92ZSBkb3duOlxuICAgICAgICAvLyAxLiBBbnl0aW1lIGRyYWdnaW5nIHN0YXJ0cy5cbiAgICAgICAgLy8gMi4gV2hlbiBkcmFnZ2luZyBzdGFydHMgQU5EIG1vdmluZyBib3ggaXMgY2xvc2UgdG8gYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKChib3gucm93ICsgYm94LnJvd3NwYW4pID09PSBncmlkLm51bVJvd3MgJiZcbiAgICAgICAgICAgIGdyaWQubnVtUm93cyA8IGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZ3JpZC5udW1Sb3dzICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVhc2VzIG51bWJlciBvZiBncmlkLm51bVJvd3MgdG8gZnVydGhlc3QgZG93bndhcmQgYm94LlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluY3JlYXNlIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGRlY3JlYXNlTnVtUm93cyA9IGZ1bmN0aW9uICAoKSB7XG4gICAgICAgIGxldCBtYXhSb3dOdW0gPSAwO1xuXG4gICAgICAgIGJveGVzLmZvckVhY2goZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAgICAgaWYgKG1heFJvd051bSA8IChib3gucm93ICsgYm94LnJvd3NwYW4pKSB7XG4gICAgICAgICAgICAgICAgbWF4Um93TnVtID0gYm94LnJvdyArIGJveC5yb3dzcGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWF4Um93TnVtIDwgZ3JpZC5udW1Sb3dzKSB7Z3JpZC5udW1Sb3dzID0gbWF4Um93TnVtO31cbiAgICAgICAgaWYgKG1heFJvd051bSA8IGdyaWQubWluUm93cykge2dyaWQubnVtUm93cyA9IGdyaWQubWluUm93czt9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBtaW4sIG1heCBib3gtc2l6ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgbGV0IGlzVXBkYXRlVmFsaWQgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGlmIChib3gucm93c3BhbiA8IGdyaWQubWluUm93c3BhbiB8fFxuICAgICAgICAgICAgYm94LnJvd3NwYW4gPiBncmlkLm1heFJvd3NwYW4gfHxcbiAgICAgICAgICAgIGJveC5jb2x1bW5zcGFuIDwgZ3JpZC5taW5Db2x1bW5zcGFuIHx8XG4gICAgICAgICAgICBib3guY29sdW1uc3BhbiA+IGdyaWQubWF4Q29sdW1uc3Bhbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgYm9yZGVyIGNvbGxpc2lvbnMgYnkgcmV2ZXJ0aW5nIGJhY2sgdG8gY2xvc2VzdCBlZGdlIHBvaW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBjb2xsaWRlZCBhbmQgY2Fubm90IG1vdmUgd2FsbCBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBpc0JveE91dHNpZGVCb3VuZGFyeSA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgLy8gVG9wIGFuZCBsZWZ0IGJvcmRlci5cbiAgICAgICAgaWYgKGJveC5jb2x1bW4gPCAwIHx8XG4gICAgICAgICAgICBib3gucm93IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSaWdodCBhbmQgYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKGJveC5yb3cgKyBib3gucm93c3BhbiA+IGdyaWQubWF4Um93cyB8fFxuICAgICAgICAgICAgYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuID4gZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBjcmVhdGVCb3hFbGVtZW50cyxcbiAgICAgICAgdXBkYXRlQm94LFxuICAgICAgICB1cGRhdGVOdW1Sb3dzLFxuICAgICAgICBpbmNyZWFzZU51bVJvd3MsXG4gICAgICAgIGRlY3JlYXNlTnVtUm93cyxcbiAgICAgICAgdXBkYXRlTnVtQ29sdW1ucyxcbiAgICAgICAgaW5jcmVhc2VOdW1Db2x1bW5zLFxuICAgICAgICBkZWNyZWFzZU51bUNvbHVtbnMsXG4gICAgICAgIGdldEJveCxcbiAgICAgICAgaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3hcbiAgICB9KTtcbn0iLCIvKipcbiAqIG1vdXNlSGFuZGxlci5qczogSW5pdGlhbGl6ZXMgYW5kIHNldHMgdXAgdGhlIGV2ZW50cyBmb3IgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAqL1xuXG5pbXBvcnQge2ZpbmRQYXJlbnR9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb3VzZUhhbmRsZXIoY29tcCkge1xuICAgIGxldCB7ZHJhZ2dlciwgcmVzaXplciwgZ3JpZCwgZW5naW5lfSA9IGNvbXA7XG5cbiAgICBsZXQgaW5wdXRUYWdzID0gWydzZWxlY3QnLCAnaW5wdXQnLCAndGV4dGFyZWEnLCAnYnV0dG9uJ107XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge2dyaWQuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHttb3VzZURvd24oZSwgZ3JpZC5fZWxlbWVudCk7IGUucHJldmVudERlZmF1bHQoKTt9LCBmYWxzZSk7fVxuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGUsIGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBFeGl0IGlmOlxuICAgICAgICAvLyAxLiB0aGUgdGFyZ2V0IGhhcyBpdCdzIG93biBjbGljayBldmVudCBvclxuICAgICAgICAvLyAyLiB0YXJnZXQgaGFzIG9uY2xpY2sgYXR0cmlidXRlIG9yXG4gICAgICAgIC8vIDMuIFJpZ2h0IC8gbWlkZGxlIGJ1dHRvbiBjbGlja2VkIGluc3RlYWQgb2YgbGVmdC5cbiAgICAgICAgaWYgKGlucHV0VGFncy5pbmRleE9mKG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkgPiAtMSkge3JldHVybjt9XG4gICAgICAgIGlmIChub2RlLmhhc0F0dHJpYnV0ZSgnb25jbGljaycpKSB7cmV0dXJuO31cbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDIgfHwgZS53aGljaCA9PT0gMykge3JldHVybjt9XG5cbiAgICAgICAgLy8gSGFuZGxlIGRyYWcgLyByZXNpemUgZXZlbnQuXG4gICAgICAgIGlmIChub2RlLmNsYXNzTmFtZS5pbmRleE9mKCdoYW5kbGUnKSA+IC0xKSB7aGFuZGxlRXZlbnQoZSwgcmVzaXplRXZlbnQpO31cbiAgICAgICAgZWxzZSBpZiAobm9kZS5jbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWRCb3gnKSA+IC0xKSB7aGFuZGxlRXZlbnQoZSwgZHJhZ0V2ZW50KTt9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUuY2xhc3NOYW1lLmluZGV4T2YoZ3JpZC5kcmFnZ2FibGUuaGFuZGxlKSA+IC0xKSB7aGFuZGxlRXZlbnQoZSwgZHJhZ0V2ZW50KTt9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlRXZlbnQoZSwgY2IpIHtcbiAgICAgICAgbGV0IGJveEVsZW1lbnQgPSBmaW5kUGFyZW50KGUudGFyZ2V0LCAnZGFzaGdyaWRCb3gnKTtcblxuICAgICAgICBsZXQgYm94ID0gZW5naW5lLmdldEJveChib3hFbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgICAgICBpZiAoYm94KSB7XG4gICAgICAgICAgICBjYihib3gsIGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhZ0V2ZW50KGJveCwgZSkge1xuICAgICAgICBpZiAoIWdyaWQuZHJhZ2dhYmxlLmVuYWJsZWQgfHwgIWJveC5kcmFnZ2FibGUpIHtyZXR1cm47fVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnc3RhcnQnKTtcbiAgICAgICAgZHJhZ2dlci5kcmFnU3RhcnQoYm94LCBlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZHJhZ0VuZCwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmFnLCBmYWxzZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhZyhlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZHJhZycpO1xuICAgICAgICAgICAgZHJhZ2dlci5kcmFnKGJveCwgZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmFnRW5kKGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnZW5kJyk7XG4gICAgICAgICAgICBkcmFnZ2VyLmRyYWdFbmQoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBkcmFnRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmFnLCBmYWxzZSk7XG4gICAgICAgICAgICAvLyBlbmdpbmUuc2V0QWN0aXZlQm94KHt9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2l6ZUV2ZW50KGJveCwgZSkge1xuICAgICAgICBpZiAoIWdyaWQucmVzaXphYmxlLmVuYWJsZWQgfHwgIWJveC5yZXNpemFibGUpIHtyZXR1cm47fVxuXG4gICAgICAgIHJlc2l6ZXIucmVzaXplU3RhcnQoYm94LCBlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVzaXplRW5kLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlc2l6ZSwgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZShlKSB7cmVzaXplci5yZXNpemUoYm94LCBlKTtlLnByZXZlbnREZWZhdWx0KCk7fVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUVuZChlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVzaXplRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCByZXNpemUsIGZhbHNlKTtcblxuICAgICAgICAgICAgcmVzaXplci5yZXNpemVFbmQoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgaW5pdGlhbGl6ZVxuICAgIH0pO1xuXG59XG4iLCJleHBvcnQgZGVmYXVsdCBSZW5kZXI7XG5cbmZ1bmN0aW9uIFJlbmRlcihjb21wKSB7XG4gICAgbGV0IHtncmlkfSA9IGNvbXA7XG5cbiAgICAvLyBTdGFydCByb3cgLyBjb2x1bW4gZGVub3RlcyB0aGUgcGl4ZWwgYXQgd2hpY2ggZWFjaCBjZWxsIHN0YXJ0cyBhdC5cbiAgICBsZXQgc3RhcnRDb2x1bW4gPSBbXTtcbiAgICBsZXQgc3RhcnRSb3cgPSBbXTtcblxuICAgIGxldCBzZXRHcmlkV2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdyaWQuX2VsZW1lbnQuc3R5bGUud2lkdGggPSAoZ3JpZC5jb2x1bW5XaWR0aCkgPyBncmlkLmNvbHVtbldpZHRoICogZ3JpZC5udW1Db2x1bW5zICsgKGdyaWQubnVtQ29sdW1ucyArIDEpICogZ3JpZC54TWFyZ2luICsgJ3B4JyA6IGdyaWQuX2VsZW1lbnQucGFyZW50Tm9kZS5vZmZzZXRXaWR0aCArICdweCc7XG4gICAgfTtcblxuICAgIGxldCBzZXRDb2x1bW5XaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ3JpZC5jb2x1bW5XaWR0aCA9IChncmlkLmNvbHVtbldpZHRoKSA/IGdyaWQuY29sdW1uV2lkdGggOiAoZ3JpZC5fZWxlbWVudC5wYXJlbnROb2RlLm9mZnNldFdpZHRoIC0gKGdyaWQubnVtQ29sdW1ucyArIDEpICogZ3JpZC54TWFyZ2luKSAvIGdyaWQubnVtQ29sdW1ucztcbiAgICB9O1xuXG4gICAgbGV0IHNldEdyaWRIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdyaWQuX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gKGdyaWQucm93SGVpZ2h0KSA/IGdyaWQucm93SGVpZ2h0ICogZ3JpZC5udW1Sb3dzICsgKGdyaWQubnVtUm93cyArIDEpICogZ3JpZC55TWFyZ2luICsgJ3B4JyA6IGdyaWQuX2VsZW1lbnQucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgIH07XG5cbiAgICBsZXQgc2V0Um93SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBncmlkLnJvd0hlaWdodCA9IChncmlkLnJvd0hlaWdodCkgPyBncmlkLnJvd0hlaWdodCA6IChncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0IC0gKGdyaWQubnVtUm93cyArIDEpICogZ3JpZC55TWFyZ2luKSAvIGdyaWQubnVtUm93cztcbiAgICB9O1xuXG4gICAgbGV0IHNldEJveFhQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb2x1bW4pIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gY29sdW1uICogZ3JpZC5jb2x1bW5XaWR0aCArIGdyaWQueE1hcmdpbiAqIChjb2x1bW4gKyAxKSArICdweCc7XG4gICAgfTtcblxuICAgIGxldCBzZXRCb3hZUG9zaXRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgcm93KSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gcm93ICogZ3JpZC5yb3dIZWlnaHQgKyBncmlkLnlNYXJnaW4gKiAocm93ICsgMSkgKyAncHgnO1xuICAgIH07XG5cbiAgICBsZXQgc2V0Qm94V2lkdGggPSBmdW5jdGlvbiAoZWxlbWVudCwgY29sdW1uc3Bhbikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gY29sdW1uc3BhbiAqIGdyaWQuY29sdW1uV2lkdGggKyBncmlkLnhNYXJnaW4gKiAoY29sdW1uc3BhbiAtIDEpICsgJ3B4JztcbiAgICB9O1xuXG4gICAgbGV0IHNldEJveEhlaWdodCA9IGZ1bmN0aW9uIChlbGVtZW50LCByb3dzcGFuKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcm93c3BhbiAqIGdyaWQucm93SGVpZ2h0ICsgZ3JpZC55TWFyZ2luICogKHJvd3NwYW4gLSAxKSArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGNlbGwgY2VudHJvaWRzIHdoaWNoIGFyZSB1c2VkIHRvIGNvbXB1dGUgY2xvc2VzdCBjZWxsXG4gICAgICogICAgIHdoZW4gZHJhZ2dpbmcgYSBib3guXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bVJvd3MgVGhlIHRvdGFsIG51bWJlciBvZiByb3dzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1Db2x1bW5zIFRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cy5cbiAgICAgKi9cbiAgICBsZXQgc2V0Q2VsbENlbnRyb2lkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhcnRSb3cgPSBbXTtcbiAgICAgICAgc3RhcnRDb2x1bW4gPSBbXTtcbiAgICAgICAgbGV0IHN0YXJ0O1xuICAgICAgICBsZXQgc3RvcDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBzdGFydCA9IGkgKiAoZ3JpZC5yb3dIZWlnaHQgKyBncmlkLnlNYXJnaW4pICsgZ3JpZC55TWFyZ2luIC8gMjtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydCArIGdyaWQucm93SGVpZ2h0ICsgZ3JpZC55TWFyZ2luO1xuICAgICAgICAgICAgc3RhcnRSb3cucHVzaChbTWF0aC5mbG9vcihzdGFydCksIE1hdGguY2VpbChzdG9wKV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLm51bUNvbHVtbnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgc3RhcnQgPSBpICogKGdyaWQuY29sdW1uV2lkdGggKyBncmlkLnhNYXJnaW4pICsgZ3JpZC54TWFyZ2luIC8gMjtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydCArIGdyaWQuY29sdW1uV2lkdGggKyBncmlkLnhNYXJnaW47XG4gICAgICAgICAgICBzdGFydENvbHVtbi5wdXNoKFtNYXRoLmZsb29yKHN0YXJ0KSwgTWF0aC5jZWlsKHN0b3ApXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgd2hpY2ggY2VsbHMgYm94IGludGVyc2VjdHMgd2l0aC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94UG9zaXRpb24gQ29udGFpbnMgdG9wL2JvdHRvbS9sZWZ0L3JpZ2h0IGJveCBwb3NpdGlvblxuICAgICAqICAgICBpbiBweC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtUm93cyBIb3cgbWFueSByb3dzIHRoZSBib3ggc3BhbnMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bUNvbHVtbnMgSG93IG1hbnkgcm93cyB0aGUgYm94IHNwYW5zLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJvdyBvciBjb2x1bW4gd2hpY2ggZWFjaCBzaWRlIGlzIGZvdW5kIGluLlxuICAgICAqICAgICBGb3IgaW5zdGFuY2UsIGJveExlZnQ6IGNvbHVtbiA9IDAsIGJveFJpZ2h0OiBjb2x1bW4gPSAxLFxuICAgICAqICAgICBCb3hUb3A6IHJvdyA9IDAsIEJveEJvdHRvbTogcm93ID0gMy5cbiAgICAgKi9cbiAgICBsZXQgZmluZEludGVyc2VjdGVkQ2VsbHMgPSBmdW5jdGlvbiAoY29tcCkge1xuICAgICAgICBsZXQge3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdH0gPSBjb21wO1xuICAgICAgICBsZXQgYm94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tO1xuXG4gICAgICAgIC8vIEZpbmQgdG9wIGFuZCBib3R0b20gaW50ZXJzZWN0aW9uIGNlbGwgcm93LlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAodG9wID49IHN0YXJ0Um93W2ldWzBdICYmIHRvcCA8PSBzdGFydFJvd1tpXVsxXSkge2JveFRvcCA9IGk7fVxuICAgICAgICAgICAgaWYgKGJvdHRvbSA+PSBzdGFydFJvd1tpXVswXSAmJiBib3R0b20gPD0gc3RhcnRSb3dbaV1bMV0pIHtib3hCb3R0b20gPSBpO31cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgbGVmdCBhbmQgcmlnaHQgaW50ZXJzZWN0aW9uIGNlbGwgY29sdW1uLlxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyaWQubnVtQ29sdW1uczsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAobGVmdCA+PSBzdGFydENvbHVtbltqXVswXSAmJiBsZWZ0IDw9IHN0YXJ0Q29sdW1uW2pdWzFdKSB7Ym94TGVmdCA9IGo7fVxuICAgICAgICAgICAgaWYgKHJpZ2h0ID49IHN0YXJ0Q29sdW1uW2pdWzBdICYmIHJpZ2h0IDw9IHN0YXJ0Q29sdW1uW2pdWzFdKSB7Ym94UmlnaHQgPSBqO31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IGNsb3Nlc3QgY2VsbCBnaXZlbiAocm93LCBjb2x1bW4pIHBvc2l0aW9uIGluIHB4LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hQb3NpdGlvbiBDb250YWlucyB0b3AvYm90dG9tL2xlZnQvcmlnaHQgYm94IHBvc2l0aW9uXG4gICAgICogICAgIGluIHB4LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1Sb3dzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bUNvbHVtbnNcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGxldCBnZXRDbG9zZXN0Q2VsbHMgPSBmdW5jdGlvbiAoY29tcCkge1xuICAgICAgICBsZXQge3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdH0gPSBjb21wO1xuICAgICAgICBsZXQge2JveExlZnQsIGJveFJpZ2h0LCBib3hUb3AsIGJveEJvdHRvbX0gPSBmaW5kSW50ZXJzZWN0ZWRDZWxscyhjb21wKTtcblxuICAgICAgICBsZXQgY29sdW1uO1xuICAgICAgICBsZXQgbGVmdE92ZXJsYXA7XG4gICAgICAgIGxldCByaWdodE92ZXJsYXA7XG4gICAgICAgIC8vIERldGVybWluZSBpZiBlbm91Z2ggb3ZlcmxhcCBmb3IgaG9yaXpvbnRhbCBtb3ZlLlxuICAgICAgICBpZiAoYm94TGVmdCAhPT0gdW5kZWZpbmVkICYmIGJveFJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxlZnRPdmVybGFwID0gTWF0aC5hYnMobGVmdCAtIHN0YXJ0Q29sdW1uW2JveExlZnRdWzBdKTtcbiAgICAgICAgICAgIHJpZ2h0T3ZlcmxhcCA9IE1hdGguYWJzKHJpZ2h0IC0gc3RhcnRDb2x1bW5bYm94UmlnaHRdWzFdIC0gZ3JpZC54TWFyZ2luKTtcbiAgICAgICAgICAgIGlmIChsZWZ0T3ZlcmxhcCA8PSByaWdodE92ZXJsYXApIHtjb2x1bW4gPSBib3hMZWZ0O31cbiAgICAgICAgICAgIGVsc2Uge2NvbHVtbiA9IGJveExlZnQgKyAxO31cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb3c7XG4gICAgICAgIGxldCB0b3BPdmVybGFwO1xuICAgICAgICBsZXQgYm90dG9tT3ZlcmxhcDtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVub3VnaCBvdmVybGFwIGZvciB2ZXJ0aWNhbCBtb3ZlLlxuICAgICAgICBpZiAoYm94VG9wICE9PSB1bmRlZmluZWQgJiYgYm94Qm90dG9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvcE92ZXJsYXAgPSBNYXRoLmFicyh0b3AgLSBzdGFydFJvd1tib3hUb3BdWzBdKTtcbiAgICAgICAgICAgIGJvdHRvbU92ZXJsYXAgPSBNYXRoLmFicyhib3R0b20gLSBzdGFydFJvd1tib3hCb3R0b21dWzFdIC0gZ3JpZC55TWFyZ2luKTtcbiAgICAgICAgICAgIGlmICh0b3BPdmVybGFwIDw9IGJvdHRvbU92ZXJsYXApIHtyb3cgPSBib3hUb3A7fVxuICAgICAgICAgICAgZWxzZSB7cm93ID0gYm94VG9wICsgMTt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3JvdywgY29sdW1ufTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIHNldENlbGxDZW50cm9pZHMsXG4gICAgICAgIHNldENvbHVtbldpZHRoLFxuICAgICAgICBzZXRSb3dIZWlnaHQsXG4gICAgICAgIHNldEdyaWRIZWlnaHQsXG4gICAgICAgIHNldEdyaWRXaWR0aCxcbiAgICAgICAgc2V0Qm94WFBvc2l0aW9uLFxuICAgICAgICBzZXRCb3hZUG9zaXRpb24sXG4gICAgICAgIHNldEJveFdpZHRoLFxuICAgICAgICBzZXRCb3hIZWlnaHQsXG4gICAgICAgIGZpbmRJbnRlcnNlY3RlZENlbGxzLFxuICAgICAgICBnZXRDbG9zZXN0Q2VsbHNcbiAgIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgUmVzaXplcjtcblxuZnVuY3Rpb24gUmVzaXplcihjb21wKSB7XG4gICAgbGV0IHtncmlkLCByZW5kZXJlciwgZW5naW5lfSA9IGNvbXA7XG5cbiAgICBsZXQgbWluV2lkdGgsIG1pbkhlaWdodCwgZWxlbWVudExlZnQsIGVsZW1lbnRUb3AsIGVsZW1lbnRXaWR0aCwgZWxlbWVudEhlaWdodCwgbWluVG9wLCBtYXhUb3AsIG1pbkxlZnQsIG1heExlZnQsIGNsYXNzTmFtZSxcbiAgICBtb3VzZVggPSAwLFxuICAgIG1vdXNlWSA9IDAsXG4gICAgbGFzdE1vdXNlWCA9IDAsXG4gICAgbGFzdE1vdXNlWSA9IDAsXG4gICAgbU9mZlggPSAwLFxuICAgIG1PZmZZID0gMCxcbiAgICBuZXdTdGF0ZSA9IHt9LFxuICAgIHByZXZTdGF0ZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgKiBTZXQgYWN0aXZlIGJveCwgY3JlYXRlIHNoYWRvd2JveCwgcmVtb3ZlIHNtb290aCB0cmFuc2l0aW9ucyBmb3IgYm94LFxuICAgICogYW5kIGluaXRpYWxpemUgbW91c2UgdmFyaWFibGVzLiBGaW5hbGx5LCBtYWtlIGNhbGwgdG8gYXBpIHRvIGNoZWNrIGlmLFxuICAgICogYW55IGJveCBpcyBjbG9zZSB0byBib3R0b20gLyByaWdodCBlZGdlLlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHJlc2l6ZVN0YXJ0ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBjbGFzc05hbWUgPSBlLnRhcmdldC5jbGFzc05hbWU7XG5cbiAgICAgICAgLy8gUmVtb3ZlcyB0cmFuc2l0aW9ucywgZGlzcGxheXMgYW5kIGluaXRpYWxpemVzIHBvc2l0aW9ucyBmb3IgcHJldmlldyBib3guXG4gICAgICAgIGJveC5lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnTm9uZSc7XG4gICAgICAgIGdyaWQuc2hhZG93Qm94RWxlbWVudC5zdHlsZS5sZWZ0ID0gYm94LmVsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgZ3JpZC5zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcCA9IGJveC5lbGVtZW50LnN0eWxlLnRvcDtcbiAgICAgICAgZ3JpZC5zaGFkb3dCb3hFbGVtZW50LnN0eWxlLndpZHRoID0gYm94LmVsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGdyaWQuc2hhZG93Qm94RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBib3guZWxlbWVudC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIGdyaWQuc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgICAvLyBNb3VzZSB2YWx1ZXMuXG4gICAgICAgIG1pbldpZHRoID0gZ3JpZC5jb2x1bW5XaWR0aDtcbiAgICAgICAgbWluSGVpZ2h0ID0gZ3JpZC5yb3dIZWlnaHQ7XG4gICAgICAgIGxhc3RNb3VzZVggPSBlLnBhZ2VYO1xuICAgICAgICBsYXN0TW91c2VZID0gZS5wYWdlWTtcbiAgICAgICAgZWxlbWVudExlZnQgPSBwYXJzZUludChib3guZWxlbWVudC5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgIGVsZW1lbnRUb3AgPSBwYXJzZUludChib3guZWxlbWVudC5zdHlsZS50b3AsIDEwKTtcbiAgICAgICAgZWxlbWVudFdpZHRoID0gYm94LmVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGVsZW1lbnRIZWlnaHQgPSBib3guZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgZW5naW5lLnVwZGF0ZU51bVJvd3ModHJ1ZSk7XG4gICAgICAgIGVuZ2luZS51cGRhdGVOdW1Db2x1bW5zKHRydWUpO1xuICAgICAgICBlbmdpbmUudXBkYXRlRGltZW5zaW9uU3RhdGUoKTtcblxuICAgICAgICBpZiAoZ3JpZC5yZXNpemFibGUucmVzaXplU3RhcnQpIHtncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCgpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHJlc2l6ZSA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgdXBkYXRlUmVzaXppbmdFbGVtZW50KGJveCwgZSk7XG5cbiAgICAgICAgaWYgKGdyaWQubGl2ZUNoYW5nZXMpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoIGNlbGwgdG8gc25hcCBzaGFkb3dib3ggdG8uXG4gICAgICAgICAgICBsZXQge2JveExlZnQsIGJveFJpZ2h0LCBib3hUb3AsIGJveEJvdHRvbX0gPSByZW5kZXJlci5cbiAgICAgICAgICAgICAgICBmaW5kSW50ZXJzZWN0ZWRDZWxscyh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guZWxlbWVudC5vZmZzZXRMZWZ0ICsgYm94LmVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogYm94LmVsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IGJveC5lbGVtZW50Lm9mZnNldFRvcCArIGJveC5lbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbmV3U3RhdGUgPSB7cm93OiBib3hUb3AsIGNvbHVtbjogYm94TGVmdCwgcm93c3BhbjogYm94Qm90dG9tIC0gYm94VG9wICsgMSwgY29sdW1uc3BhbjogYm94UmlnaHQgLSBib3hMZWZ0ICsgMX07XG4gICAgICAgICAgICByZXNpemVCb3goYm94LCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChncmlkLnJlc2l6YWJsZS5yZXNpemluZykge2dyaWQucmVzaXphYmxlLnJlc2l6aW5nKCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgcmVzaXplRW5kID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAoIWdyaWQubGl2ZUNoYW5nZXMpIHtcbiAgICAgICAgICAgIGxldCB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfSA9IHJlbmRlcmVyLlxuICAgICAgICAgICAgICAgIGZpbmRJbnRlcnNlY3RlZENlbGxzKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogYm94LmVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IGJveC5lbGVtZW50Lm9mZnNldExlZnQgKyBib3guZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBib3guZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogYm94LmVsZW1lbnQub2Zmc2V0VG9wICsgYm94LmVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBudW1Sb3dzOiBlbmdpbmUuZ2V0TnVtUm93cygpLFxuICAgICAgICAgICAgICAgICAgICBudW1Db2x1bW5zOiBlbmdpbmUuZ2V0TnVtQ29sdW1ucygpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHtyb3c6IGJveFRvcCwgY29sdW1uOiBib3hMZWZ0LCByb3dzcGFuOiBib3hCb3R0b20gLSBib3hUb3AgKyAxLCBjb2x1bW5zcGFuOiBib3hSaWdodCAtIGJveExlZnQgKyAxfTtcbiAgICAgICAgICAgIHJlc2l6ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm94LmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IC4zcywgbGVmdCAuM3MsIHRvcCAuM3MsIHdpZHRoIC4zcywgaGVpZ2h0IC4zcyc7XG4gICAgICAgIGJveC5lbGVtZW50LnN0eWxlLmxlZnQgPSBncmlkLnNoYWRvd0JveEVsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgYm94LmVsZW1lbnQuc3R5bGUudG9wID0gZ3JpZC5zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcDtcbiAgICAgICAgYm94LmVsZW1lbnQuc3R5bGUud2lkdGggPSBncmlkLnNoYWRvd0JveEVsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGJveC5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGdyaWQuc2hhZG93Qm94RWxlbWVudC5zdHlsZS5oZWlnaHQ7XG5cbiAgICAgICAgLy8gR2l2ZSB0aW1lIGZvciBwcmV2aWV3Ym94IHRvIHNuYXAgYmFjayB0byB0aWxlLlxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdyaWQuc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgICBlbmdpbmUudXBkYXRlTnVtUm93cyhmYWxzZSk7XG4gICAgICAgICAgICBlbmdpbmUudXBkYXRlTnVtQ29sdW1ucyhmYWxzZSk7XG4gICAgICAgICAgICBlbmdpbmUudXBkYXRlRGltZW5zaW9uU3RhdGUoKTtcblxuICAgICAgICB9LCBncmlkLnNuYXBiYWNrKTtcblxuICAgICAgICBpZiAoZ3JpZC5yZXNpemFibGUucmVzaXplRW5kKSB7Z3JpZC5yZXNpemFibGUucmVzaXplRW5kKCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgcmVzaXplQm94ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAobmV3U3RhdGUucm93ICE9PSBwcmV2U3RhdGUucm93ICB8fFxuICAgICAgICAgICAgbmV3U3RhdGUuY29sdW1uICE9PSBwcmV2U3RhdGUuY29sdW1uICB8fFxuICAgICAgICAgICAgbmV3U3RhdGUucm93c3BhbiAhPT0gcHJldlN0YXRlLnJvd3NwYW4gIHx8XG4gICAgICAgICAgICBuZXdTdGF0ZS5jb2x1bW5zcGFuICE9PSBwcmV2U3RhdGUuY29sdW1uc3BhbiApIHtcblxuICAgICAgICAgICAgbGV0IHVwZGF0ZSA9IGVuZ2luZS51cGRhdGVCb3goYm94LCBuZXdTdGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZUdyaWREaW1lbnNpb24gcHJldmlldyBib3guXG4gICAgICAgICAgICBpZiAodXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94WFBvc2l0aW9uKGdyaWQuc2hhZG93Qm94RWxlbWVudCwgdXBkYXRlLmNvbHVtbik7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94WVBvc2l0aW9uKGdyaWQuc2hhZG93Qm94RWxlbWVudCwgdXBkYXRlLnJvdyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94V2lkdGgoZ3JpZC5zaGFkb3dCb3hFbGVtZW50LCB1cGRhdGUuY29sdW1uc3Bhbik7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94SGVpZ2h0KGdyaWQuc2hhZG93Qm94RWxlbWVudCwgdXBkYXRlLnJvd3NwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gcG9pbnQgaW4gYXR0ZW1wdGluZyB1cGRhdGUgaWYgbm90IHN3aXRjaGVkIHRvIG5ldyBjZWxsLlxuICAgICAgICBwcmV2U3RhdGUucm93ID0gbmV3U3RhdGUucm93O1xuICAgICAgICBwcmV2U3RhdGUuY29sdW1uID0gbmV3U3RhdGUuY29sdW1uO1xuICAgICAgICBwcmV2U3RhdGUucm93c3BhbiA9IG5ld1N0YXRlLnJvd3NwYW47XG4gICAgICAgIHByZXZTdGF0ZS5jb2x1bW5zcGFuID0gbmV3U3RhdGUuY29sdW1uc3BhbjtcblxuICAgICAgICBpZiAoZ3JpZC5yZXNpemFibGUucmVzaXppbmcpIHtncmlkLnJlc2l6YWJsZS5yZXNpemluZygpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHVwZGF0ZVJlc2l6aW5nRWxlbWVudCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IG1vdXNlIHBvc2l0aW9uLlxuICAgICAgICBtb3VzZVggPSBlLnBhZ2VYICsgd2luZG93LnNjcm9sbFg7XG4gICAgICAgIG1vdXNlWSA9IGUucGFnZVkgKyB3aW5kb3cuc2Nyb2xsWTtcblxuICAgICAgICAvLyBHZXQgdGhlIGRlbHRhc1xuICAgICAgICBsZXQgZGlmZlggPSBtb3VzZVggLSBsYXN0TW91c2VYICsgbU9mZlg7XG4gICAgICAgIGxldCBkaWZmWSA9IG1vdXNlWSAtIGxhc3RNb3VzZVkgKyBtT2ZmWTtcbiAgICAgICAgbU9mZlggPSBtT2ZmWSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGxhc3QgcHJvY2Vzc2VkIG1vdXNlIHBvc2l0aW9ucy5cbiAgICAgICAgbGFzdE1vdXNlWCA9IG1vdXNlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IG1vdXNlWTtcblxuICAgICAgICBsZXQgZFkgPSBkaWZmWTtcbiAgICAgICAgbGV0IGRYID0gZGlmZlg7XG5cbiAgICAgICAgbWluVG9wID0gZ3JpZC55TWFyZ2luO1xuICAgICAgICBtYXhUb3AgPSBncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIGdyaWQueU1hcmdpbjtcbiAgICAgICAgbWluTGVmdCA9IGdyaWQueE1hcmdpbjtcbiAgICAgICAgbWF4TGVmdCA9IGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSBncmlkLnhNYXJnaW47XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdncmlkLWJveC1oYW5kbGUtdycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdncmlkLWJveC1oYW5kbGUtbncnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZ3JpZC1ib3gtaGFuZGxlLXN3JykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRXaWR0aCAtIGRYIDwgbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBkaWZmWCA9IGVsZW1lbnRXaWR0aCAtIG1pbldpZHRoO1xuICAgICAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudExlZnQgKyBkWCA8IG1pbkxlZnQpIHtcbiAgICAgICAgICAgICAgICBkaWZmWCA9IG1pbkxlZnQgLSBlbGVtZW50TGVmdDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50TGVmdCArPSBkaWZmWDtcbiAgICAgICAgICAgIGVsZW1lbnRXaWR0aCAtPSBkaWZmWDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZ3JpZC1ib3gtaGFuZGxlLWUnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZ3JpZC1ib3gtaGFuZGxlLW5lJykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2dyaWQtYm94LWhhbmRsZS1zZScpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50V2lkdGggKyBkWCA8IG1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtaW5XaWR0aCAtIGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoICsgZFggPiBtYXhMZWZ0KSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtYXhMZWZ0IC0gZWxlbWVudExlZnQgLSBlbGVtZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgbU9mZlggPSBkWCAtIGRpZmZYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudFdpZHRoICs9IGRpZmZYO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdncmlkLWJveC1oYW5kbGUtbicpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdncmlkLWJveC1oYW5kbGUtbncnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZ3JpZC1ib3gtaGFuZGxlLW5lJykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRIZWlnaHQgLSBkWSA8IG1pbkhlaWdodCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gZWxlbWVudEhlaWdodCAtIG1pbkhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRUb3AgKyBkWSA8IG1pblRvcCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gbWluVG9wIC0gZWxlbWVudFRvcDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50VG9wICs9IGRpZmZZO1xuICAgICAgICAgICAgZWxlbWVudEhlaWdodCAtPSBkaWZmWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZ3JpZC1ib3gtaGFuZGxlLXMnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZ3JpZC1ib3gtaGFuZGxlLXN3JykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2dyaWQtYm94LWhhbmRsZS1zZScpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50SGVpZ2h0ICsgZFkgPCBtaW5IZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBkaWZmWSA9IG1pbkhlaWdodCAtIGVsZW1lbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCArIGRZID4gbWF4VG9wKSB7XG4gICAgICAgICAgICAgICAgZGlmZlkgPSBtYXhUb3AgLSBlbGVtZW50VG9wIC0gZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50SGVpZ2h0ICs9IGRpZmZZO1xuICAgICAgICB9XG5cbiAgICAgICAgYm94LmVsZW1lbnQuc3R5bGUudG9wID0gZWxlbWVudFRvcCArICdweCc7XG4gICAgICAgIGJveC5lbGVtZW50LnN0eWxlLmxlZnQgPSBlbGVtZW50TGVmdCArICdweCc7XG4gICAgICAgIGJveC5lbGVtZW50LnN0eWxlLndpZHRoID0gZWxlbWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgYm94LmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZWxlbWVudEhlaWdodCArICdweCc7XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgcmVzaXplU3RhcnQsXG4gICAgICAgIHJlc2l6ZSxcbiAgICAgICAgcmVzaXplRW5kXG4gICAgfSk7XG5cbn1cbiIsIi8vIHNoaW0gbGF5ZXIgd2l0aCBzZXRUaW1lb3V0IGZhbGxiYWNrIGZvciByZXF1aWVzdEFuaW1hdGlvbkZyYW1lXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24gKGNiKXtcbiAgICAgICAgICAgIGNiID0gY2IgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYiwgMTAwMCAvIDYwKTtcbiAgICAgICAgfTtcbn0pKCk7XG4iLCJcbi8qKlxuKiBcbiogQHBhcmFtIHt9ICBcbiogQHJldHVybnMgXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1heE51bShib3gsIGF0MSwgYXQyKSB7XG4gICAgbGV0IG1heFZhbCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJveC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoYm94W2ldW2F0MV0gKyBib3hbaV1bYXQyXSA+PSBtYXhWYWwpIHtcbiAgICAgICAgICAgIG1heFZhbCA9IGJveFtpXVthdDFdICsgYm94W2ldW2F0Ml07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWF4VmFsO1xufVxuXG4vKipcbiogXG4qIEBwYXJhbSB7fSAgXG4qIEByZXR1cm5zIFxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0ZWRBcnIob3JkZXIsIGF0dHIsIG9ianMpIHtcbiAgICBsZXQga2V5O1xuICAgIGxldCBhcnIgPSBbXTtcblxuICAgIE9iamVjdC5rZXlzKG9ianMpLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgaW5zZXJ0QnlPcmRlcihvcmRlciwgYXR0ciwgb2Jqc1tpXSwgYXJyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBhcnI7XG59XG5cbi8qKlxuKiBSZXR1cm5zIGEgbmV3IGFycmF5IHdpdGggdGhlIG5ld2x5IGluc2VydGVkIG9iamVjdC5cbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QnlPcmRlcihvcmRlciwgYXR0ciwgbywgYXJyKSB7XG4gICAgbGV0IGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluc2VydCBieSBvcmRlciwgc3RhcnQgZnVydGhlc3QgZG93bi5cbiAgICAgICAgLy8gSW5zZXJ0IGJldHdlZW4gMCBhbmQgbiAtMS5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKG9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5yb3cgPiBhcnJbaV0ucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgbyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8ucm93IDwgYXJyW2ldLnJvdykge1xuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIG8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBub3QgaW5iZXR3ZWVuIDAgYW5kIG4gLSAxLCBpbnNlcnQgbGFzdC5cbiAgICAgICAgaWYgKGxlbiA9PT0gYXJyLmxlbmd0aCkge2Fyci5wdXNoKG8pO31cbiAgICB9XG59XG5cbi8qKlxuKlxuKiBAcGFyYW0ge31cbiogQHJldHVybnNcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0aW9uU29ydChhLCBhdHRyKSB7XG4gICAgaWYgKGEubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGkgPSBhLmxlbmd0aDtcbiAgICB2YXIgdGVtcDtcbiAgICB2YXIgajtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGogPSBpO1xuICAgICAgICB3aGlsZSAoaiA+IDAgJiYgYVtqIC0gMV1bYXR0cl0gPCBhW2pdW2F0dHJdKSB7XG4gICAgICAgICAgICB0ZW1wID0gYVtqXTtcbiAgICAgICAgICAgIGFbal0gPSBhW2ogLSAxXTtcbiAgICAgICAgICAgIGFbaiAtIDFdID0gdGVtcDtcbiAgICAgICAgICAgIGogLT0gMTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4qXG4qIEBwYXJhbSB7fVxuKiBAcmV0dXJuc1xuKi9cbmV4cG9ydCBmdW5jdGlvbiBPYmplY3RMZW5ndGgob2JqZWN0KSB7XG4gICAgbGV0IGxlbmd0aCA9IDAsXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xufVxuXG4vKipcbipcbiogQHBhcmFtIHt9XG4qIEByZXR1cm5zXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50KGVsZW0sIHR5cGUsIGV2ZW50SGFuZGxlKSB7XG4gICAgaWYgKGVsZW0gPT09IG51bGwgfHwgdHlwZW9mKGVsZW0pID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBldmVudEhhbmRsZSwgZmFsc2UgKTtcbiAgICB9IGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgZWxlbS5hdHRhY2hFdmVudCggJ29uJyArIHR5cGUsIGV2ZW50SGFuZGxlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbVsnb24nICsgdHlwZV0gPSBldmVudEhhbmRsZTtcbiAgICB9XG59XG5cbi8qKlxuKlxuKiBAcGFyYW0ge31cbiogQHJldHVybnNcbiovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBcnJheU9mSlNPTihkYXRhRnJvbVNlcnZlcil7XG4gICAgbGV0IHBhcnNlZEpTT04gPSBKU09OLnBhcnNlKGRhdGFGcm9tU2VydmVyLmQpO1xuICAgIGZvciAobGV0IGkgPSAwO2kgPCBwYXJzZWRKU09OLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFsZXJ0KHBhcnNlZEpTT05baV0uSWQpO1xuICAgIH1cbiB9XG5cbi8qKlxuKlxuKiBAcGFyYW0ge31cbiogQHJldHVybnNcbiovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTm9kZXMoZWxlbWVudCkge1xuICAgIHdoaWxlIChlbGVtZW50LmZpcnN0Q2hpbGQpIHtlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuZmlyc3RDaGlsZCk7fVxufVxuXG4vKipcbipcbiogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudChub2RlLCBjbGFzc05hbWUpIHtcbiAgICB3aGlsZSAobm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgIGlmIChub2RlLmNsYXNzTmFtZS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge3JldHVybiBub2RlO31cbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIl19
