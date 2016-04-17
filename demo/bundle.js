(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var css = "body,\nhtml {\n  width: 100%;\n  height: 100%;\n  font-size: 1.25em;\n  margin: 0;\n  padding: 0;\n  font-family: arial;\n  color: #444444;\n}\n.dashgridContainer {\n  position: relative;\n  /*top: 1%;*/\n  /*margin: 0 auto;*/\n  width: 100%;\n  height: 100%;\n  /*height: 800px;*/\n  /*height: 800px;*/\n  display: block;\n}\n.grid,\n.grid-box,\n.grid-shadow-box {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.dashgrid {\n  background: #F9F9F9;\n  position: relative;\n  display: block;\n}\n.dashgridBox {\n  background: #E1E1E1;\n  position: absolute;\n  top: 20%;\n  left: 0;\n  width: 100%;\n  height: 80%;\n}\n.dashgrid-box {\n  background: red;\n}\n.dashgrid-shadow-box {\n  background-color: #E8E8E8;\n  opacity: 0.5;\n}\n/**\n * GRID DRAW HELPERS.\n */\n.dashgrid-horizontal-line,\n.dashgrid-vertical-line {\n  background: #FFFFFF;\n}\n.dashgrid-centroid {\n  background: #000000;\n  width: 5px;\n  height: 5px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "demo/demo.css"})); module.exports = css;
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

    boxes = [{ row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem }, { row: 2, column: 1, rowspan: 4, columnspan: 2, content: elemTwo }];
    // boxes = fillCells(numRows, numColumns);

    // {row: 15, column: 3, rowspan: 2, columnspan: 2, content: elemThree}
    var grid = (0, _dashgrid2.default)(document.getElementById('grid'), {
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

        liveChanges: true
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

    return Object.freeze({ createBox: createBox });
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
            el.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
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

},{}],5:[function(require,module,exports){
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
 * @param {Object} element The dashgrid element.
 * @param {Object} gs Grid settings.
 */

function Dashgrid(element, gs) {
    var dashgrid = Object.assign({}, dashgridSettings(gs, element));

    var renderer = (0, _renderer2.default)({ dashgrid: dashgrid });
    var boxHandler = (0, _box2.default)({ dashgrid: dashgrid });
    var grid = (0, _grid2.default)({ dashgrid: dashgrid, renderer: renderer, boxHandler: boxHandler });
    var dragger = (0, _drag2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var resizer = (0, _resize2.default)({ dashgrid: dashgrid, renderer: renderer, grid: grid });
    var mouse = (0, _mouse2.default)({ dragger: dragger, resizer: resizer, dashgrid: dashgrid, grid: grid });

    // Initialize.
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
        refreshGrid: grid.refreshGrid
    });
}

/**
 * Grid properties and events.
 */
// dashgrid: dashgrid
function dashgridSettings(gs, element) {
    var dashgrid = {
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

    return dashgrid;
}

},{"./box.js":4,"./drag.js":6,"./grid.js":7,"./mouse.js":8,"./renderer.js":9,"./resize.js":10,"./shims.js":11,"./utils.js":12}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils.js');

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


    var gridView = GridView({ dashgrid: dashgrid, renderer: renderer });
    var gridEngine = GridEngine({ dashgrid: dashgrid, boxHandler: boxHandler });

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

        createShadowBoxElement();

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
        (0, _utils.removeNodes)(gridCentroidsElement);
        var columnWidth = renderer.getColumnWidth();
        var rowHeight = renderer.getRowHeight();

        var htmlString = '';
        // Draw centroids
        for (var i = 0; i < dashgrid.numRows; i += 1) {
            for (var j = 0; j < dashgrid.numColumns; j += 1) {
                htmlString += '<div class=\'dashgrid-centroid\'\n                    style=\'top: ' + (i * (rowHeight + dashgrid.yMargin) + rowHeight / 2 + dashgrid.yMargin) + 'px;\n                        left: ' + (j * (columnWidth + dashgrid.xMargin) + columnWidth / 2 + dashgrid.xMargin) + 'px;\n                            position: absolute;\'>\n                    </div>';
            }
        }

        gridCentroidsElement.innerHTML = htmlString;
    };

    /**
     * Creates the shadow box element which is used when dragging / resizing
     *     a box. It gets attached to the dragging / resizing box, while
     *     box gets to move / resize freely and snaps back to its original
     *     or new position at drag / resize stop.
     */
    var createShadowBoxElement = function createShadowBoxElement() {
        if (document.getElementById('dashgrid-shadow-box') === null) {
            dashgrid._shadowBoxElement = document.createElement('div');
            dashgrid._shadowBoxElement.id = 'dashgrid-shadow-box';

            dashgrid._shadowBoxElement.className = 'dashgrid-shadow-box';
            dashgrid._shadowBoxElement.style.position = 'absolute';
            dashgrid._shadowBoxElement.style.display = 'block';
            dashgrid._shadowBoxElement.style.zIndex = '1001';
            dashgrid._element.appendChild(dashgrid._shadowBoxElement);
        }
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

},{"./utils.js":12}],8:[function(require,module,exports){
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

},{"./utils":12}],9:[function(require,module,exports){
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

},{"./utils.js":12}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";

// shim layer with setTimeout fallback for requiestAnimationFrame
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        cb = cb || function () {};
        window.setTimeout(cb, 1000 / 60);
    };
}();

},{}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2RlbW8uY3NzIiwiZGVtby9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnktY3NzL2Jyb3dzZXIuanMiLCJzcmMvYm94LmpzIiwic3JjL2Rhc2hncmlkLmpzIiwic3JjL2RyYWcuanMiLCJzcmMvZ3JpZC5qcyIsInNyYy9tb3VzZS5qcyIsInNyYy9yZW5kZXJlci5qcyIsInNyYy9yZXNpemUuanMiLCJzcmMvc2hpbXMuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFFQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JELFdBRHFEO0NBQVgsQ0FBOUM7O0FBSUEsU0FBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLFVBQTVCLEVBQXdDO0FBQ3BDLFFBQUksYUFBSixDQURvQztBQUVwQyxRQUFJLFdBQVcsRUFBWCxDQUZnQztBQUdwQyxRQUFJLEtBQUssQ0FBTCxDQUhnQztBQUlwQyxTQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFKLEVBQWEsS0FBSyxDQUFMLEVBQVE7QUFDakMsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksVUFBSixFQUFnQixLQUFLLENBQUwsRUFBUTtBQUNwQyxtQkFBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUCxDQURvQztBQUVwQyxpQkFBSyxTQUFMLEdBQWlCLFlBQWpCLENBRm9DO0FBR3BDLGlCQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLE1BQW5CLENBSG9DO0FBSXBDLGlCQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQXBCLENBSm9DO0FBS3BDLGtCQUFNLENBQU4sQ0FMb0M7QUFNcEMscUJBQVMsSUFBVCxDQUFjLEVBQUMsS0FBSyxDQUFMLEVBQVEsUUFBUSxDQUFSLEVBQVcsU0FBUyxDQUFULEVBQVksWUFBWSxDQUFaLEVBQTlDLEVBTm9DO1NBQXhDO0tBREo7O0FBV0EsV0FBTyxRQUFQLENBZm9DO0NBQXhDOztBQWtCQSxTQUFTLElBQVQsR0FBZ0I7QUFDWixRQUFJLGNBQUosQ0FEWTtBQUVaLFFBQUksVUFBVSxDQUFWLENBRlE7QUFHWixRQUFJLGFBQWEsQ0FBYixDQUhROztBQUtaLFFBQUksT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUCxDQUxRO0FBTVosU0FBSyxTQUFMLEdBQWlCLGFBQWpCLENBTlk7O0FBUVosUUFBSSxVQUFVLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWLENBUlE7QUFTWixZQUFRLFNBQVIsR0FBb0IsYUFBcEIsQ0FUWTs7QUFXWixRQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVosQ0FYUTtBQVlaLGNBQVUsU0FBVixHQUFzQixhQUF0QixDQVpZOztBQWNaLFlBQVEsQ0FDSixFQUFDLEtBQUssQ0FBTCxFQUFRLFFBQVEsQ0FBUixFQUFXLFNBQVMsQ0FBVCxFQUFZLFlBQVksQ0FBWixFQUFlLFNBQVMsSUFBVCxFQUQzQyxFQUVKLEVBQUMsS0FBSyxDQUFMLEVBQVEsUUFBUSxDQUFSLEVBQVcsU0FBUyxDQUFULEVBQVksWUFBWSxDQUFaLEVBQWUsU0FBUyxPQUFULEVBRjNDLENBQVI7OztBQWRZO0FBcUJaLFFBQUksT0FBTyx3QkFBZSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBZixFQUFnRDtBQUN2RCxlQUFPLEtBQVA7QUFDQSxrQkFBVSxJQUFWOztBQUVBLGlCQUFTLEVBQVQ7QUFDQSxpQkFBUyxFQUFUOztBQUVBLG1CQUFXLEVBQUMsU0FBUyxJQUFULEVBQWUsUUFBUSxjQUFSLEVBQTNCOztBQUVBLG1CQUFXLE1BQVg7QUFDQSxpQkFBUyxPQUFUO0FBQ0EsaUJBQVMsVUFBVSxDQUFWOztBQUVULHFCQUFhLE1BQWI7QUFDQSxvQkFBWSxVQUFaO0FBQ0Esb0JBQVksVUFBWjs7QUFFQSxxQkFBYSxJQUFiO0tBakJPLENBQVAsQ0FyQlE7Q0FBaEI7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7a0JDbERlOzs7QUFFZixTQUFTLEdBQVQsQ0FBYSxJQUFiLEVBQW1CO1FBQ1YsV0FBWSxLQUFaOzs7Ozs7QUFEVTtBQU9mLFFBQUksWUFBWSxTQUFaLFNBQVksQ0FBVSxHQUFWLEVBQWU7QUFDM0IsZUFBTyxNQUFQLENBQWMsR0FBZCxFQUFtQixZQUFZLEdBQVosRUFBaUIsUUFBakIsQ0FBbkIsRUFEMkI7QUFFM0IsWUFBSSxJQUFJLE9BQUosRUFBYTtBQUNiLGdCQUFJLFFBQUosQ0FBYSxXQUFiLENBQXlCLElBQUksT0FBSixDQUF6QixDQURhO1NBQWpCOztBQUlBLGlCQUFTLGFBQVQsQ0FBdUIsV0FBdkIsQ0FBbUMsSUFBSSxRQUFKLENBQW5DLENBTjJCO0tBQWYsQ0FQRDs7QUFnQmYsV0FBTyxPQUFPLE1BQVAsQ0FBYyxFQUFDLG9CQUFELEVBQWQsQ0FBUCxDQWhCZTtDQUFuQjs7Ozs7QUFzQkEsU0FBUyxXQUFULENBQXFCLFVBQXJCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3ZDLFdBQU87QUFDSCxrQkFBVyxZQUFZO0FBQ25CLGdCQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQUwsQ0FEZTtBQUVuQixlQUFHLFNBQUgsR0FBZSxjQUFmLENBRm1CO0FBR25CLGVBQUcsS0FBSCxDQUFTLFFBQVQsR0FBb0IsVUFBcEIsQ0FIbUI7QUFJbkIsZUFBRyxLQUFILENBQVMsTUFBVCxHQUFrQixNQUFsQixDQUptQjtBQUtuQixlQUFHLEtBQUgsQ0FBUyxVQUFULEdBQXNCLHVEQUF0QixDQUxtQjtBQU1uQixlQUFHLEtBQUgsQ0FBUyxNQUFULEdBQWtCLElBQWxCLENBTm1COztBQVFuQixvQ0FBd0IsRUFBeEIsRUFBNEIsUUFBNUIsRUFSbUI7O0FBVW5CLG1CQUFPLEVBQVAsQ0FWbUI7U0FBWixFQUFYOztBQWFBLGFBQUssV0FBVyxHQUFYO0FBQ0wsZ0JBQVEsV0FBVyxNQUFYO0FBQ1IsaUJBQVMsV0FBVyxPQUFYLElBQXNCLENBQXRCO0FBQ1Qsb0JBQVksV0FBVyxVQUFYLElBQXlCLENBQXpCO0FBQ1osbUJBQVcsVUFBQyxDQUFXLFNBQVgsS0FBeUIsS0FBekIsR0FBa0MsS0FBbkMsR0FBMkMsSUFBM0M7QUFDWCxtQkFBVyxVQUFDLENBQVcsU0FBWCxLQUF5QixLQUF6QixHQUFrQyxLQUFuQyxHQUEyQyxJQUEzQztBQUNYLGtCQUFVLFVBQUMsQ0FBVyxRQUFYLEtBQXdCLEtBQXhCLEdBQWlDLEtBQWxDLEdBQTBDLElBQTFDO0FBQ1Ysa0JBQVUsVUFBQyxDQUFXLFFBQVgsS0FBd0IsSUFBeEIsR0FBZ0MsSUFBakMsR0FBd0MsS0FBeEM7QUFDVixrQkFBVSxVQUFDLENBQVcsUUFBWCxLQUF3QixJQUF4QixHQUFnQyxJQUFqQyxHQUF3QyxLQUF4QztBQUNWLGtCQUFVLFVBQUMsQ0FBVyxRQUFYLEtBQXdCLElBQXhCLEdBQWdDLElBQWpDLEdBQXdDLEtBQXhDO0FBQ1YsaUJBQVMsVUFBQyxDQUFXLE9BQVgsS0FBdUIsSUFBdkIsR0FBK0IsSUFBaEMsR0FBdUMsS0FBdkM7S0F4QmIsQ0FEdUM7Q0FBM0M7Ozs7O0FBZ0NBLFNBQVMsdUJBQVQsQ0FBaUMsVUFBakMsRUFBNkMsUUFBN0MsRUFBdUQ7QUFDbkQsUUFBSSxlQUFKOzs7OztBQURtRCxRQU0vQyxTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsQ0FBMEIsT0FBMUIsQ0FBa0MsR0FBbEMsTUFBMkMsQ0FBQyxDQUFELEVBQUk7QUFDL0MsaUJBQVMsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVQsQ0FEK0M7QUFFL0MsZUFBTyxTQUFQLEdBQW1CLDhCQUFuQixDQUYrQztBQUcvQyxlQUFPLEtBQVAsQ0FBYSxJQUFiLEdBQW9CLElBQUksSUFBSixDQUgyQjtBQUkvQyxlQUFPLEtBQVAsQ0FBYSxHQUFiLEdBQW1CLElBQUksSUFBSixDQUo0QjtBQUsvQyxlQUFPLEtBQVAsQ0FBYSxLQUFiLEdBQXFCLE1BQXJCLENBTCtDO0FBTS9DLGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTnlCO0FBTy9DLGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsVUFBdEIsQ0FQK0M7QUFRL0MsZUFBTyxLQUFQLENBQWEsUUFBYixHQUF3QixVQUF4QixDQVIrQztBQVMvQyxlQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLE9BQXZCLENBVCtDO0FBVS9DLGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsSUFBdEIsQ0FWK0M7QUFXL0MsbUJBQVcsV0FBWCxDQUF1QixNQUF2QixFQVgrQztLQUFuRDs7Ozs7QUFObUQsUUF1Qi9DLFNBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxHQUFsQyxNQUEyQyxDQUFDLENBQUQsRUFBSTtBQUMvQyxpQkFBUyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVCxDQUQrQztBQUUvQyxlQUFPLFNBQVAsR0FBbUIsOEJBQW5CLENBRitDO0FBRy9DLGVBQU8sS0FBUCxDQUFhLElBQWIsR0FBb0IsSUFBSSxJQUFKLENBSDJCO0FBSS9DLGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsSUFBSSxJQUFKLENBSnlCO0FBSy9DLGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsTUFBckIsQ0FMK0M7QUFNL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixTQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBaUMsSUFBakMsQ0FOeUI7QUFPL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixVQUF0QixDQVArQztBQVEvQyxlQUFPLEtBQVAsQ0FBYSxRQUFiLEdBQXdCLFVBQXhCLENBUitDO0FBUy9DLGVBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsT0FBdkIsQ0FUK0M7QUFVL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixJQUF0QixDQVYrQztBQVcvQyxtQkFBVyxXQUFYLENBQXVCLE1BQXZCLEVBWCtDO0tBQW5EOzs7OztBQXZCbUQsUUF3Qy9DLFNBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxHQUFsQyxNQUEyQyxDQUFDLENBQUQsRUFBSTtBQUMvQyxpQkFBUyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVCxDQUQrQztBQUUvQyxlQUFPLFNBQVAsR0FBbUIsOEJBQW5CLENBRitDO0FBRy9DLGVBQU8sS0FBUCxDQUFhLElBQWIsR0FBb0IsSUFBSSxJQUFKLENBSDJCO0FBSS9DLGVBQU8sS0FBUCxDQUFhLEdBQWIsR0FBbUIsSUFBSSxJQUFKLENBSjRCO0FBSy9DLGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTDBCO0FBTS9DLGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsTUFBdEIsQ0FOK0M7QUFPL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixVQUF0QixDQVArQztBQVEvQyxlQUFPLEtBQVAsQ0FBYSxRQUFiLEdBQXdCLFVBQXhCLENBUitDO0FBUy9DLGVBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsT0FBdkIsQ0FUK0M7QUFVL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixJQUF0QixDQVYrQztBQVcvQyxtQkFBVyxXQUFYLENBQXVCLE1BQXZCLEVBWCtDO0tBQW5EOzs7OztBQXhDbUQsUUF5RC9DLFNBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxHQUFsQyxNQUEyQyxDQUFDLENBQUQsRUFBSTtBQUMvQyxpQkFBUyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVCxDQUQrQztBQUUvQyxlQUFPLFNBQVAsR0FBbUIsOEJBQW5CLENBRitDO0FBRy9DLGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsSUFBSSxJQUFKLENBSDBCO0FBSS9DLGVBQU8sS0FBUCxDQUFhLEdBQWIsR0FBbUIsSUFBSSxJQUFKLENBSjRCO0FBSy9DLGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTDBCO0FBTS9DLGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsTUFBdEIsQ0FOK0M7QUFPL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixVQUF0QixDQVArQztBQVEvQyxlQUFPLEtBQVAsQ0FBYSxRQUFiLEdBQXdCLFVBQXhCLENBUitDO0FBUy9DLGVBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsT0FBdkIsQ0FUK0M7QUFVL0MsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixJQUF0QixDQVYrQztBQVcvQyxtQkFBVyxXQUFYLENBQXVCLE1BQXZCLEVBWCtDO0tBQW5EOzs7OztBQXpEbUQsUUEwRS9DLFNBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxJQUFsQyxNQUE0QyxDQUFDLENBQUQsRUFBSTtBQUNoRCxpQkFBUyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVCxDQURnRDtBQUVoRCxlQUFPLFNBQVAsR0FBbUIsK0JBQW5CLENBRmdEO0FBR2hELGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsSUFBSSxJQUFKLENBSDJCO0FBSWhELGVBQU8sS0FBUCxDQUFhLEdBQWIsR0FBbUIsSUFBSSxJQUFKLENBSjZCO0FBS2hELGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTDJCO0FBTWhELGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTjBCO0FBT2hELGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsV0FBdEIsQ0FQZ0Q7QUFRaEQsZUFBTyxLQUFQLENBQWEsUUFBYixHQUF3QixVQUF4QixDQVJnRDtBQVNoRCxlQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLE9BQXZCLENBVGdEO0FBVWhELGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsSUFBdEIsQ0FWZ0Q7QUFXaEQsbUJBQVcsV0FBWCxDQUF1QixNQUF2QixFQVhnRDtLQUFwRDs7Ozs7QUExRW1ELFFBMkYvQyxTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsQ0FBMEIsT0FBMUIsQ0FBa0MsSUFBbEMsTUFBNEMsQ0FBQyxDQUFELEVBQUk7QUFDaEQsaUJBQVMsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVQsQ0FEZ0Q7QUFFaEQsZUFBTyxTQUFQLEdBQW1CLCtCQUFuQixDQUZnRDtBQUdoRCxlQUFPLEtBQVAsQ0FBYSxLQUFiLEdBQXFCLElBQUksSUFBSixDQUgyQjtBQUloRCxlQUFPLEtBQVAsQ0FBYSxNQUFiLEdBQXNCLElBQUksSUFBSixDQUowQjtBQUtoRCxlQUFPLEtBQVAsQ0FBYSxLQUFiLEdBQXFCLFNBQVMsU0FBVCxDQUFtQixXQUFuQixHQUFpQyxJQUFqQyxDQUwyQjtBQU1oRCxlQUFPLEtBQVAsQ0FBYSxNQUFiLEdBQXNCLFNBQVMsU0FBVCxDQUFtQixXQUFuQixHQUFpQyxJQUFqQyxDQU4wQjtBQU9oRCxlQUFPLEtBQVAsQ0FBYSxNQUFiLEdBQXNCLFdBQXRCLENBUGdEO0FBUWhELGVBQU8sS0FBUCxDQUFhLFFBQWIsR0FBd0IsVUFBeEIsQ0FSZ0Q7QUFTaEQsZUFBTyxLQUFQLENBQWEsT0FBYixHQUF1QixPQUF2QixDQVRnRDtBQVVoRCxlQUFPLEtBQVAsQ0FBYSxNQUFiLEdBQXNCLElBQXRCLENBVmdEO0FBV2hELG1CQUFXLFdBQVgsQ0FBdUIsTUFBdkIsRUFYZ0Q7S0FBcEQ7Ozs7O0FBM0ZtRCxRQTRHL0MsU0FBUyxTQUFULENBQW1CLE1BQW5CLENBQTBCLE9BQTFCLENBQWtDLElBQWxDLE1BQTRDLENBQUMsQ0FBRCxFQUFJO0FBQ2hELGlCQUFTLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFULENBRGdEO0FBRWhELGVBQU8sU0FBUCxHQUFtQiwrQkFBbkIsQ0FGZ0Q7QUFHaEQsZUFBTyxLQUFQLENBQWEsSUFBYixHQUFvQixJQUFJLElBQUosQ0FINEI7QUFJaEQsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixJQUFJLElBQUosQ0FKMEI7QUFLaEQsZUFBTyxLQUFQLENBQWEsS0FBYixHQUFxQixTQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBaUMsSUFBakMsQ0FMMkI7QUFNaEQsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixTQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBaUMsSUFBakMsQ0FOMEI7QUFPaEQsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixXQUF0QixDQVBnRDtBQVFoRCxlQUFPLEtBQVAsQ0FBYSxRQUFiLEdBQXdCLFVBQXhCLENBUmdEO0FBU2hELGVBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsT0FBdkIsQ0FUZ0Q7QUFVaEQsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFzQixJQUF0QixDQVZnRDtBQVdoRCxtQkFBVyxXQUFYLENBQXVCLE1BQXZCLEVBWGdEO0tBQXBEOzs7OztBQTVHbUQsUUE2SC9DLFNBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxJQUFsQyxNQUE0QyxDQUFDLENBQUQsRUFBSTtBQUNoRCxpQkFBUyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVCxDQURnRDtBQUVoRCxlQUFPLFNBQVAsR0FBbUIsK0JBQW5CLENBRmdEO0FBR2hELGVBQU8sS0FBUCxDQUFhLElBQWIsR0FBb0IsSUFBSSxJQUFKLENBSDRCO0FBSWhELGVBQU8sS0FBUCxDQUFhLEdBQWIsR0FBbUIsSUFBSSxJQUFKLENBSjZCO0FBS2hELGVBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTDJCO0FBTWhELGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsU0FBUyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLElBQWpDLENBTjBCO0FBT2hELGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsV0FBdEIsQ0FQZ0Q7QUFRaEQsZUFBTyxLQUFQLENBQWEsUUFBYixHQUF3QixVQUF4QixDQVJnRDtBQVNoRCxlQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLE9BQXZCLENBVGdEO0FBVWhELGVBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsSUFBdEIsQ0FWZ0Q7QUFXaEQsbUJBQVcsV0FBWCxDQUF1QixNQUF2QixFQVhnRDtLQUFwRDtDQTdISjs7Ozs7Ozs7O0FDeERBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O2tCQUVlOzs7Ozs7O0FBTWYsU0FBUyxRQUFULENBQWtCLE9BQWxCLEVBQTJCLEVBQTNCLEVBQStCO0FBQzNCLFFBQUksV0FBVyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLGlCQUFpQixFQUFqQixFQUFxQixPQUFyQixDQUFsQixDQUFYLENBRHVCOztBQUczQixRQUFJLFdBQVcsd0JBQU8sRUFBQyxrQkFBRCxFQUFQLENBQVgsQ0FIdUI7QUFJM0IsUUFBSSxhQUFhLG1CQUFJLEVBQUMsa0JBQUQsRUFBSixDQUFiLENBSnVCO0FBSzNCLFFBQUksT0FBTyxvQkFBSyxFQUFDLGtCQUFELEVBQVcsa0JBQVgsRUFBcUIsc0JBQXJCLEVBQUwsQ0FBUCxDQUx1QjtBQU0zQixRQUFJLFVBQVUsb0JBQVEsRUFBQyxrQkFBRCxFQUFXLGtCQUFYLEVBQXFCLFVBQXJCLEVBQVIsQ0FBVixDQU51QjtBQU8zQixRQUFJLFVBQVUsc0JBQVEsRUFBQyxrQkFBRCxFQUFXLGtCQUFYLEVBQXFCLFVBQXJCLEVBQVIsQ0FBVixDQVB1QjtBQVEzQixRQUFJLFFBQVEscUJBQU0sRUFBQyxnQkFBRCxFQUFVLGdCQUFWLEVBQW1CLGtCQUFuQixFQUE2QixVQUE3QixFQUFOLENBQVI7OztBQVJ1QixRQVczQixDQUFLLElBQUwsR0FYMkI7QUFZM0IsVUFBTSxJQUFOOzs7QUFaMkIsd0JBZTNCLENBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQixZQUFNO0FBQzdCLGlCQUFTLGNBQVQsR0FENkI7QUFFN0IsaUJBQVMsWUFBVCxHQUY2QjtBQUc3QixhQUFLLFdBQUwsR0FINkI7S0FBTixDQUEzQjs7O0FBZjJCLFFBc0J2QixTQUFTLFdBQVQsRUFBc0I7QUFBQyxpQkFBUyxXQUFULEdBQUQ7S0FBMUI7OztBQXRCMkIsV0F5QnBCLE9BQU8sTUFBUCxDQUFjO0FBQ2pCLG1CQUFXLEtBQUssU0FBTDtBQUNYLG1CQUFXLEtBQUssU0FBTDtBQUNYLG1CQUFXLEtBQUssU0FBTDtBQUNYLGtCQUFVLEtBQUssUUFBTDtBQUNWLHFCQUFhLEtBQUssV0FBTDtLQUxWLENBQVAsQ0F6QjJCO0NBQS9COzs7Ozs7QUFzQ0EsU0FBUyxnQkFBVCxDQUEwQixFQUExQixFQUE4QixPQUE5QixFQUF1QztBQUNuQyxRQUFJLFdBQVc7QUFDWCxrQkFBVyxZQUFZO0FBQ25CLG9CQUFRLEtBQVIsQ0FBYyxRQUFkLEdBQXlCLFVBQXpCLENBRG1CO0FBRW5CLG9CQUFRLEtBQVIsQ0FBYyxPQUFkLEdBQXdCLE9BQXhCLENBRm1CO0FBR25CLG9CQUFRLEtBQVIsQ0FBYyxNQUFkLEdBQXVCLE1BQXZCLENBSG1CO0FBSW5CLG9DQUFZLE9BQVosRUFKbUI7QUFLbkIsbUJBQU8sT0FBUCxDQUxtQjtTQUFaLEVBQVg7O0FBUUEsZUFBTyxHQUFHLEtBQUgsSUFBWSxFQUFaOztBQUVQLG1CQUFXLEdBQUcsU0FBSDtBQUNYLGlCQUFTLEVBQUMsQ0FBRyxPQUFILEtBQWUsU0FBZixHQUE0QixHQUFHLE9BQUgsR0FBYSxDQUExQztBQUNULGlCQUFTLEVBQUMsQ0FBRyxPQUFILEtBQWUsU0FBZixHQUE0QixHQUFHLE9BQUgsR0FBYSxDQUExQztBQUNULGlCQUFTLEVBQUMsQ0FBRyxPQUFILEtBQWUsU0FBZixHQUE0QixHQUFHLE9BQUgsR0FBYSxFQUExQzs7QUFFVCxtQkFBVyxDQUFYO0FBQ0Esc0JBQWMsQ0FBZDs7QUFFQSxxQkFBYSxHQUFHLFdBQUg7QUFDYixvQkFBWSxFQUFDLENBQUcsVUFBSCxLQUFrQixTQUFsQixHQUErQixHQUFHLFVBQUgsR0FBZ0IsQ0FBaEQ7QUFDWixvQkFBWSxFQUFDLENBQUcsVUFBSCxLQUFrQixTQUFsQixHQUErQixHQUFHLFVBQUgsR0FBZ0IsQ0FBaEQ7QUFDWixvQkFBWSxFQUFDLENBQUcsVUFBSCxLQUFrQixTQUFsQixHQUErQixHQUFHLFVBQUgsR0FBZ0IsRUFBaEQ7O0FBRVosaUJBQVMsRUFBQyxDQUFHLE9BQUgsS0FBZSxTQUFmLEdBQTRCLEdBQUcsT0FBSCxHQUFhLEVBQTFDO0FBQ1QsaUJBQVMsRUFBQyxDQUFHLE9BQUgsS0FBZSxTQUFmLEdBQTRCLEdBQUcsT0FBSCxHQUFhLEVBQTFDOztBQUVULDJCQUFtQixDQUFuQjtBQUNBLDhCQUFzQixDQUF0Qjs7QUFFQSxvQkFBWSxFQUFDLENBQUcsVUFBSCxLQUFrQixTQUFsQixHQUErQixHQUFHLFVBQUgsR0FBZ0IsQ0FBaEQ7QUFDWixvQkFBWSxFQUFDLENBQUcsVUFBSCxLQUFrQixTQUFsQixHQUErQixHQUFHLFVBQUgsR0FBZ0IsSUFBaEQ7O0FBRVosdUJBQWUsRUFBQyxDQUFHLGFBQUgsS0FBcUIsU0FBckIsR0FBa0MsR0FBRyxhQUFILEdBQW1CLENBQXREO0FBQ2YsdUJBQWUsRUFBQyxDQUFHLGFBQUgsS0FBcUIsU0FBckIsR0FBa0MsR0FBRyxhQUFILEdBQW1CLElBQXREOztBQUVmLGtCQUFVLEVBQUMsQ0FBRyxRQUFILEtBQWdCLEtBQWhCLEdBQXlCLEtBQTFCLEdBQWtDLElBQWxDO0FBQ1Ysa0JBQVUsRUFBQyxDQUFHLFFBQUgsS0FBZ0IsSUFBaEIsR0FBd0IsSUFBekIsR0FBZ0MsS0FBaEM7QUFDVixrQkFBVSxFQUFDLENBQUcsUUFBSCxLQUFnQixJQUFoQixHQUF3QixJQUF6QixHQUFnQyxLQUFoQztBQUNWLGtCQUFVLEVBQUMsQ0FBRyxRQUFILEtBQWdCLElBQWhCLEdBQXdCLElBQXpCLEdBQWdDLEtBQWhDO0FBQ1YsaUJBQVMsRUFBQyxDQUFHLE9BQUgsS0FBZSxJQUFmLEdBQXVCLElBQXhCLEdBQStCLEtBQS9COztBQUVULHFCQUFhLEVBQUMsQ0FBRyxXQUFILEtBQW1CLEtBQW5CLEdBQTRCLEtBQTdCLEdBQXFDLElBQXJDOzs7O0FBSWIsbUJBQVc7QUFDSCxxQkFBUyxFQUFDLENBQUcsU0FBSCxJQUFnQixHQUFHLFNBQUgsQ0FBYSxPQUFiLEtBQXlCLEtBQXpCLEdBQWtDLEtBQW5ELEdBQTJELElBQTNEO0FBQ1Qsb0JBQVEsRUFBQyxDQUFHLFNBQUgsSUFBZ0IsR0FBRyxTQUFILENBQWEsTUFBYixJQUF3QixjQUF6Qzs7O0FBR1IsdUJBQVcsR0FBRyxTQUFILElBQWdCLEdBQUcsU0FBSCxDQUFhLFNBQWI7QUFDM0Isc0JBQVUsR0FBRyxTQUFILElBQWdCLEdBQUcsU0FBSCxDQUFhLFFBQWI7QUFDMUIscUJBQVMsR0FBRyxTQUFILElBQWdCLEdBQUcsU0FBSCxDQUFhLE9BQWI7U0FQakM7O0FBVUEsbUJBQVc7QUFDUCxxQkFBUyxFQUFDLENBQUcsU0FBSCxJQUFnQixHQUFHLFNBQUgsQ0FBYSxPQUFiLEtBQXlCLEtBQXpCLEdBQWtDLEtBQW5ELEdBQTJELElBQTNEO0FBQ1Qsb0JBQVEsRUFBQyxDQUFHLFNBQUgsSUFBZ0IsR0FBRyxTQUFILENBQWEsTUFBYixJQUF3QixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QyxDQUF6QztBQUNSLHlCQUFhLEVBQUMsQ0FBRyxTQUFILElBQWlCLEdBQUcsU0FBSCxDQUFhLFdBQWIsS0FBNkIsU0FBN0IsR0FBMEMsR0FBRyxTQUFILENBQWEsV0FBYixHQUEyQixFQUF2Rjs7O0FBR2IseUJBQWEsR0FBRyxTQUFILElBQWdCLEdBQUcsU0FBSCxDQUFhLFdBQWI7QUFDN0Isc0JBQVUsR0FBRyxTQUFILElBQWdCLEdBQUcsU0FBSCxDQUFhLFFBQWI7QUFDMUIsdUJBQVcsR0FBRyxTQUFILElBQWdCLEdBQUcsU0FBSCxDQUFhLFNBQWI7U0FSL0I7O0FBV0Esa0JBQVUsb0JBQU0sRUFBTjs7QUFFVixvQkFBWSx1REFBWjtBQUNBLDJCQUFtQixFQUFuQjtBQUNBLHFCQUFhLEVBQWI7QUFDQSxzQkFBYyxFQUFDLENBQUcsWUFBSCxLQUFvQixTQUFwQixHQUFpQyxHQUFsQyxHQUF3QyxHQUFHLFlBQUg7O0FBRXRELHVCQUFlLEVBQUMsQ0FBRyxhQUFILEtBQXFCLEtBQXJCLEdBQThCLEtBQS9CLEdBQXVDLElBQXZDO0FBQ2YsMkJBQW1CLEVBQUMsQ0FBRyxpQkFBSCxLQUF5QixLQUF6QixHQUFrQyxLQUFuQyxHQUEyQyxJQUEzQztLQTNFbkIsQ0FEK0I7O0FBK0VuQyxhQUFTLGFBQVQsR0FBMEIsWUFBWTtBQUM5QixZQUFJLGVBQWUsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWYsQ0FEMEI7QUFFOUIscUJBQWEsU0FBYixHQUF5QixnQkFBekIsQ0FGOEI7QUFHOUIsaUJBQVMsUUFBVCxDQUFrQixXQUFsQixDQUE4QixZQUE5QixFQUg4QjtBQUk5QixlQUFPLFlBQVAsQ0FKOEI7S0FBWixFQUExQixDQS9FbUM7O0FBc0ZuQyxXQUFPLFFBQVAsQ0F0Rm1DO0NBQXZDOzs7Ozs7OztrQkN0RGU7OztBQUVmLFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtRQUNkLFdBQTRCLEtBQTVCLFNBRGM7UUFDSixXQUFrQixLQUFsQixTQURJO1FBQ00sT0FBUSxLQUFSLEtBRE47OztBQUduQixRQUFJLFdBQUo7UUFBUSxXQUFSO1FBQVksV0FBWjtRQUFnQixXQUFoQjtRQUNJLFNBQVMsQ0FBVDtRQUNBLFNBQVMsQ0FBVDtRQUNBLGFBQWEsQ0FBYjtRQUNBLGFBQWEsQ0FBYjtRQUNBLFFBQVEsQ0FBUjtRQUNBLFFBQVEsQ0FBUjtRQUNBLFNBQVMsU0FBUyxPQUFUO1FBQ1QsVUFBVSxTQUFTLE9BQVQ7UUFDVixZQUFZLEVBQVo7UUFDQSxZQUFZLEVBQVo7Ozs7Ozs7OztBQWJlLFFBc0JmLFlBQVksU0FBWixTQUFZLENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0I7QUFDOUIsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixNQUFuQixHQUE0QixJQUE1QixDQUQ4QjtBQUU5QixZQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLFVBQW5CLEdBQWdDLEVBQWhDLENBRjhCO0FBRzlCLGlCQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLElBQWpDLEdBQXdDLElBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsSUFBbkIsQ0FIVjtBQUk5QixpQkFBUyxpQkFBVCxDQUEyQixLQUEzQixDQUFpQyxHQUFqQyxHQUF1QyxJQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLEdBQW5CLENBSlQ7QUFLOUIsaUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsS0FBakMsR0FBeUMsSUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixLQUFuQixDQUxYO0FBTTlCLGlCQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLE1BQWpDLEdBQTBDLElBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsTUFBbkIsQ0FOWjtBQU85QixpQkFBUyxpQkFBVCxDQUEyQixLQUEzQixDQUFpQyxPQUFqQyxHQUEyQyxFQUEzQzs7O0FBUDhCLGtCQVU5QixHQUFhLEVBQUUsS0FBRixDQVZpQjtBQVc5QixxQkFBYSxFQUFFLEtBQUYsQ0FYaUI7QUFZOUIsYUFBSyxTQUFTLElBQUksUUFBSixDQUFhLFVBQWIsRUFBeUIsRUFBbEMsQ0FBTCxDQVo4QjtBQWE5QixhQUFLLFNBQVMsSUFBSSxRQUFKLENBQWEsU0FBYixFQUF3QixFQUFqQyxDQUFMLENBYjhCO0FBYzlCLGFBQUssU0FBUyxJQUFJLFFBQUosQ0FBYSxXQUFiLEVBQTBCLEVBQW5DLENBQUwsQ0FkOEI7QUFlOUIsYUFBSyxTQUFTLElBQUksUUFBSixDQUFhLFlBQWIsRUFBMkIsRUFBcEMsQ0FBTCxDQWY4Qjs7QUFpQjlCLGFBQUssV0FBTCxDQUFpQixHQUFqQixFQWpCOEI7O0FBbUI5QixZQUFJLFNBQVMsU0FBVCxDQUFtQixTQUFuQixFQUE4QjtBQUFDLHFCQUFTLFNBQVQsQ0FBbUIsU0FBbkIsR0FBRDtTQUFsQztBQW5COEIsS0FBbEI7Ozs7Ozs7QUF0QkcsUUFpRGYsT0FBTyxTQUFQLElBQU8sQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQjtBQUN6Qiw0QkFBb0IsR0FBcEIsRUFBeUIsQ0FBekIsRUFEeUI7QUFFekIsYUFBSyxRQUFMLENBQWMsR0FBZCxFQUZ5Qjs7QUFJekIsWUFBSSxTQUFTLFdBQVQsRUFBc0I7O0FBRXRCLHdCQUFZLFNBQVMsZUFBVCxDQUF5QjtBQUNqQyxzQkFBTSxJQUFJLFFBQUosQ0FBYSxVQUFiO0FBQ04sdUJBQU8sSUFBSSxRQUFKLENBQWEsVUFBYixHQUEwQixJQUFJLFFBQUosQ0FBYSxXQUFiO0FBQ2pDLHFCQUFLLElBQUksUUFBSixDQUFhLFNBQWI7QUFDTCx3QkFBUSxJQUFJLFFBQUosQ0FBYSxTQUFiLEdBQXlCLElBQUksUUFBSixDQUFhLFlBQWI7YUFKekIsQ0FBWixDQUZzQjtBQVF0QixvQkFBUSxHQUFSLEVBQWEsQ0FBYixFQVJzQjtTQUExQjs7QUFXQSxZQUFJLFNBQVMsU0FBVCxDQUFtQixRQUFuQixFQUE2QjtBQUFDLHFCQUFTLFNBQVQsQ0FBbUIsUUFBbkIsR0FBRDtTQUFqQztBQWZ5QixLQUFsQjs7Ozs7OztBQWpEUSxRQXdFZixVQUFVLFNBQVYsT0FBVSxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCO0FBQzVCLFlBQUksQ0FBQyxTQUFTLFdBQVQsRUFBc0I7O0FBRXZCLHdCQUFZLFNBQVMsZUFBVCxDQUF5QjtBQUNqQyxzQkFBTSxJQUFJLFFBQUosQ0FBYSxVQUFiO0FBQ04sdUJBQU8sSUFBSSxRQUFKLENBQWEsVUFBYixHQUEwQixJQUFJLFFBQUosQ0FBYSxXQUFiO0FBQ2pDLHFCQUFLLElBQUksUUFBSixDQUFhLFNBQWI7QUFDTCx3QkFBUSxJQUFJLFFBQUosQ0FBYSxTQUFiLEdBQXlCLElBQUksUUFBSixDQUFhLFlBQWI7YUFKekIsQ0FBWixDQUZ1QjtBQVF2QixvQkFBUSxHQUFSLEVBQWEsQ0FBYixFQVJ1QjtTQUEzQjs7O0FBRDRCLFdBYTVCLENBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsVUFBbkIsR0FBZ0MsU0FBUyxVQUFULENBYko7QUFjNUIsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixJQUFuQixHQUEwQixTQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLElBQWpDLENBZEU7QUFlNUIsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixHQUFuQixHQUF5QixTQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLEdBQWpDOzs7QUFmRyxrQkFrQjVCLENBQVcsWUFBWTtBQUNuQixnQkFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixNQUFuQixHQUE0QixJQUE1QixDQURtQjtBQUVuQixxQkFBUyxpQkFBVCxDQUEyQixLQUEzQixDQUFpQyxPQUFqQyxHQUEyQyxNQUEzQyxDQUZtQjtBQUduQixpQkFBSyxTQUFMLEdBSG1CO1NBQVosRUFJUixTQUFTLFlBQVQsQ0FKSCxDQWxCNEI7O0FBd0I1QixZQUFJLFNBQVMsU0FBVCxDQUFtQixPQUFuQixFQUE0QjtBQUFDLHFCQUFTLFNBQVQsQ0FBbUIsT0FBbkIsR0FBRDtTQUFoQztBQXhCNEIsS0FBbEI7Ozs7Ozs7QUF4RUssUUF3R2YsVUFBVSxTQUFWLE9BQVUsQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQjtBQUM1QixZQUFJLFVBQVUsR0FBVixLQUFrQixVQUFVLEdBQVYsSUFDbEIsVUFBVSxNQUFWLEtBQXFCLFVBQVUsTUFBVixFQUFrQjs7QUFFdkMsZ0JBQUksbUJBQW1CLFNBQVMsUUFBVCxDQUFrQixZQUFsQixHQUFpQyxPQUFPLFdBQVAsQ0FGakI7QUFHdkMsZ0JBQUksa0JBQWtCLFNBQVMsUUFBVCxDQUFrQixXQUFsQixHQUFnQyxPQUFPLFVBQVAsQ0FIZjtBQUl2QyxnQkFBSSxZQUFZLEtBQUssU0FBTCxDQUFlLEdBQWYsRUFBb0IsU0FBcEIsRUFBK0IsR0FBL0IsQ0FBWjs7O0FBSm1DLGdCQU9uQyxTQUFKLEVBQWU7O0FBRVgseUJBQVMsc0JBQVQsQ0FBZ0MsU0FBUyxpQkFBVCxFQUE0QixVQUFVLEdBQVYsQ0FBNUQsQ0FGVztBQUdYLHlCQUFTLHNCQUFULENBQWdDLFNBQVMsaUJBQVQsRUFBNEIsVUFBVSxNQUFWLENBQTVELENBSFc7O0FBS1gsb0JBQUksbUJBQW1CLFNBQVMsUUFBVCxDQUFrQixZQUFsQixHQUFpQyxPQUFPLFdBQVAsQ0FMN0M7QUFNWCxvQkFBSSxrQkFBa0IsU0FBUyxRQUFULENBQWtCLFdBQWxCLEdBQWdDLE9BQU8sVUFBUDs7Ozs7QUFOM0Msb0JBV1AsS0FBSyxHQUFMLENBQVMsU0FBUyxRQUFULENBQWtCLFlBQWxCLEdBQWlDLE9BQU8sV0FBUCxHQUFxQixPQUFPLE9BQVAsQ0FBL0QsR0FBaUYsRUFBakYsSUFDQSxPQUFPLE9BQVAsR0FBaUIsQ0FBakIsSUFDQSxxQkFBcUIsZ0JBQXJCLEVBQXVDO0FBQ3ZDLHdCQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLEdBQW5CLEdBQXlCLElBQUksUUFBSixDQUFhLFNBQWIsR0FBeUIsR0FBekIsR0FBZ0MsSUFBaEMsQ0FEYztpQkFGM0M7O0FBTUEsb0JBQUksS0FBSyxHQUFMLENBQVMsU0FBUyxRQUFULENBQWtCLFdBQWxCLEdBQWdDLE9BQU8sVUFBUCxHQUFvQixPQUFPLE9BQVAsQ0FBN0QsR0FBK0UsRUFBL0UsSUFDQSxPQUFPLE9BQVAsR0FBaUIsQ0FBakIsSUFDQSxvQkFBb0IsZUFBcEIsRUFBcUM7O0FBRXJDLHdCQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLElBQW5CLEdBQTBCLElBQUksUUFBSixDQUFhLFVBQWIsR0FBMEIsR0FBMUIsR0FBaUMsSUFBakMsQ0FGVztpQkFGekM7YUFqQko7U0FSSjs7O0FBRDRCLGlCQW9DNUIsR0FBWSxFQUFDLEtBQUssVUFBVSxHQUFWLEVBQWUsUUFBUSxVQUFVLE1BQVYsRUFBekMsQ0FwQzRCO0tBQWxCOzs7Ozs7O0FBeEdLLFFBb0pmLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQjtBQUN4QyxZQUFJLFVBQVUsU0FBUyxRQUFULENBQWtCLFdBQWxCLEdBQWdDLFNBQVMsT0FBVCxDQUROO0FBRXhDLFlBQUksU0FBUyxTQUFTLFFBQVQsQ0FBa0IsWUFBbEIsR0FBaUMsU0FBUyxPQUFUOzs7QUFGTixjQUt4QyxHQUFTLEVBQUUsS0FBRixDQUwrQjtBQU14QyxpQkFBUyxFQUFFLEtBQUY7OztBQU4rQixZQVNwQyxRQUFRLFNBQVMsVUFBVCxHQUFzQixLQUF0QixDQVQ0QjtBQVV4QyxZQUFJLFFBQVEsU0FBUyxVQUFULEdBQXNCLEtBQXRCLENBVjRCOztBQVl4QyxnQkFBUSxDQUFSLENBWndDO0FBYXhDLGdCQUFRLENBQVI7OztBQWJ3QyxrQkFnQnhDLEdBQWEsTUFBYixDQWhCd0M7QUFpQnhDLHFCQUFhLE1BQWIsQ0FqQndDOztBQW1CeEMsWUFBSSxLQUFLLEtBQUwsQ0FuQm9DO0FBb0J4QyxZQUFJLEtBQUssS0FBTCxDQXBCb0M7QUFxQnhDLFlBQUksS0FBSyxFQUFMLEdBQVUsT0FBVixFQUFtQjtBQUNuQixvQkFBUSxVQUFVLEVBQVYsQ0FEVztBQUVuQixvQkFBUSxLQUFLLEtBQUwsQ0FGVztTQUF2QixNQUdPLElBQUksS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLE9BQWYsRUFBd0I7QUFDL0Isb0JBQVEsVUFBVSxFQUFWLEdBQWUsRUFBZixDQUR1QjtBQUUvQixvQkFBUSxLQUFLLEtBQUwsQ0FGdUI7U0FBNUI7O0FBS1AsWUFBSSxLQUFLLEVBQUwsR0FBVSxNQUFWLEVBQWtCO0FBQ2xCLG9CQUFRLFNBQVMsRUFBVCxDQURVO0FBRWxCLG9CQUFRLEtBQUssS0FBTCxDQUZVO1NBQXRCLE1BR08sSUFBSSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsTUFBZixFQUF1QjtBQUM5QixvQkFBUSxTQUFTLEVBQVQsR0FBYyxFQUFkLENBRHNCO0FBRTlCLG9CQUFRLEtBQUssS0FBTCxDQUZzQjtTQUEzQjtBQUlQLGNBQU0sS0FBTixDQXBDd0M7QUFxQ3hDLGNBQU0sS0FBTixDQXJDd0M7O0FBdUN4QyxZQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLEdBQW5CLEdBQXlCLEtBQUssSUFBTCxDQXZDZTtBQXdDeEMsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixJQUFuQixHQUEwQixLQUFLLElBQUw7OztBQXhDYyxZQTJDcEMsRUFBRSxLQUFGLEdBQVUsU0FBUyxJQUFULENBQWMsU0FBZCxHQUEwQixTQUFTLGlCQUFULEVBQTRCO0FBQ2hFLHFCQUFTLElBQVQsQ0FBYyxTQUFkLEdBQTBCLFNBQVMsSUFBVCxDQUFjLFNBQWQsR0FBMEIsU0FBUyxXQUFULENBRFk7U0FBcEUsTUFFTyxJQUFJLE9BQU8sV0FBUCxJQUFzQixFQUFFLEtBQUYsR0FBVSxTQUFTLElBQVQsQ0FBYyxTQUFkLENBQWhDLEdBQTJELFNBQVMsaUJBQVQsRUFBNEI7QUFDOUYscUJBQVMsSUFBVCxDQUFjLFNBQWQsR0FBMEIsU0FBUyxJQUFULENBQWMsU0FBZCxHQUEwQixTQUFTLFdBQVQsQ0FEMEM7U0FBM0Y7OztBQTdDaUMsWUFrRHBDLEVBQUUsS0FBRixHQUFVLFNBQVMsSUFBVCxDQUFjLFVBQWQsR0FBMkIsU0FBUyxpQkFBVCxFQUE0QjtBQUNqRSxxQkFBUyxJQUFULENBQWMsVUFBZCxHQUEyQixTQUFTLElBQVQsQ0FBYyxVQUFkLEdBQTJCLFNBQVMsV0FBVCxDQURXO1NBQXJFLE1BRU8sSUFBSSxPQUFPLFVBQVAsSUFBcUIsRUFBRSxLQUFGLEdBQVUsU0FBUyxJQUFULENBQWMsVUFBZCxDQUEvQixHQUEyRCxTQUFTLGlCQUFULEVBQTRCO0FBQzlGLHFCQUFTLElBQVQsQ0FBYyxVQUFkLEdBQTJCLFNBQVMsSUFBVCxDQUFjLFVBQWQsR0FBMkIsU0FBUyxXQUFULENBRHdDO1NBQTNGO0tBcERlLENBcEpQOztBQTZNbkIsV0FBTyxPQUFPLE1BQVAsQ0FBYztBQUNqQiw0QkFEaUI7QUFFakIsa0JBRmlCO0FBR2pCLHdCQUhpQjtLQUFkLENBQVAsQ0E3TW1CO0NBQXZCOzs7Ozs7Ozs7QUNGQTs7a0JBQ2U7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCZixTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CO1FBQ1YsV0FBa0MsSUFBbEMsU0FEVTtRQUNBLFdBQXdCLElBQXhCLFNBREE7UUFDVSxhQUFjLElBQWQsV0FEVjs7O0FBR2YsUUFBSSxXQUFXLFNBQVMsRUFBQyxrQkFBRCxFQUFXLGtCQUFYLEVBQVQsQ0FBWCxDQUhXO0FBSWYsUUFBSSxhQUFhLFdBQVcsRUFBQyxrQkFBRCxFQUFXLHNCQUFYLEVBQVgsQ0FBYjs7Ozs7Ozs7OztBQUpXLFFBY1gsT0FBTyxTQUFQLElBQU8sR0FBWTs7QUFFbkIsbUJBQVcsSUFBWDs7O0FBRm1CLGdCQUtuQixDQUFTLElBQVQsR0FMbUI7S0FBWjs7Ozs7Ozs7Ozs7QUFkSSxRQStCWCxZQUFZLFNBQVosU0FBWSxDQUFVLEdBQVYsRUFBZSxRQUFmLEVBQXlCLFVBQXpCLEVBQXFDO0FBQ2pELFlBQUksYUFBYSxXQUFXLFNBQVgsQ0FBcUIsR0FBckIsRUFBMEIsUUFBMUIsQ0FBYixDQUQ2Qzs7QUFHakQsWUFBSSxXQUFXLE1BQVgsR0FBb0IsQ0FBcEIsRUFBdUI7QUFDdkIscUJBQVMsU0FBVCxDQUFtQixVQUFuQixFQUErQixVQUEvQixFQUR1QjtBQUV2QixxQkFBUyxVQUFULEdBRnVCOztBQUl2QixtQkFBTyxJQUFQLENBSnVCO1NBQTNCOztBQU9BLGVBQU8sS0FBUCxDQVZpRDtLQUFyQzs7Ozs7O0FBL0JELFFBZ0RYLFlBQVksU0FBWixTQUFZLENBQVUsR0FBVixFQUFlO0FBQzNCLG1CQUFXLFNBQVgsQ0FBcUIsR0FBckIsRUFEMkI7QUFFM0IsaUJBQVMsVUFBVCxHQUYyQjtLQUFmOzs7Ozs7QUFoREQsUUF5RFgsWUFBWSxTQUFaLFNBQVksQ0FBVSxHQUFWLEVBQWU7O0FBRTNCLGlCQUFTLFNBQVQsQ0FBbUIsVUFBbkIsRUFGMkI7QUFHM0IsaUJBQVMsVUFBVCxHQUgyQjtLQUFmOzs7Ozs7QUF6REQsUUFtRVgsY0FBYyxTQUFkLFdBQWMsQ0FBVSxHQUFWLEVBQWU7QUFDN0IsbUJBQVcsZUFBWCxDQUEyQixHQUEzQixFQUFnQyxDQUFoQyxFQUQ2QjtBQUU3QixtQkFBVyxrQkFBWCxDQUE4QixHQUE5QixFQUFtQyxDQUFuQyxFQUY2QjtBQUc3QixpQkFBUyxVQUFULEdBSDZCO0tBQWY7Ozs7OztBQW5FSCxRQTZFWCxXQUFXLFNBQVgsUUFBVyxDQUFVLEdBQVYsRUFBZTs7OztLQUFmOzs7OztBQTdFQSxRQXNGWCxZQUFZLFNBQVosU0FBWSxHQUFZO0FBQ3hCLG1CQUFXLGVBQVgsR0FEd0I7QUFFeEIsbUJBQVcsa0JBQVgsR0FGd0I7QUFHeEIsaUJBQVMsVUFBVCxHQUh3QjtLQUFaLENBdEZEOztBQTRGZixRQUFJLGNBQWMsU0FBZCxXQUFjLEdBQVk7QUFDMUIsaUJBQVMsU0FBVCxDQUFtQixTQUFTLEtBQVQsQ0FBbkIsQ0FEMEI7QUFFMUIsaUJBQVMsVUFBVCxHQUYwQjtLQUFaLENBNUZIOztBQWlHZixXQUFPLE9BQU8sTUFBUCxDQUFjO0FBQ2pCLGNBQU0sSUFBTjtBQUNBLG1CQUFXLFNBQVg7QUFDQSxtQkFBVyxXQUFXLFNBQVg7QUFDWCxtQkFBVyxXQUFXLFNBQVg7QUFDWCxnQkFBUSxXQUFXLE1BQVg7QUFDUixxQkFBYSxXQUFiO0FBQ0Esa0JBQVUsUUFBVjtBQUNBLG1CQUFXLFNBQVg7QUFDQSxxQkFBYSxXQUFiO0tBVEcsQ0FBUCxDQWpHZTtDQUFuQjs7Ozs7Ozs7QUFvSEEsU0FBUyxRQUFULENBQWtCLEdBQWxCLEVBQXVCO1FBQ2QsV0FBc0IsSUFBdEIsU0FEYztRQUNKLFdBQVksSUFBWixTQURJOztBQUVuQixRQUFJLHlCQUFKLENBRm1CO0FBR25CLFFBQUksNkJBQUosQ0FIbUI7O0FBS25CLFFBQUksT0FBTyxTQUFQLElBQU8sR0FBWTtBQUNuQixZQUFJLFNBQVMsYUFBVCxFQUF3QjtBQUFDLHFDQUFEO1NBQTVCO0FBQ0EsWUFBSSxTQUFTLGlCQUFULEVBQTRCO0FBQUMseUNBQUQ7U0FBaEM7O0FBRUEsaUNBSm1COztBQU1uQixpQkFBUyxjQUFULEdBTm1CO0FBT25CLGlCQUFTLFlBQVQsR0FQbUI7O0FBU25CLHFCQVRtQjtBQVVuQixrQkFBVSxTQUFTLEtBQVQsQ0FBVixDQVZtQjtLQUFaOzs7OztBQUxRLFFBcUJmLHlCQUF5QixTQUF6QixzQkFBeUIsR0FBWTtBQUNyQyxZQUFJLGdCQUFnQixxQkFBaEIsQ0FEaUM7QUFFckMsWUFBSSxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsTUFBMkMsSUFBM0MsRUFBaUQ7QUFDakQsK0JBQW1CLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFuQixDQURpRDtBQUVqRCw2QkFBaUIsRUFBakIsR0FBc0IsYUFBdEIsQ0FGaUQ7QUFHakQscUJBQVMsUUFBVCxDQUFrQixXQUFsQixDQUE4QixnQkFBOUIsRUFIaUQ7U0FBckQ7S0FGeUI7Ozs7O0FBckJWLFFBaUNmLDZCQUE2QixTQUE3QiwwQkFBNkIsR0FBWTtBQUN6QyxZQUFJLG9CQUFvQix5QkFBcEIsQ0FEcUM7QUFFekMsWUFBSSxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLE1BQStDLElBQS9DLEVBQXFEO0FBQ3JELG1DQUF1QixTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdkIsQ0FEcUQ7QUFFckQsaUNBQXFCLEVBQXJCLEdBQTBCLGlCQUExQixDQUZxRDtBQUdyRCxxQkFBUyxRQUFULENBQWtCLFdBQWxCLENBQThCLG9CQUE5QixFQUhxRDtTQUF6RDtLQUY2Qjs7Ozs7O0FBakNkLFFBOENmLGtCQUFrQixTQUFsQixlQUFrQixHQUFZO0FBQzlCLFlBQUkscUJBQXFCLElBQXJCLEVBQTJCO0FBQUMsbUJBQUQ7U0FBL0I7O0FBRUEsZ0NBQVksZ0JBQVosRUFIOEI7QUFJOUIsWUFBSSxjQUFjLFNBQVMsY0FBVCxFQUFkLENBSjBCO0FBSzlCLFlBQUksWUFBWSxTQUFTLFlBQVQsRUFBWixDQUwwQjs7QUFPOUIsWUFBSSxhQUFhLEVBQWI7O0FBUDBCLGFBU3pCLElBQUksSUFBSSxDQUFKLEVBQU8sS0FBSyxTQUFTLE9BQVQsRUFBa0IsS0FBSyxDQUFMLEVBQVE7QUFDM0MscUdBQ2tCLEtBQUssWUFBWSxTQUFTLE9BQVQsQ0FBakIsMkdBR0EsU0FBUyxPQUFULDRFQUpsQixDQUQyQztTQUEvQzs7O0FBVDhCLGFBb0J6QixJQUFJLEtBQUksQ0FBSixFQUFPLE1BQUssU0FBUyxVQUFULEVBQXFCLE1BQUssQ0FBTCxFQUFRO0FBQzlDLG1JQUVnQixNQUFLLGNBQWMsU0FBUyxPQUFULENBQW5CLDJFQUVDLFNBQVMsT0FBVCw0RUFKakIsQ0FEOEM7U0FBbEQ7O0FBVUEseUJBQWlCLFNBQWpCLEdBQTZCLFVBQTdCLENBOUI4QjtLQUFaOzs7Ozs7QUE5Q0gsUUFtRmYsc0JBQXNCLFNBQXRCLG1CQUFzQixHQUFZO0FBQ2xDLGdDQUFZLG9CQUFaLEVBRGtDO0FBRWxDLFlBQUksY0FBYyxTQUFTLGNBQVQsRUFBZCxDQUY4QjtBQUdsQyxZQUFJLFlBQVksU0FBUyxZQUFULEVBQVosQ0FIOEI7O0FBS2xDLFlBQUksYUFBYSxFQUFiOztBQUw4QixhQU83QixJQUFJLElBQUksQ0FBSixFQUFPLElBQUksU0FBUyxPQUFULEVBQWtCLEtBQUssQ0FBTCxFQUFRO0FBQzFDLGlCQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxTQUFTLFVBQVQsRUFBcUIsS0FBSyxDQUFMLEVBQVE7QUFDN0MsdUdBQ21CLEtBQUssWUFBYSxTQUFTLE9BQVQsQ0FBbEIsR0FDUCxZQUFZLENBQVosR0FBZ0IsU0FBUyxPQUFULDZDQUNYLEtBQUssY0FBZSxTQUFTLE9BQVQsQ0FBcEIsR0FDTCxjQUFjLENBQWQsR0FBa0IsU0FBUyxPQUFULHlGQUo5QixDQUQ2QzthQUFqRDtTQURKOztBQVlBLDZCQUFxQixTQUFyQixHQUFpQyxVQUFqQyxDQW5Ca0M7S0FBWjs7Ozs7Ozs7QUFuRlAsUUErR2YseUJBQXlCLFNBQXpCLHNCQUF5QixHQUFZO0FBQ3JDLFlBQUksU0FBUyxjQUFULENBQXdCLHFCQUF4QixNQUFtRCxJQUFuRCxFQUF5RDtBQUN6RCxxQkFBUyxpQkFBVCxHQUE2QixTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBN0IsQ0FEeUQ7QUFFekQscUJBQVMsaUJBQVQsQ0FBMkIsRUFBM0IsR0FBZ0MscUJBQWhDLENBRnlEOztBQUl6RCxxQkFBUyxpQkFBVCxDQUEyQixTQUEzQixHQUF1QyxxQkFBdkMsQ0FKeUQ7QUFLekQscUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsUUFBakMsR0FBNEMsVUFBNUMsQ0FMeUQ7QUFNekQscUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsT0FBakMsR0FBMkMsT0FBM0MsQ0FOeUQ7QUFPekQscUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsTUFBakMsR0FBMEMsTUFBMUMsQ0FQeUQ7QUFRekQscUJBQVMsUUFBVCxDQUFrQixXQUFsQixDQUE4QixTQUFTLGlCQUFULENBQTlCLENBUnlEO1NBQTdEO0tBRHlCOzs7Ozs7O0FBL0dWLFFBaUlmLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDekIsaUJBQVMsb0JBQVQsR0FEeUI7QUFFekIsaUJBQVMsbUJBQVQsR0FGeUI7QUFHekIsaUJBQVMsZ0JBQVQsR0FIeUI7O0FBS3pCLFlBQUksU0FBUyxhQUFULEVBQXdCO0FBQUMsOEJBQUQ7U0FBNUI7QUFDQSxZQUFJLFNBQVMsaUJBQVQsRUFBNEI7QUFBQyxrQ0FBRDtTQUFoQztLQU5hOzs7Ozs7QUFqSUUsUUE4SWYsWUFBWSxTQUFaLFNBQVksQ0FBVSxLQUFWLEVBQWlCLFVBQWpCLEVBQTZCO0FBQ3pDLGVBQU8sZ0JBQVAsQ0FBd0IsWUFBTTs7QUFFMUIsa0JBQU0sT0FBTixDQUFjLFVBQVUsR0FBVixFQUFlO0FBQ3pCLG9CQUFJLGVBQWUsR0FBZixFQUFvQjtBQUNwQiw2QkFBUyxzQkFBVCxDQUFnQyxJQUFJLFFBQUosRUFBYyxJQUFJLEdBQUosQ0FBOUMsQ0FEb0I7QUFFcEIsNkJBQVMsc0JBQVQsQ0FBZ0MsSUFBSSxRQUFKLEVBQWMsSUFBSSxNQUFKLENBQTlDLENBRm9CO0FBR3BCLDZCQUFTLG1CQUFULENBQTZCLElBQUksUUFBSixFQUFjLElBQUksT0FBSixDQUEzQyxDQUhvQjtBQUlwQiw2QkFBUyxrQkFBVCxDQUE0QixJQUFJLFFBQUosRUFBYyxJQUFJLFVBQUosQ0FBMUMsQ0FKb0I7aUJBQXhCO2FBRFUsQ0FBZCxDQUYwQjtTQUFOLENBQXhCLENBRHlDO0tBQTdCLENBOUlHOztBQTZKbkIsV0FBTyxPQUFPLE1BQVAsQ0FBYztBQUNqQixrQkFEaUI7QUFFakIsOEJBRmlCO0FBR2pCLDRCQUhpQjtBQUlqQixzREFKaUI7QUFLakIsOERBTGlCO0tBQWQsQ0FBUCxDQTdKbUI7Q0FBdkI7Ozs7OztBQTBLQSxTQUFTLFVBQVQsQ0FBb0IsR0FBcEIsRUFBeUI7UUFDaEIsV0FBd0IsSUFBeEIsU0FEZ0I7UUFDTixhQUFjLElBQWQsV0FETTs7QUFFckIsUUFBSSxjQUFKO1FBQVcsa0JBQVg7UUFBc0IsbUJBQXRCLENBRnFCOztBQUlyQixRQUFJLE9BQU8sU0FBUCxJQUFPLEdBQVk7QUFDbkIsNEJBRG1CO0FBRW5CLHdCQUZtQjtBQUduQiwyQkFIbUI7S0FBWjs7Ozs7QUFKVSxRQWFqQixvQkFBb0IsU0FBcEIsaUJBQW9CLEdBQVk7QUFDaEMsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLE1BQU0sU0FBUyxLQUFULENBQWUsTUFBZixFQUF1QixJQUFJLEdBQUosRUFBUyxHQUF0RCxFQUEyRDtBQUN2RCx1QkFBVyxTQUFYLENBQXFCLFNBQVMsS0FBVCxDQUFlLENBQWYsQ0FBckIsRUFEdUQ7U0FBM0Q7QUFHQSxnQkFBUSxTQUFTLEtBQVQsQ0FKd0I7S0FBWjs7Ozs7OztBQWJILFFBeUJqQixTQUFTLFNBQVQsTUFBUyxDQUFVLE9BQVYsRUFBbUI7QUFDNUIsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLE1BQU0sTUFBTSxNQUFOLEVBQWMsSUFBSSxHQUFKLEVBQVMsR0FBN0MsRUFBa0Q7QUFDOUMsZ0JBQUksTUFBTSxDQUFOLEVBQVMsUUFBVCxLQUFzQixPQUF0QixFQUErQjtBQUFDLHVCQUFPLE1BQU0sQ0FBTixDQUFQLENBQUQ7YUFBbkM7U0FESixDQUQ0QjtLQUFuQjs7Ozs7O0FBekJRLFFBbUNqQixZQUFZLFNBQVosU0FBWSxHQUFZO0FBQ3hCLFlBQUksZ0JBQWdCLEVBQWhCLENBRG9CO0FBRXhCLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLE1BQU0sTUFBTixFQUFjLEdBQWxDLEVBQXVDO0FBQ25DLDBCQUFjLElBQWQsQ0FBbUI7QUFDZixxQkFBSyxNQUFNLENBQU4sRUFBUyxHQUFUO0FBQ0wsd0JBQVEsTUFBTSxDQUFOLEVBQVMsTUFBVDtBQUNSLDRCQUFZLE1BQU0sQ0FBTixFQUFTLFVBQVQ7QUFDWix5QkFBUyxNQUFNLENBQU4sRUFBUyxPQUFUO2FBSmIsRUFEbUM7U0FBdkMsQ0FGd0I7O0FBV3hCLGVBQU8sYUFBUCxDQVh3QjtLQUFaOzs7Ozs7QUFuQ0ssUUFxRGpCLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxhQUFWLEVBQXlCO0FBQy9DLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLE1BQU0sTUFBTixFQUFjLEdBQWxDLEVBQXVDO0FBQ25DLGtCQUFNLENBQU4sRUFBUyxHQUFULEdBQWUsY0FBYyxDQUFkLEVBQWlCLEdBQWpCLEVBQ2YsTUFBTSxDQUFOLEVBQVMsTUFBVCxHQUFrQixjQUFjLENBQWQsRUFBaUIsTUFBakIsRUFDbEIsTUFBTSxDQUFOLEVBQVMsVUFBVCxHQUFzQixjQUFjLENBQWQsRUFBaUIsVUFBakIsRUFDdEIsTUFBTSxDQUFOLEVBQVMsT0FBVCxHQUFtQixjQUFjLENBQWQsRUFBaUIsT0FBakIsQ0FKZ0I7U0FBdkMsQ0FEK0M7S0FBekI7Ozs7OztBQXJETCxRQWtFakIsWUFBWSxTQUFaLFNBQVksQ0FBVSxRQUFWLEVBQW9CO0FBQ2hDLFlBQUksT0FBTyxNQUFNLFFBQU4sRUFBZ0IsUUFBaEIsQ0FEcUI7QUFFaEMsYUFBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLElBQTVCLEVBRmdDO0FBR2hDLGNBQU0sTUFBTixDQUFhLFFBQWIsRUFBdUIsQ0FBdkI7OztBQUhnQyxxQkFNaEMsR0FOZ0M7QUFPaEMsMkJBUGdDO0tBQXBCOzs7Ozs7OztBQWxFSyxRQWtGakIsWUFBWSxTQUFaLFNBQVksQ0FBVSxHQUFWLEVBQWU7QUFDM0Isb0JBQVksR0FBWixDQUQyQjs7QUFHM0IsWUFBSSxJQUFJLElBQUosS0FBYSxTQUFiLElBQTBCLElBQUksTUFBSixLQUFlLFNBQWYsSUFDMUIsSUFBSSxPQUFKLEtBQWdCLFNBQWhCLElBQTZCLElBQUksVUFBSixLQUFtQixTQUFuQixFQUE4QjtBQUMzRCxtQkFBTyxLQUFQLENBRDJEO1NBRC9EOztBQUtBLFlBQUksQ0FBQyxjQUFjLEdBQWQsQ0FBRCxFQUFxQjtBQUNyQixtQkFBTyxLQUFQLENBRHFCO1NBQXpCOztBQUlBLFlBQUksZ0JBQWdCLFdBQWhCLENBWnVCOztBQWMzQixZQUFJLGFBQWEsQ0FBQyxHQUFELENBQWIsQ0FkdUI7QUFlM0IsWUFBSSxZQUFZLFFBQVEsR0FBUixFQUFhLEdBQWIsRUFBa0IsVUFBbEIsQ0FBWixDQWZ1QjtBQWdCM0Isb0JBQVksU0FBWixDQWhCMkI7O0FBa0IzQixZQUFJLFNBQUosRUFBZTtBQUNYLHVCQUFXLFNBQVgsQ0FBcUIsR0FBckIsRUFEVztBQUVYLGtCQUFNLElBQU4sQ0FBVyxHQUFYLEVBRlc7O0FBSVgsNEJBSlc7QUFLWCwrQkFMVztBQU1YLG1CQUFPLEdBQVAsQ0FOVztTQUFmOztBQVNBLDRCQUFvQixhQUFwQixFQTNCMkI7O0FBNkIzQixlQUFPLEtBQVAsQ0E3QjJCO0tBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbEZLLFFBNklqQixZQUFZLFNBQVosU0FBWSxDQUFVLEdBQVYsRUFBZSxRQUFmLEVBQXlCO0FBQ3JDLG9CQUFZLEdBQVosQ0FEcUM7O0FBR3JDLFlBQUksZ0JBQWdCLFdBQWhCLENBSGlDOztBQUtyQyxlQUFPLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLFFBQW5CLEVBTHFDO0FBTXJDLFlBQUksQ0FBQyxjQUFjLEdBQWQsQ0FBRCxFQUFxQjtBQUNyQixnQ0FBb0IsYUFBcEIsRUFEcUI7QUFFckIsbUJBQU8sS0FBUCxDQUZxQjtTQUF6Qjs7QUFLQSxZQUFJLGFBQWEsQ0FBQyxHQUFELENBQWIsQ0FYaUM7QUFZckMsWUFBSSxZQUFZLFFBQVEsR0FBUixFQUFhLEdBQWIsRUFBa0IsVUFBbEIsQ0FBWixDQVppQzs7QUFjckMsWUFBSSxTQUFKLEVBQWU7QUFDWCw0QkFEVztBQUVYLCtCQUZXOztBQUlYLG1CQUFPLFVBQVAsQ0FKVztTQUFmOztBQU9BLDRCQUFvQixhQUFwQixFQXJCcUM7O0FBdUJyQyxlQUFPLEVBQVAsQ0F2QnFDO0tBQXpCOzs7Ozs7Ozs7OztBQTdJSyxRQWdMakIsVUFBVSxTQUFWLE9BQVUsQ0FBVSxHQUFWLEVBQWUsVUFBZixFQUEyQixVQUEzQixFQUF1QztBQUNqRCxZQUFJLHFCQUFxQixHQUFyQixDQUFKLEVBQStCO0FBQUMsbUJBQU8sS0FBUCxDQUFEO1NBQS9COztBQUVBLFlBQUksbUJBQW1CLG9CQUFvQixHQUFwQixFQUF5QixVQUF6QixFQUFxQyxVQUFyQyxDQUFuQjs7O0FBSDZDLGFBTTVDLElBQUksSUFBSSxDQUFKLEVBQU8sTUFBTSxpQkFBaUIsTUFBakIsRUFBeUIsSUFBSSxHQUFKLEVBQVMsR0FBeEQsRUFBNkQ7QUFDekQsZ0JBQUksQ0FBQyxpQkFBaUIsR0FBakIsRUFBc0IsaUJBQWlCLENBQWpCLENBQXRCLEVBQTJDLFVBQTNDLEVBQXVELFVBQXZELENBQUQsRUFBcUU7QUFDckUsdUJBQU8sS0FBUCxDQURxRTthQUF6RTtTQURKOztBQU1BLGVBQU8sSUFBUCxDQVppRDtLQUF2Qzs7Ozs7Ozs7OztBQWhMTyxRQXVNakIsbUJBQW1CLFNBQW5CLGdCQUFtQixDQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXFCLFVBQXJCLEVBQWlDLFVBQWpDLEVBQTZDO0FBQ2hFLHVCQUFlLEdBQWYsRUFBb0IsSUFBcEIsRUFEZ0U7QUFFaEUsZUFBTyxRQUFRLElBQVIsRUFBYyxVQUFkLEVBQTBCLFVBQTFCLENBQVAsQ0FGZ0U7S0FBN0M7Ozs7Ozs7QUF2TUYsUUFpTmpCLGlCQUFpQixTQUFqQixjQUFpQixDQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXFCO0FBQ3RDLGFBQUssR0FBTCxJQUFZLElBQUksR0FBSixHQUFVLElBQUksT0FBSixHQUFjLEtBQUssR0FBTCxDQURFO0tBQXJCOzs7Ozs7O0FBak5BLFFBME5qQixzQkFBc0IsU0FBdEIsbUJBQXNCLENBQVUsR0FBVixFQUFlLFVBQWYsRUFBMkIsVUFBM0IsRUFBdUM7QUFDN0QsWUFBSSxtQkFBbUIsRUFBbkIsQ0FEeUQ7QUFFN0QsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLE1BQU0sTUFBTSxNQUFOLEVBQWMsSUFBSSxHQUFKLEVBQVMsR0FBN0MsRUFBa0Q7O0FBRTlDLGdCQUFJLFFBQVEsTUFBTSxDQUFOLENBQVIsSUFBb0IsTUFBTSxDQUFOLE1BQWEsVUFBYixFQUF5QjtBQUM3QyxvQkFBSSxpQkFBaUIsR0FBakIsRUFBc0IsTUFBTSxDQUFOLENBQXRCLENBQUosRUFBcUM7QUFDakMsK0JBQVcsSUFBWCxDQUFnQixNQUFNLENBQU4sQ0FBaEIsRUFEaUM7QUFFakMscUNBQWlCLElBQWpCLENBQXNCLE1BQU0sQ0FBTixDQUF0QixFQUZpQztpQkFBckM7YUFESjtTQUZKO0FBU0Esa0NBQWMsZ0JBQWQsRUFBZ0MsS0FBaEMsRUFYNkQ7O0FBYTdELGVBQU8sZ0JBQVAsQ0FiNkQ7S0FBdkM7Ozs7Ozs7O0FBMU5MLFFBZ1BqQixtQkFBbUIsU0FBbkIsZ0JBQW1CLENBQVUsR0FBVixFQUFlLElBQWYsRUFBcUI7QUFDeEMsZUFBUSxJQUFJLE1BQUosR0FBYSxLQUFLLE1BQUwsR0FBYyxLQUFLLFVBQUwsSUFDM0IsSUFBSSxNQUFKLEdBQWEsSUFBSSxVQUFKLEdBQWlCLEtBQUssTUFBTCxJQUM5QixJQUFJLEdBQUosR0FBVSxLQUFLLEdBQUwsR0FBVyxLQUFLLE9BQUwsSUFDckIsSUFBSSxPQUFKLEdBQWMsSUFBSSxHQUFKLEdBQVUsS0FBSyxHQUFMLENBSlE7S0FBckI7Ozs7O0FBaFBGLFFBMFBqQixtQkFBbUIsU0FBbkIsZ0JBQW1CLEdBQVk7QUFDL0IsWUFBSSxZQUFZLHNCQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkIsWUFBM0IsQ0FBWixDQUQyQjs7QUFHL0IsWUFBSSxhQUFhLFNBQVMsVUFBVCxFQUFxQjtBQUNsQyxxQkFBUyxVQUFULEdBQXNCLFNBQXRCLENBRGtDO1NBQXRDOztBQUlBLFlBQUksQ0FBQyxTQUFELEVBQVk7QUFDWixtQkFEWTtTQUFoQjs7QUFJQSxZQUFJLFNBQVMsVUFBVCxHQUFzQixVQUFVLE1BQVYsR0FBbUIsVUFBVSxVQUFWLEtBQXlCLENBQWxFLElBQ0EsU0FBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxFQUFxQjtBQUMzQyxxQkFBUyxVQUFULElBQXVCLENBQXZCLENBRDJDO1NBRC9DLE1BR08sSUFBSSxTQUFTLFVBQVQsR0FBc0IsVUFBVSxNQUFWLEdBQWtCLFVBQVUsVUFBVixHQUF1QixDQUEvRCxJQUNQLFVBQVUsTUFBVixHQUFtQixVQUFVLFVBQVYsS0FBeUIsU0FBNUMsSUFDQSxTQUFTLFVBQVQsR0FBc0IsU0FBUyxVQUFULElBQ3RCLFNBQVMsVUFBVCxHQUFzQixTQUFTLFVBQVQsRUFBcUI7QUFDM0MscUJBQVMsVUFBVCxHQUFzQixZQUFZLENBQVosQ0FEcUI7U0FIeEM7S0FkWTs7Ozs7Ozs7QUExUEYsUUFzUmpCLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBVSxHQUFWLEVBQWUsVUFBZixFQUEyQjs7OztBQUloRCxZQUFJLEdBQUMsQ0FBSSxNQUFKLEdBQWEsSUFBSSxVQUFKLEtBQW9CLFNBQVMsVUFBVCxJQUNsQyxTQUFTLFVBQVQsR0FBc0IsU0FBUyxVQUFULEVBQXFCO0FBQzNDLHFCQUFTLFVBQVQsSUFBdUIsQ0FBdkIsQ0FEMkM7QUFFM0MsbUJBQU8sSUFBUCxDQUYyQztTQUQvQzs7QUFNQSxlQUFPLEtBQVAsQ0FWZ0Q7S0FBM0I7Ozs7OztBQXRSSixRQXVTakIscUJBQXFCLFNBQXJCLGtCQUFxQixHQUFhO0FBQ2xDLFlBQUksZUFBZSxDQUFmLENBRDhCOztBQUdsQyxjQUFNLE9BQU4sQ0FBYyxVQUFVLEdBQVYsRUFBZTtBQUN6QixnQkFBSSxlQUFnQixJQUFJLE1BQUosR0FBYSxJQUFJLFVBQUosRUFBaUI7QUFDOUMsK0JBQWUsSUFBSSxNQUFKLEdBQWEsSUFBSSxVQUFKLENBRGtCO2FBQWxEO1NBRFUsQ0FBZCxDQUhrQzs7QUFTbEMsWUFBSSxlQUFlLFNBQVMsVUFBVCxFQUFxQjtBQUFDLHFCQUFTLFVBQVQsR0FBc0IsWUFBdEIsQ0FBRDtTQUF4QztBQUNBLFlBQUksZUFBZSxTQUFTLFVBQVQsRUFBcUI7QUFBQyxxQkFBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxDQUF2QjtTQUF4Qzs7QUFFQSxlQUFPLElBQVAsQ0Faa0M7S0FBYjs7Ozs7Ozs7Ozs7QUF2U0osUUErVGpCLGdCQUFnQixTQUFoQixhQUFnQixHQUFZO0FBQzVCLFlBQUksU0FBUyxzQkFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCLFNBQXhCLENBQVQsQ0FEd0I7O0FBRzVCLFlBQUksVUFBVSxTQUFTLE9BQVQsRUFBa0I7QUFDNUIscUJBQVMsT0FBVCxHQUFtQixNQUFuQixDQUQ0QjtTQUFoQzs7QUFJQSxZQUFJLENBQUMsU0FBRCxFQUFZO0FBQ1osbUJBRFk7U0FBaEI7OztBQVA0QixZQVl4QixTQUFTLE9BQVQsR0FBbUIsVUFBVSxHQUFWLEdBQWdCLFVBQVUsT0FBVixLQUFzQixDQUF6RCxJQUNBLFNBQVMsT0FBVCxHQUFtQixTQUFTLE9BQVQsRUFBa0I7QUFDckMscUJBQVMsT0FBVCxJQUFvQixDQUFwQixDQURxQztTQUR6QyxNQUdPLElBQUksU0FBUyxPQUFULEdBQW1CLFVBQVUsR0FBVixHQUFnQixVQUFVLE9BQVYsR0FBb0IsQ0FBdkQsSUFDUCxVQUFVLEdBQVYsR0FBZ0IsVUFBVSxPQUFWLEtBQXNCLE1BQXRDLElBQ0EsU0FBUyxPQUFULEdBQW1CLFNBQVMsT0FBVCxJQUNuQixTQUFTLE9BQVQsR0FBbUIsU0FBUyxPQUFULEVBQWtCO0FBQ3JDLHFCQUFTLE9BQVQsR0FBbUIsU0FBUyxDQUFULENBRGtCO1NBSGxDO0tBZlM7Ozs7Ozs7QUEvVEMsUUE0VmpCLGtCQUFrQixTQUFsQixlQUFrQixDQUFVLEdBQVYsRUFBZSxPQUFmLEVBQXdCOzs7O0FBSTFDLFlBQUksR0FBQyxDQUFJLEdBQUosR0FBVSxJQUFJLE9BQUosS0FBaUIsU0FBUyxPQUFULElBQzVCLFNBQVMsT0FBVCxHQUFtQixTQUFTLE9BQVQsRUFBa0I7QUFDckMscUJBQVMsT0FBVCxJQUFvQixDQUFwQixDQURxQztBQUVyQyxtQkFBTyxJQUFQLENBRnFDO1NBRHpDOztBQU1BLGVBQU8sS0FBUCxDQVYwQztLQUF4Qjs7Ozs7O0FBNVZELFFBNldqQixrQkFBa0IsU0FBbEIsZUFBa0IsR0FBYTtBQUMvQixZQUFJLFlBQVksQ0FBWixDQUQyQjs7QUFHL0IsY0FBTSxPQUFOLENBQWMsVUFBVSxHQUFWLEVBQWU7QUFDekIsZ0JBQUksWUFBYSxJQUFJLEdBQUosR0FBVSxJQUFJLE9BQUosRUFBYztBQUNyQyw0QkFBWSxJQUFJLEdBQUosR0FBVSxJQUFJLE9BQUosQ0FEZTthQUF6QztTQURVLENBQWQsQ0FIK0I7O0FBUy9CLFlBQUksWUFBWSxTQUFTLE9BQVQsRUFBa0I7QUFBQyxxQkFBUyxPQUFULEdBQW1CLFNBQW5CLENBQUQ7U0FBbEM7QUFDQSxZQUFJLFlBQVksU0FBUyxPQUFULEVBQWtCO0FBQUMscUJBQVMsT0FBVCxHQUFtQixTQUFTLE9BQVQsQ0FBcEI7U0FBbEM7O0FBRUEsZUFBTyxJQUFQLENBWitCO0tBQWI7Ozs7Ozs7QUE3V0QsUUFpWWpCLGdCQUFnQixTQUFoQixhQUFnQixDQUFVLEdBQVYsRUFBZTtBQUMvQixZQUFJLElBQUksT0FBSixHQUFjLFNBQVMsVUFBVCxJQUNkLElBQUksT0FBSixHQUFjLFNBQVMsVUFBVCxJQUNkLElBQUksVUFBSixHQUFpQixTQUFTLGFBQVQsSUFDakIsSUFBSSxVQUFKLEdBQWlCLFNBQVMsYUFBVCxFQUF3QjtBQUN6QyxtQkFBTyxLQUFQLENBRHlDO1NBSDdDOztBQU9BLGVBQU8sSUFBUCxDQVIrQjtLQUFmOzs7Ozs7O0FBallDLFFBaVpqQix1QkFBdUIsU0FBdkIsb0JBQXVCLENBQVUsR0FBVixFQUFlOztBQUV0QyxZQUFJLElBQUksTUFBSixHQUFhLENBQWIsSUFDQSxJQUFJLEdBQUosR0FBVSxDQUFWLEVBQWE7QUFDYixtQkFBTyxJQUFQLENBRGE7U0FEakI7OztBQUZzQyxZQVFsQyxJQUFJLEdBQUosR0FBVSxJQUFJLE9BQUosR0FBYyxTQUFTLE9BQVQsSUFDeEIsSUFBSSxNQUFKLEdBQWEsSUFBSSxVQUFKLEdBQWlCLFNBQVMsVUFBVCxFQUFxQjtBQUNuRCxtQkFBTyxJQUFQLENBRG1EO1NBRHZEOztBQUtBLGVBQU8sS0FBUCxDQWJzQztLQUFmLENBalpOOztBQWlhckIsV0FBTyxPQUFPLE1BQVAsQ0FBYztBQUNqQixrQkFEaUI7QUFFakIsNEJBRmlCO0FBR2pCLG9DQUhpQjtBQUlqQix3Q0FKaUI7QUFLakIsd0NBTGlCO0FBTWpCLDBDQU5pQjtBQU9qQiw4Q0FQaUI7QUFRakIsOENBUmlCO0FBU2pCLHNCQVRpQjtBQVVqQiw0QkFWaUI7QUFXakIsNEJBWGlCO0tBQWQsQ0FBUCxDQWphcUI7Q0FBekI7Ozs7Ozs7O2tCQzFTd0I7O0FBRnhCOztBQUVlLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtRQUNsQyxVQUFvQyxLQUFwQyxRQURrQztRQUN6QixVQUEyQixLQUEzQixRQUR5QjtRQUNoQixXQUFrQixLQUFsQixTQURnQjtRQUNOLE9BQVEsS0FBUixLQURNOzs7QUFHdkMsUUFBSSxZQUFZLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0IsVUFBcEIsRUFBZ0MsUUFBaEMsQ0FBWixDQUhtQzs7QUFLdkMsYUFBUyxJQUFULEdBQWdCO0FBQUMsaUJBQVMsUUFBVCxDQUFrQixnQkFBbEIsQ0FBbUMsV0FBbkMsRUFBZ0QsVUFBVSxDQUFWLEVBQWE7QUFBQyxzQkFBVSxDQUFWLEVBQWEsU0FBUyxRQUFULENBQWIsQ0FBRCxDQUFrQyxDQUFFLGNBQUYsR0FBbEM7U0FBYixFQUFxRSxLQUFySCxFQUFEO0tBQWhCOztBQUVBLGFBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixPQUF0QixFQUErQjtBQUMzQixZQUFJLE9BQU8sRUFBRSxNQUFGOzs7Ozs7QUFEZ0IsWUFPdkIsVUFBVSxPQUFWLENBQWtCLEtBQUssUUFBTCxDQUFjLFdBQWQsRUFBbEIsSUFBaUQsQ0FBQyxDQUFELEVBQUk7QUFBQyxtQkFBRDtTQUF6RDtBQUNBLFlBQUksS0FBSyxZQUFMLENBQWtCLFNBQWxCLENBQUosRUFBa0M7QUFBQyxtQkFBRDtTQUFsQztBQUNBLFlBQUksRUFBRSxLQUFGLEtBQVksQ0FBWixJQUFpQixFQUFFLEtBQUYsS0FBWSxDQUFaLEVBQWU7QUFBQyxtQkFBRDtTQUFwQzs7O0FBVDJCLFlBWXZCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsNEJBQXRCLElBQXNELENBQUMsQ0FBRCxFQUFJO0FBQUMsd0JBQVksQ0FBWixFQUFlLFdBQWYsRUFBRDtTQUE5RCxNQUNLLElBQUksS0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsQ0FBdEIsR0FBbUQsQ0FBQyxDQUFELEVBQUk7QUFBQyx3QkFBWSxDQUFaLEVBQWUsU0FBZixFQUFEO1NBQTNEO0tBYlQ7Ozs7Ozs7QUFQdUMsYUE0QjlCLFdBQVQsQ0FBcUIsQ0FBckIsRUFBd0IsRUFBeEIsRUFBNEI7QUFDeEIsWUFBSSxhQUFhLHVCQUFXLEVBQUUsTUFBRixFQUFVLGdCQUFyQixDQUFiLENBRG9CO0FBRXhCLFlBQUksTUFBTSxLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQU4sQ0FGb0I7QUFHeEIsWUFBSSxHQUFKLEVBQVM7QUFBRSxlQUFHLEdBQUgsRUFBUSxDQUFSLEVBQUY7U0FBVDtLQUhKOzs7Ozs7O0FBNUJ1QyxhQXVDOUIsU0FBVCxDQUFtQixHQUFuQixFQUF3QixDQUF4QixFQUEyQjtBQUN2QixZQUFJLENBQUMsU0FBUyxTQUFULENBQW1CLE9BQW5CLElBQThCLENBQUMsSUFBSSxTQUFKLEVBQWU7QUFBQyxtQkFBRDtTQUFuRDs7O0FBRHVCLGVBSXZCLENBQVEsU0FBUixDQUFrQixHQUFsQixFQUF1QixDQUF2QixFQUp1Qjs7QUFNdkIsaUJBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsT0FBckMsRUFBOEMsS0FBOUMsRUFOdUI7QUFPdkIsaUJBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsSUFBdkMsRUFBNkMsS0FBN0MsRUFQdUI7O0FBU3ZCLGlCQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCOztBQUViLG9CQUFRLElBQVIsQ0FBYSxHQUFiLEVBQWtCLENBQWxCLEVBRmE7QUFHYixjQUFFLGNBQUYsR0FIYTtTQUFqQjs7QUFNQSxpQkFBUyxPQUFULENBQWlCLENBQWpCLEVBQW9COztBQUVoQixvQkFBUSxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLENBQXJCLEVBRmdCO0FBR2hCLGNBQUUsY0FBRixHQUhnQjtBQUloQixxQkFBUyxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxPQUF4QyxFQUFpRCxLQUFqRCxFQUpnQjtBQUtoQixxQkFBUyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxJQUExQyxFQUFnRCxLQUFoRCxFQUxnQjtTQUFwQjtLQWZKOzs7Ozs7O0FBdkN1QyxhQW9FOUIsV0FBVCxDQUFxQixHQUFyQixFQUEwQixDQUExQixFQUE2QjtBQUN6QixZQUFJLENBQUMsU0FBUyxTQUFULENBQW1CLE9BQW5CLElBQThCLENBQUMsSUFBSSxTQUFKLEVBQWU7QUFBQyxtQkFBRDtTQUFuRDtBQUNBLGdCQUFRLFdBQVIsQ0FBb0IsR0FBcEIsRUFBeUIsQ0FBekIsRUFGeUI7O0FBSXpCLGlCQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFNBQXJDLEVBQWdELEtBQWhELEVBSnlCO0FBS3pCLGlCQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLE1BQXZDLEVBQStDLEtBQS9DLEVBTHlCOztBQU96QixpQkFBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CO0FBQUMsb0JBQVEsTUFBUixDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsRUFBRCxDQUF3QixDQUFFLGNBQUYsR0FBeEI7U0FBbkI7O0FBRUEsaUJBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQjtBQUNsQixxQkFBUyxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxTQUF4QyxFQUFtRCxLQUFuRCxFQURrQjtBQUVsQixxQkFBUyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxNQUExQyxFQUFrRCxLQUFsRCxFQUZrQjs7QUFJbEIsb0JBQVEsU0FBUixDQUFrQixHQUFsQixFQUF1QixDQUF2QixFQUprQjtBQUtsQixjQUFFLGNBQUYsR0FMa0I7U0FBdEI7S0FUSjs7QUFrQkEsV0FBTyxPQUFPLE1BQVAsQ0FBYztBQUNqQixrQkFEaUI7S0FBZCxDQUFQLENBdEZ1QztDQUE1Qjs7Ozs7Ozs7Ozs7QUNOZjs7a0JBQ2U7OztBQUVmLFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtRQUNiLFdBQVksS0FBWjs7O0FBRGE7QUFJbEIsUUFBSSxjQUFjLEVBQWQsQ0FKYztBQUtsQixRQUFJLFdBQVcsRUFBWCxDQUxjO0FBTWxCLFFBQUksb0JBQUo7UUFBaUIsa0JBQWpCOzs7OztBQU5rQixRQVdkLGlCQUFpQixTQUFqQixjQUFpQixHQUFZO0FBQzdCLGVBQU8sV0FBUCxDQUQ2QjtLQUFaOzs7OztBQVhILFFBa0JkLGVBQWUsU0FBZixZQUFlLEdBQVk7QUFDM0IsZUFBTyxTQUFQLENBRDJCO0tBQVo7Ozs7Ozs7QUFsQkQsUUEyQmQsc0JBQXNCLFNBQXRCLG1CQUFzQixHQUFZO0FBQ2xDLGlCQUFTLFFBQVQsQ0FBa0IsS0FBbEIsQ0FBd0IsS0FBeEIsR0FBZ0MsY0FDNUIsY0FBYyxTQUFTLFVBQVQsR0FBc0IsQ0FBQyxTQUFTLFVBQVQsR0FBc0IsQ0FBdEIsQ0FBRCxHQUE0QixTQUFTLE9BQVQsR0FBbUIsSUFBbkYsR0FDQSxTQUFTLFFBQVQsQ0FBa0IsVUFBbEIsQ0FBNkIsV0FBN0IsR0FBMkMsSUFBM0MsQ0FIOEI7S0FBWjs7Ozs7OztBQTNCUixRQXNDZCxpQkFBaUIsU0FBakIsY0FBaUIsR0FBWTtBQUM3QixzQkFBYyxRQUFDLENBQVMsV0FBVCxLQUF5QixNQUF6QixHQUNYLFNBQVMsV0FBVCxHQUNBLENBQUMsU0FBUyxRQUFULENBQWtCLFVBQWxCLENBQTZCLFdBQTdCLEdBQTJDLENBQUMsU0FBUyxVQUFULEdBQXNCLENBQXRCLENBQUQsR0FBNEIsU0FBUyxPQUFULENBQXhFLEdBQTRGLFNBQVMsVUFBVCxDQUhuRTtLQUFaOzs7Ozs7O0FBdENILFFBaURkLHVCQUF1QixTQUF2QixvQkFBdUIsR0FBWTtBQUNuQyxpQkFBUyxRQUFULENBQWtCLEtBQWxCLENBQXdCLE1BQXhCLEdBQWlDLFlBQzdCLFlBQVksU0FBUyxPQUFULEdBQW1CLENBQUMsU0FBUyxPQUFULEdBQW1CLENBQW5CLENBQUQsR0FBeUIsU0FBUyxPQUFULEdBQW1CLElBQTNFLEdBQ0EsU0FBUyxRQUFULENBQWtCLFVBQWxCLENBQTZCLFlBQTdCLEdBQTRDLElBQTVDLENBSCtCO0tBQVo7Ozs7Ozs7QUFqRFQsUUE0RGQsZUFBZSxTQUFmLFlBQWUsR0FBWTtBQUMzQixvQkFBWSxRQUFDLENBQVMsU0FBVCxLQUF1QixNQUF2QixHQUNULFNBQVMsU0FBVCxHQUNBLENBQUMsU0FBUyxRQUFULENBQWtCLFVBQWxCLENBQTZCLFlBQTdCLEdBQTRDLENBQUMsU0FBUyxPQUFULEdBQW1CLENBQW5CLENBQUQsR0FBeUIsU0FBUyxPQUFULENBQXRFLEdBQTBGLFNBQVMsT0FBVCxDQUhuRTtLQUFaOzs7Ozs7O0FBNURELFFBdUVkLHlCQUF5QixTQUF6QixzQkFBeUIsQ0FBVSxPQUFWLEVBQW1CLE1BQW5CLEVBQTJCO0FBQ3BELGdCQUFRLEtBQVIsQ0FBYyxJQUFkLEdBQXFCLFNBQVMsV0FBVCxHQUF1QixTQUFTLE9BQVQsSUFBb0IsU0FBUyxDQUFULENBQXBCLEdBQWtDLElBQXpELENBRCtCO0tBQTNCOzs7Ozs7O0FBdkVYLFFBZ0ZkLHlCQUF5QixTQUF6QixzQkFBeUIsQ0FBVSxPQUFWLEVBQW1CLEdBQW5CLEVBQXdCO0FBQ2pELGdCQUFRLEtBQVIsQ0FBYyxHQUFkLEdBQW9CLE1BQU0sU0FBTixHQUFrQixTQUFTLE9BQVQsSUFBb0IsTUFBTSxDQUFOLENBQXBCLEdBQStCLElBQWpELENBRDZCO0tBQXhCOzs7Ozs7O0FBaEZYLFFBeUZkLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBVSxPQUFWLEVBQW1CLFVBQW5CLEVBQStCO0FBQ3BELGdCQUFRLEtBQVIsQ0FBYyxLQUFkLEdBQXNCLGFBQWEsV0FBYixHQUEyQixTQUFTLE9BQVQsSUFBb0IsYUFBYSxDQUFiLENBQXBCLEdBQXNDLElBQWpFLENBRDhCO0tBQS9COzs7Ozs7O0FBekZQLFFBa0dkLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxPQUFWLEVBQW1CLE9BQW5CLEVBQTRCO0FBQ2xELGdCQUFRLEtBQVIsQ0FBYyxNQUFkLEdBQXVCLFVBQVUsU0FBVixHQUFzQixTQUFTLE9BQVQsSUFBb0IsVUFBVSxDQUFWLENBQXBCLEdBQW1DLElBQXpELENBRDJCO0tBQTVCOzs7Ozs7OztBQWxHUixRQTRHZCxtQkFBbUIsU0FBbkIsZ0JBQW1CLEdBQVk7QUFDL0IsbUJBQVcsRUFBWCxDQUQrQjtBQUUvQixzQkFBYyxFQUFkLENBRitCO0FBRy9CLFlBQUksY0FBSixDQUgrQjtBQUkvQixZQUFJLGFBQUosQ0FKK0I7O0FBTS9CLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFNBQVMsT0FBVCxFQUFrQixLQUFLLENBQUwsRUFBUTtBQUMxQyxvQkFBUSxLQUFLLFlBQVksU0FBUyxPQUFULENBQWpCLEdBQXFDLFNBQVMsT0FBVCxHQUFtQixDQUFuQixDQURIO0FBRTFDLG1CQUFPLFFBQVEsU0FBUixHQUFvQixTQUFTLE9BQVQsQ0FGZTtBQUcxQyxxQkFBUyxJQUFULENBQWMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQUQsRUFBb0IsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFwQixDQUFkLEVBSDBDO1NBQTlDOztBQU1BLGFBQUssSUFBSSxLQUFJLENBQUosRUFBTyxLQUFJLFNBQVMsVUFBVCxFQUFxQixNQUFLLENBQUwsRUFBUTtBQUM3QyxvQkFBUSxNQUFLLGNBQWMsU0FBUyxPQUFULENBQW5CLEdBQXVDLFNBQVMsT0FBVCxHQUFtQixDQUFuQixDQURGO0FBRTdDLG1CQUFPLFFBQVEsV0FBUixHQUFzQixTQUFTLE9BQVQsQ0FGZ0I7QUFHN0Msd0JBQVksSUFBWixDQUFpQixDQUFDLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBRCxFQUFvQixLQUFLLElBQUwsQ0FBVSxJQUFWLENBQXBCLENBQWpCLEVBSDZDO1NBQWpEO0tBWm1COzs7Ozs7Ozs7Ozs7QUE1R0wsUUF5SWQsdUJBQXVCLFNBQXZCLG9CQUF1QixDQUFVLElBQVYsRUFBZ0I7WUFDbEMsTUFBNEIsS0FBNUIsSUFEa0M7WUFDN0IsUUFBdUIsS0FBdkIsTUFENkI7WUFDdEIsU0FBZ0IsS0FBaEIsT0FEc0I7WUFDZCxPQUFRLEtBQVIsS0FEYzs7QUFFdkMsWUFBSSxnQkFBSjtZQUFhLGlCQUFiO1lBQXVCLGVBQXZCO1lBQStCLGtCQUEvQjs7O0FBRnVDLGFBS2xDLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxTQUFTLE9BQVQsRUFBa0IsS0FBSyxDQUFMLEVBQVE7QUFDMUMsZ0JBQUksT0FBTyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQVAsSUFBeUIsT0FBTyxTQUFTLENBQVQsRUFBWSxDQUFaLENBQVAsRUFBdUI7QUFBQyx5QkFBUyxDQUFULENBQUQ7YUFBcEQ7QUFDQSxnQkFBSSxVQUFVLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBVixJQUE0QixVQUFVLFNBQVMsQ0FBVCxFQUFZLENBQVosQ0FBVixFQUEwQjtBQUFDLDRCQUFZLENBQVosQ0FBRDthQUExRDtTQUZKOzs7QUFMdUMsYUFXbEMsSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFNBQVMsVUFBVCxFQUFxQixLQUFLLENBQUwsRUFBUTtBQUM3QyxnQkFBSSxRQUFRLFlBQVksQ0FBWixFQUFlLENBQWYsQ0FBUixJQUE2QixRQUFRLFlBQVksQ0FBWixFQUFlLENBQWYsQ0FBUixFQUEyQjtBQUFDLDBCQUFVLENBQVYsQ0FBRDthQUE1RDtBQUNBLGdCQUFJLFNBQVMsWUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFULElBQThCLFNBQVMsWUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFULEVBQTRCO0FBQUMsMkJBQVcsQ0FBWCxDQUFEO2FBQTlEO1NBRko7O0FBS0EsZUFBTyxFQUFDLGdCQUFELEVBQVUsa0JBQVYsRUFBb0IsY0FBcEIsRUFBNEIsb0JBQTVCLEVBQVAsQ0FoQnVDO0tBQWhCOzs7Ozs7Ozs7O0FBeklULFFBb0tkLGtCQUFrQixTQUFsQixlQUFrQixDQUFVLElBQVYsRUFBZ0I7WUFDN0IsTUFBNEIsS0FBNUIsSUFENkI7WUFDeEIsUUFBdUIsS0FBdkIsTUFEd0I7WUFDakIsU0FBZ0IsS0FBaEIsT0FEaUI7WUFDVCxPQUFRLEtBQVIsS0FEUzs7b0NBRVcscUJBQXFCLElBQXJCLEVBRlg7O1lBRTdCLHdDQUY2QjtZQUVwQiwwQ0FGb0I7WUFFVixzQ0FGVTtZQUVGLDRDQUZFOzs7QUFJbEMsWUFBSSxlQUFKLENBSmtDO0FBS2xDLFlBQUksb0JBQUosQ0FMa0M7QUFNbEMsWUFBSSxxQkFBSjs7QUFOa0MsWUFROUIsWUFBWSxTQUFaLElBQXlCLGFBQWEsU0FBYixFQUF3QjtBQUNqRCwwQkFBYyxLQUFLLEdBQUwsQ0FBUyxPQUFPLFlBQVksT0FBWixFQUFxQixDQUFyQixDQUFQLENBQXZCLENBRGlEO0FBRWpELDJCQUFlLEtBQUssR0FBTCxDQUFTLFFBQVEsWUFBWSxRQUFaLEVBQXNCLENBQXRCLENBQVIsR0FBbUMsU0FBUyxPQUFULENBQTNELENBRmlEO0FBR2pELGdCQUFJLGVBQWUsWUFBZixFQUE2QjtBQUFDLHlCQUFTLE9BQVQsQ0FBRDthQUFqQyxNQUNLO0FBQUMseUJBQVMsVUFBVSxDQUFWLENBQVY7YUFETDtTQUhKOztBQU9BLFlBQUksWUFBSixDQWZrQztBQWdCbEMsWUFBSSxtQkFBSixDQWhCa0M7QUFpQmxDLFlBQUksc0JBQUo7O0FBakJrQyxZQW1COUIsV0FBVyxTQUFYLElBQXdCLGNBQWMsU0FBZCxFQUF5QjtBQUNqRCx5QkFBYSxLQUFLLEdBQUwsQ0FBUyxNQUFNLFNBQVMsTUFBVCxFQUFpQixDQUFqQixDQUFOLENBQXRCLENBRGlEO0FBRWpELDRCQUFnQixLQUFLLEdBQUwsQ0FBUyxTQUFTLFNBQVMsU0FBVCxFQUFvQixDQUFwQixDQUFULEdBQWtDLFNBQVMsT0FBVCxDQUEzRCxDQUZpRDtBQUdqRCxnQkFBSSxjQUFjLGFBQWQsRUFBNkI7QUFBQyxzQkFBTSxNQUFOLENBQUQ7YUFBakMsTUFDSztBQUFDLHNCQUFNLFNBQVMsQ0FBVCxDQUFQO2FBREw7U0FISjs7QUFPQSxlQUFPLEVBQUMsUUFBRCxFQUFNLGNBQU4sRUFBUCxDQTFCa0M7S0FBaEIsQ0FwS0o7O0FBaU1sQixXQUFPLE9BQU8sTUFBUCxDQUFjO0FBQ2pCLHNDQURpQjtBQUVqQixrQ0FGaUI7QUFHakIsc0NBSGlCO0FBSWpCLGtDQUppQjtBQUtqQixrREFMaUI7QUFNakIsZ0RBTmlCO0FBT2pCLHNEQVBpQjtBQVFqQixzREFSaUI7QUFTakIsOENBVGlCO0FBVWpCLGdEQVZpQjtBQVdqQixrREFYaUI7QUFZakIsMENBWmlCO0FBYWpCLHdDQWJpQjtLQUFkLENBQVAsQ0FqTWtCO0NBQXRCOzs7Ozs7OztrQkNIZTs7O0FBRWYsU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCO1FBQ2QsV0FBNEIsS0FBNUIsU0FEYztRQUNKLFdBQWtCLEtBQWxCLFNBREk7UUFDTSxPQUFRLEtBQVIsS0FETjs7O0FBR25CLFFBQUksaUJBQUo7UUFBYyxrQkFBZDtRQUF5QixvQkFBekI7UUFBc0MsbUJBQXRDO1FBQWtELHFCQUFsRDtRQUFnRSxzQkFBaEU7UUFBK0UsZUFBL0U7UUFBdUYsZUFBdkY7UUFBK0YsZ0JBQS9GO1FBQXdHLGdCQUF4RztRQUFpSCxrQkFBakg7UUFDQSxTQUFTLENBQVQ7UUFDQSxTQUFTLENBQVQ7UUFDQSxhQUFhLENBQWI7UUFDQSxhQUFhLENBQWI7UUFDQSxRQUFRLENBQVI7UUFDQSxRQUFRLENBQVI7UUFDQSxXQUFXLEVBQVg7UUFDQSxZQUFZLEVBQVo7Ozs7OztBQVhtQixRQWlCZixjQUFjLFNBQWQsV0FBYyxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCO0FBQ2hDLG9CQUFZLEVBQUUsTUFBRixDQUFTLFNBQVQ7OztBQURvQixXQUloQyxDQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLE1BQW5CLEdBQTRCLElBQTVCLENBSmdDO0FBS2hDLFlBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsVUFBbkIsR0FBZ0MsRUFBaEMsQ0FMZ0M7QUFNaEMsaUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsSUFBakMsR0FBd0MsSUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixJQUFuQixDQU5SO0FBT2hDLGlCQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLEdBQWpDLEdBQXVDLElBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FQUDtBQVFoQyxpQkFBUyxpQkFBVCxDQUEyQixLQUEzQixDQUFpQyxLQUFqQyxHQUF5QyxJQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLEtBQW5CLENBUlQ7QUFTaEMsaUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsTUFBakMsR0FBMEMsSUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixNQUFuQixDQVRWO0FBVWhDLGlCQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLE9BQWpDLEdBQTJDLEVBQTNDOzs7QUFWZ0MsZ0JBYWhDLEdBQVcsU0FBUyxjQUFULEVBQVgsQ0FiZ0M7QUFjaEMsb0JBQVksU0FBUyxZQUFULEVBQVosQ0FkZ0M7QUFlaEMscUJBQWEsRUFBRSxLQUFGLENBZm1CO0FBZ0JoQyxxQkFBYSxFQUFFLEtBQUYsQ0FoQm1CO0FBaUJoQyxzQkFBYyxTQUFTLElBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsSUFBbkIsRUFBeUIsRUFBbEMsQ0FBZCxDQWpCZ0M7QUFrQmhDLHFCQUFhLFNBQVMsSUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixHQUFuQixFQUF3QixFQUFqQyxDQUFiLENBbEJnQztBQW1CaEMsdUJBQWUsSUFBSSxRQUFKLENBQWEsV0FBYixDQW5CaUI7QUFvQmhDLHdCQUFnQixJQUFJLFFBQUosQ0FBYSxZQUFiLENBcEJnQjs7QUFzQmhDLGFBQUssV0FBTCxDQUFpQixHQUFqQixFQXRCZ0M7O0FBd0JoQyxZQUFJLFNBQVMsU0FBVCxDQUFtQixXQUFuQixFQUFnQztBQUFDLHFCQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBRDtTQUFwQztBQXhCZ0MsS0FBbEI7Ozs7Ozs7QUFqQkMsUUFpRGYsU0FBUyxTQUFULE1BQVMsQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQjtBQUMzQiw4QkFBc0IsR0FBdEIsRUFBMkIsQ0FBM0IsRUFEMkI7QUFFM0IsYUFBSyxRQUFMLENBQWMsR0FBZCxFQUYyQjs7QUFJM0IsWUFBSSxTQUFTLFdBQVQsRUFBc0I7Ozt3Q0FFdUIsU0FDekMsb0JBRHlDLENBQ3BCO0FBQ2pCLHNCQUFNLElBQUksUUFBSixDQUFhLFVBQWI7QUFDTix1QkFBTyxJQUFJLFFBQUosQ0FBYSxVQUFiLEdBQTBCLElBQUksUUFBSixDQUFhLFdBQWI7QUFDakMscUJBQUssSUFBSSxRQUFKLENBQWEsU0FBYjtBQUNMLHdCQUFRLElBQUksUUFBSixDQUFhLFNBQWIsR0FBeUIsSUFBSSxRQUFKLENBQWEsWUFBYjthQUxJLEVBRnZCOztnQkFFakIsd0NBRmlCO2dCQUVSLDBDQUZRO2dCQUVFLHNDQUZGO2dCQUVVLDRDQUZWOztBQVN0Qix1QkFBVyxFQUFDLEtBQUssTUFBTCxFQUFhLFFBQVEsT0FBUixFQUFpQixTQUFTLFlBQVksTUFBWixHQUFxQixDQUFyQixFQUF3QixZQUFZLFdBQVcsT0FBWCxHQUFxQixDQUFyQixFQUF2RixDQVRzQjs7QUFXdEIsc0JBQVUsR0FBVixFQUFlLENBQWYsRUFYc0I7U0FBMUI7O0FBY0EsWUFBSSxTQUFTLFNBQVQsQ0FBbUIsUUFBbkIsRUFBNkI7QUFBQyxxQkFBUyxTQUFULENBQW1CLFFBQW5CLEdBQUQ7U0FBakM7QUFsQjJCLEtBQWxCOzs7Ozs7O0FBakRNLFFBMkVmLFlBQVksU0FBWixTQUFZLENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0I7QUFDOUIsWUFBSSxDQUFDLFNBQVMsV0FBVCxFQUFzQjt5Q0FDc0IsU0FDekMsb0JBRHlDLENBQ3BCO0FBQ2pCLHNCQUFNLElBQUksUUFBSixDQUFhLFVBQWI7QUFDTix1QkFBTyxJQUFJLFFBQUosQ0FBYSxVQUFiLEdBQTBCLElBQUksUUFBSixDQUFhLFdBQWI7QUFDakMscUJBQUssSUFBSSxRQUFKLENBQWEsU0FBYjtBQUNMLHdCQUFRLElBQUksUUFBSixDQUFhLFNBQWIsR0FBeUIsSUFBSSxRQUFKLENBQWEsWUFBYjtBQUNqQyx5QkFBUyxLQUFLLFVBQUwsRUFBVDtBQUNBLDRCQUFZLEtBQUssYUFBTCxFQUFaO2FBUHFDLEVBRHRCOztnQkFDbEIseUNBRGtCO2dCQUNULDJDQURTO2dCQUNDLHVDQUREO2dCQUNTLDZDQURUOztBQVV2Qix1QkFBVyxFQUFDLEtBQUssTUFBTCxFQUFhLFFBQVEsT0FBUixFQUFpQixTQUFTLFlBQVksTUFBWixHQUFxQixDQUFyQixFQUF3QixZQUFZLFdBQVcsT0FBWCxHQUFxQixDQUFyQixFQUF2RixDQVZ1QjtBQVd2QixzQkFBVSxHQUFWLEVBQWUsQ0FBZixFQVh1QjtTQUEzQjs7O0FBRDhCLFdBZ0I5QixDQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLFVBQW5CLEdBQWdDLFNBQVMsVUFBVCxDQWhCRjtBQWlCOUIsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixJQUFuQixHQUEwQixTQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLElBQWpDLENBakJJO0FBa0I5QixZQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLEdBQW5CLEdBQXlCLFNBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsR0FBakMsQ0FsQks7QUFtQjlCLFlBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsS0FBbkIsR0FBMkIsU0FBUyxpQkFBVCxDQUEyQixLQUEzQixDQUFpQyxLQUFqQyxDQW5CRztBQW9COUIsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixNQUFuQixHQUE0QixTQUFTLGlCQUFULENBQTJCLEtBQTNCLENBQWlDLE1BQWpDOzs7QUFwQkUsa0JBdUI5QixDQUFXLFlBQVk7QUFDbkIsZ0JBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsTUFBbkIsR0FBNEIsSUFBNUIsQ0FEbUI7QUFFbkIscUJBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsQ0FBaUMsT0FBakMsR0FBMkMsRUFBM0MsQ0FGbUI7QUFHbkIsaUJBQUssU0FBTCxHQUhtQjtTQUFaLEVBSVIsU0FBUyxZQUFULENBSkgsQ0F2QjhCOztBQTZCOUIsWUFBSSxTQUFTLFNBQVQsQ0FBbUIsU0FBbkIsRUFBOEI7QUFBQyxxQkFBUyxTQUFULENBQW1CLFNBQW5CLEdBQUQ7U0FBbEM7QUE3QjhCLEtBQWxCOzs7Ozs7O0FBM0VHLFFBZ0hmLFlBQVksU0FBWixTQUFZLENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0I7QUFDOUIsWUFBSSxTQUFTLEdBQVQsS0FBaUIsVUFBVSxHQUFWLElBQ2pCLFNBQVMsTUFBVCxLQUFvQixVQUFVLE1BQVYsSUFDcEIsU0FBUyxPQUFULEtBQXFCLFVBQVUsT0FBVixJQUNyQixTQUFTLFVBQVQsS0FBd0IsVUFBVSxVQUFWLEVBQXVCOztBQUUvQyxnQkFBSSxTQUFTLEtBQUssU0FBTCxDQUFlLEdBQWYsRUFBb0IsUUFBcEIsRUFBOEIsR0FBOUIsQ0FBVDs7O0FBRjJDLGdCQUszQyxNQUFKLEVBQVk7QUFDUix5QkFBUyxzQkFBVCxDQUFnQyxTQUFTLGlCQUFULEVBQTRCLFNBQVMsTUFBVCxDQUE1RCxDQURRO0FBRVIseUJBQVMsc0JBQVQsQ0FBZ0MsU0FBUyxpQkFBVCxFQUE0QixTQUFTLEdBQVQsQ0FBNUQsQ0FGUTtBQUdSLHlCQUFTLGtCQUFULENBQTRCLFNBQVMsaUJBQVQsRUFBNEIsU0FBUyxVQUFULENBQXhELENBSFE7QUFJUix5QkFBUyxtQkFBVCxDQUE2QixTQUFTLGlCQUFULEVBQTRCLFNBQVMsT0FBVCxDQUF6RCxDQUpRO2FBQVo7U0FSSjs7O0FBRDhCLGlCQWtCOUIsQ0FBVSxHQUFWLEdBQWdCLFNBQVMsR0FBVCxDQWxCYztBQW1COUIsa0JBQVUsTUFBVixHQUFtQixTQUFTLE1BQVQsQ0FuQlc7QUFvQjlCLGtCQUFVLE9BQVYsR0FBb0IsU0FBUyxPQUFULENBcEJVO0FBcUI5QixrQkFBVSxVQUFWLEdBQXVCLFNBQVMsVUFBVCxDQXJCTzs7QUF1QjlCLFlBQUksU0FBUyxTQUFULENBQW1CLFFBQW5CLEVBQTZCO0FBQUMscUJBQVMsU0FBVCxDQUFtQixRQUFuQixHQUFEO1NBQWpDO0FBdkI4QixLQUFsQjs7Ozs7OztBQWhIRyxRQStJZix3QkFBd0IsU0FBeEIscUJBQXdCLENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0I7O0FBRTFDLGlCQUFTLEVBQUUsS0FBRixDQUZpQztBQUcxQyxpQkFBUyxFQUFFLEtBQUY7OztBQUhpQyxZQU10QyxRQUFRLFNBQVMsVUFBVCxHQUFzQixLQUF0QixDQU44QjtBQU8xQyxZQUFJLFFBQVEsU0FBUyxVQUFULEdBQXNCLEtBQXRCLENBUDhCO0FBUTFDLGdCQUFRLFFBQVEsQ0FBUjs7O0FBUmtDLGtCQVcxQyxHQUFhLE1BQWIsQ0FYMEM7QUFZMUMscUJBQWEsTUFBYixDQVowQzs7QUFjMUMsWUFBSSxLQUFLLEtBQUwsQ0Fkc0M7QUFlMUMsWUFBSSxLQUFLLEtBQUwsQ0Fmc0M7O0FBaUIxQyxpQkFBUyxTQUFTLE9BQVQsQ0FqQmlDO0FBa0IxQyxpQkFBUyxTQUFTLFFBQVQsQ0FBa0IsWUFBbEIsR0FBaUMsU0FBUyxPQUFULENBbEJBO0FBbUIxQyxrQkFBVSxTQUFTLE9BQVQsQ0FuQmdDO0FBb0IxQyxrQkFBVSxTQUFTLFFBQVQsQ0FBa0IsV0FBbEIsR0FBZ0MsU0FBUyxPQUFULENBcEJBOztBQXNCMUMsWUFBSSxVQUFVLE9BQVYsQ0FBa0IsOEJBQWxCLElBQW9ELENBQUMsQ0FBRCxJQUNwRCxVQUFVLE9BQVYsQ0FBa0IsK0JBQWxCLElBQXFELENBQUMsQ0FBRCxJQUNyRCxVQUFVLE9BQVYsQ0FBa0IsK0JBQWxCLElBQXFELENBQUMsQ0FBRCxFQUFJO0FBQ3pELGdCQUFJLGVBQWUsRUFBZixHQUFvQixRQUFwQixFQUE4QjtBQUM5Qix3QkFBUSxlQUFlLFFBQWYsQ0FEc0I7QUFFOUIsd0JBQVEsS0FBSyxLQUFMLENBRnNCO2FBQWxDLE1BR08sSUFBSSxjQUFjLEVBQWQsR0FBbUIsT0FBbkIsRUFBNEI7QUFDbkMsd0JBQVEsVUFBVSxXQUFWLENBRDJCO0FBRW5DLHdCQUFRLEtBQUssS0FBTCxDQUYyQjthQUFoQztBQUlQLDJCQUFlLEtBQWYsQ0FSeUQ7QUFTekQsNEJBQWdCLEtBQWhCLENBVHlEO1NBRjdEOztBQWNBLFlBQUksVUFBVSxPQUFWLENBQWtCLDhCQUFsQixJQUFvRCxDQUFDLENBQUQsSUFDcEQsVUFBVSxPQUFWLENBQWtCLCtCQUFsQixJQUFxRCxDQUFDLENBQUQsSUFDckQsVUFBVSxPQUFWLENBQWtCLCtCQUFsQixJQUFxRCxDQUFDLENBQUQsRUFBSTs7QUFFekQsZ0JBQUksZUFBZSxFQUFmLEdBQW9CLFFBQXBCLEVBQThCO0FBQzlCLHdCQUFRLFdBQVcsWUFBWCxDQURzQjtBQUU5Qix3QkFBUSxLQUFLLEtBQUwsQ0FGc0I7YUFBbEMsTUFHTyxJQUFJLGNBQWMsWUFBZCxHQUE2QixFQUE3QixHQUFrQyxPQUFsQyxFQUEyQztBQUNsRCx3QkFBUSxVQUFVLFdBQVYsR0FBd0IsWUFBeEIsQ0FEMEM7QUFFbEQsd0JBQVEsS0FBSyxLQUFMLENBRjBDO2FBQS9DO0FBSVAsNEJBQWdCLEtBQWhCLENBVHlEO1NBRjdEOztBQWNBLFlBQUksVUFBVSxPQUFWLENBQWtCLDhCQUFsQixJQUFvRCxDQUFDLENBQUQsSUFDcEQsVUFBVSxPQUFWLENBQWtCLCtCQUFsQixJQUFxRCxDQUFDLENBQUQsSUFDckQsVUFBVSxPQUFWLENBQWtCLCtCQUFsQixJQUFxRCxDQUFDLENBQUQsRUFBSTtBQUN6RCxnQkFBSSxnQkFBZ0IsRUFBaEIsR0FBcUIsU0FBckIsRUFBZ0M7QUFDaEMsd0JBQVEsZ0JBQWdCLFNBQWhCLENBRHdCO0FBRWhDLHdCQUFRLEtBQUssS0FBTCxDQUZ3QjthQUFwQyxNQUdPLElBQUksYUFBYSxFQUFiLEdBQWtCLE1BQWxCLEVBQTBCO0FBQ2pDLHdCQUFRLFNBQVMsVUFBVCxDQUR5QjtBQUVqQyx3QkFBUSxLQUFLLEtBQUwsQ0FGeUI7YUFBOUI7QUFJUCwwQkFBYyxLQUFkLENBUnlEO0FBU3pELDZCQUFpQixLQUFqQixDQVR5RDtTQUY3RDs7QUFjQSxZQUFJLFVBQVUsT0FBVixDQUFrQiw4QkFBbEIsSUFBb0QsQ0FBQyxDQUFELElBQ3BELFVBQVUsT0FBVixDQUFrQiwrQkFBbEIsSUFBcUQsQ0FBQyxDQUFELElBQ3JELFVBQVUsT0FBVixDQUFrQiwrQkFBbEIsSUFBcUQsQ0FBQyxDQUFELEVBQUk7QUFDekQsZ0JBQUksZ0JBQWdCLEVBQWhCLEdBQXFCLFNBQXJCLEVBQWdDO0FBQ2hDLHdCQUFRLFlBQVksYUFBWixDQUR3QjtBQUVoQyx3QkFBUSxLQUFLLEtBQUwsQ0FGd0I7YUFBcEMsTUFHTyxJQUFJLGFBQWEsYUFBYixHQUE2QixFQUE3QixHQUFrQyxNQUFsQyxFQUEwQztBQUNqRCx3QkFBUSxTQUFTLFVBQVQsR0FBc0IsYUFBdEIsQ0FEeUM7QUFFakQsd0JBQVEsS0FBSyxLQUFMLENBRnlDO2FBQTlDO0FBSVAsNkJBQWlCLEtBQWpCLENBUnlEO1NBRjdEOztBQWFBLFlBQUksUUFBSixDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsR0FBeUIsYUFBYSxJQUFiLENBN0VpQjtBQThFMUMsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixJQUFuQixHQUEwQixjQUFjLElBQWQsQ0E5RWdCO0FBK0UxQyxZQUFJLFFBQUosQ0FBYSxLQUFiLENBQW1CLEtBQW5CLEdBQTJCLGVBQWUsSUFBZixDQS9FZTtBQWdGMUMsWUFBSSxRQUFKLENBQWEsS0FBYixDQUFtQixNQUFuQixHQUE0QixnQkFBZ0IsSUFBaEI7OztBQWhGYyxZQW1GdEMsRUFBRSxLQUFGLEdBQVUsU0FBUyxJQUFULENBQWMsU0FBZCxHQUEwQixTQUFTLGlCQUFULEVBQTRCO0FBQ2hFLHFCQUFTLElBQVQsQ0FBYyxTQUFkLEdBQTBCLFNBQVMsSUFBVCxDQUFjLFNBQWQsR0FBMEIsU0FBUyxXQUFULENBRFk7U0FBcEUsTUFFTyxJQUFJLE9BQU8sV0FBUCxJQUFzQixFQUFFLEtBQUYsR0FBVSxTQUFTLElBQVQsQ0FBYyxTQUFkLENBQWhDLEdBQTJELFNBQVMsaUJBQVQsRUFBNEI7QUFDOUYscUJBQVMsSUFBVCxDQUFjLFNBQWQsR0FBMEIsU0FBUyxJQUFULENBQWMsU0FBZCxHQUEwQixTQUFTLFdBQVQsQ0FEMEM7U0FBM0Y7OztBQXJGbUMsWUEwRnRDLEVBQUUsS0FBRixHQUFVLFNBQVMsSUFBVCxDQUFjLFVBQWQsR0FBMkIsU0FBUyxpQkFBVCxFQUE0QjtBQUNqRSxxQkFBUyxJQUFULENBQWMsVUFBZCxHQUEyQixTQUFTLElBQVQsQ0FBYyxVQUFkLEdBQTJCLFNBQVMsV0FBVCxDQURXO1NBQXJFLE1BRU8sSUFBSSxPQUFPLFVBQVAsSUFBcUIsRUFBRSxLQUFGLEdBQVUsU0FBUyxJQUFULENBQWMsVUFBZCxDQUEvQixHQUEyRCxTQUFTLGlCQUFULEVBQTRCO0FBQzlGLHFCQUFTLElBQVQsQ0FBYyxVQUFkLEdBQTJCLFNBQVMsSUFBVCxDQUFjLFVBQWQsR0FBMkIsU0FBUyxXQUFULENBRHdDO1NBQTNGO0tBNUZpQixDQS9JVDs7QUFnUG5CLFdBQU8sT0FBTyxNQUFQLENBQWM7QUFDakIsZ0NBRGlCO0FBRWpCLHNCQUZpQjtBQUdqQiw0QkFIaUI7S0FBZCxDQUFQLENBaFBtQjtDQUF2Qjs7Ozs7O0FDREEsT0FBTyxnQkFBUCxHQUEwQixZQUFXO0FBQ2pDLFdBQVEsT0FBTyxxQkFBUCxJQUNKLE9BQU8sMkJBQVAsSUFDQSxPQUFPLHdCQUFQLElBQ0EsVUFBVSxFQUFWLEVBQWE7QUFDVCxhQUFLLE1BQU0sWUFBWSxFQUFaLENBREY7QUFFVCxlQUFPLFVBQVAsQ0FBa0IsRUFBbEIsRUFBc0IsT0FBTyxFQUFQLENBQXRCLENBRlM7S0FBYixDQUo2QjtDQUFWLEVBQTNCOzs7Ozs7OztRQ09nQjtRQWtCQTtRQWlCQTtRQWdDQTtRQXdCQTtRQWtCQTtRQWVBO1FBVUE7Ozs7Ozs7OztBQXRJVCxTQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0IsR0FBeEIsRUFBNkIsR0FBN0IsRUFBa0M7QUFDckMsUUFBSSxTQUFTLENBQVQsQ0FEaUM7QUFFckMsU0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLE1BQU0sSUFBSSxNQUFKLEVBQVksSUFBSSxHQUFKLEVBQVMsR0FBM0MsRUFBZ0Q7QUFDNUMsWUFBSSxJQUFJLENBQUosRUFBTyxHQUFQLElBQWMsSUFBSSxDQUFKLEVBQU8sR0FBUCxDQUFkLElBQTZCLE1BQTdCLEVBQXFDO0FBQ3JDLHFCQUFTLElBQUksQ0FBSixFQUFPLEdBQVAsSUFBYyxJQUFJLENBQUosRUFBTyxHQUFQLENBQWQsQ0FENEI7U0FBekM7S0FESjs7QUFNQSxXQUFPLE1BQVAsQ0FScUM7Q0FBbEM7Ozs7Ozs7OztBQWtCQSxTQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsSUFBN0IsRUFBbUMsSUFBbkMsRUFBeUM7QUFDNUMsUUFBSSxZQUFKLENBRDRDO0FBRTVDLFFBQUksTUFBTSxFQUFOLENBRndDOztBQUk1QyxXQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLENBQTBCLFVBQVUsQ0FBVixFQUFhO0FBQ25DLHNCQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFBMkIsS0FBSyxDQUFMLENBQTNCLEVBQW9DLEdBQXBDLEVBRG1DO0tBQWIsQ0FBMUIsQ0FKNEM7O0FBUTVDLFdBQU8sR0FBUCxDQVI0QztDQUF6Qzs7Ozs7Ozs7QUFpQkEsU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCLElBQTlCLEVBQW9DLENBQXBDLEVBQXVDLEdBQXZDLEVBQTRDO0FBQy9DLFFBQUksTUFBTSxJQUFJLE1BQUosQ0FEcUM7O0FBRy9DLFFBQUksUUFBUSxDQUFSLEVBQVc7QUFDWCxZQUFJLElBQUosQ0FBUyxDQUFULEVBRFc7S0FBZixNQUVPOzs7QUFHSCxhQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxHQUFKLEVBQVMsS0FBSyxDQUFMLEVBQVE7QUFDN0IsZ0JBQUksVUFBVSxNQUFWLEVBQWtCO0FBQ2xCLG9CQUFJLEVBQUUsR0FBRixHQUFRLElBQUksQ0FBSixFQUFPLEdBQVAsRUFBWTtBQUNwQix3QkFBSSxNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFEb0I7QUFFcEIsMEJBRm9CO2lCQUF4QjthQURKLE1BS087QUFDSCxvQkFBSSxFQUFFLEdBQUYsR0FBUSxJQUFJLENBQUosRUFBTyxHQUFQLEVBQVk7QUFDcEIsd0JBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCLEVBRG9CO0FBRXBCLDBCQUZvQjtpQkFBeEI7YUFOSjtTQURKOzs7QUFIRyxZQWtCQyxRQUFRLElBQUksTUFBSixFQUFZO0FBQUMsZ0JBQUksSUFBSixDQUFTLENBQVQsRUFBRDtTQUF4QjtLQXBCSjtDQUhHOzs7Ozs7O0FBZ0NBLFNBQVMsYUFBVCxDQUF1QixDQUF2QixFQUEwQixJQUExQixFQUFnQztBQUNuQyxRQUFJLEVBQUUsTUFBRixHQUFXLENBQVgsRUFBYztBQUNkLGVBRGM7S0FBbEI7O0FBSUEsUUFBSSxJQUFJLEVBQUUsTUFBRixDQUwyQjtBQU1uQyxRQUFJLElBQUosQ0FObUM7QUFPbkMsUUFBSSxDQUFKLENBUG1DO0FBUW5DLFdBQU8sR0FBUCxFQUFZO0FBQ1IsWUFBSSxDQUFKLENBRFE7QUFFUixlQUFPLElBQUksQ0FBSixJQUFTLEVBQUUsSUFBSSxDQUFKLENBQUYsQ0FBUyxJQUFULElBQWlCLEVBQUUsQ0FBRixFQUFLLElBQUwsQ0FBakIsRUFBNkI7QUFDekMsbUJBQU8sRUFBRSxDQUFGLENBQVAsQ0FEeUM7QUFFekMsY0FBRSxDQUFGLElBQU8sRUFBRSxJQUFJLENBQUosQ0FBVCxDQUZ5QztBQUd6QyxjQUFFLElBQUksQ0FBSixDQUFGLEdBQVcsSUFBWCxDQUh5QztBQUl6QyxpQkFBSyxDQUFMLENBSnlDO1NBQTdDO0tBRko7Q0FSRzs7Ozs7OztBQXdCQSxTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDOUIsUUFBSSxTQUFTLENBQVQ7UUFDQSxZQURKLENBRDhCO0FBRzlCLFNBQUssR0FBTCxJQUFZLEdBQVosRUFBaUI7QUFDYixZQUFJLElBQUksY0FBSixDQUFtQixHQUFuQixDQUFKLEVBQTZCO0FBQ3pCLHNCQUFVLENBQVYsQ0FEeUI7U0FBN0I7S0FESjtBQUtBLFdBQU8sTUFBUCxDQVI4QjtDQUEzQjs7Ozs7Ozs7O0FBa0JBLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixJQUEzQixFQUFpQyxXQUFqQyxFQUE4QztBQUNqRCxRQUFJLFlBQVksSUFBWixJQUFvQixPQUFPLE9BQVAsS0FBb0IsV0FBcEIsRUFBaUMsT0FBekQ7QUFDQSxRQUFJLFFBQVEsZ0JBQVIsRUFBMEI7QUFDMUIsZ0JBQVEsZ0JBQVIsQ0FBMEIsSUFBMUIsRUFBZ0MsV0FBaEMsRUFBNkMsS0FBN0MsRUFEMEI7S0FBOUIsTUFFTyxJQUFJLFFBQVEsV0FBUixFQUFxQjtBQUM1QixnQkFBUSxXQUFSLENBQXFCLE9BQU8sSUFBUCxFQUFhLFdBQWxDLEVBRDRCO0tBQXpCLE1BRUE7QUFDSCxnQkFBUSxPQUFPLElBQVAsQ0FBUixHQUF1QixXQUF2QixDQURHO0tBRkE7Q0FKSjs7Ozs7O0FBZUEsU0FBUyxXQUFULENBQXFCLE9BQXJCLEVBQThCO0FBQ2pDLFdBQU8sUUFBUSxVQUFSLEVBQW9CO0FBQUMsZ0JBQVEsV0FBUixDQUFvQixRQUFRLFVBQVIsQ0FBcEIsQ0FBRDtLQUEzQjtDQURHOzs7Ozs7OztBQVVBLFNBQVMsVUFBVCxDQUFvQixJQUFwQixFQUEwQixTQUExQixFQUFxQztBQUN4QyxXQUFPLEtBQUssUUFBTCxLQUFrQixDQUFsQixJQUF1QixTQUFTLFNBQVMsSUFBVCxFQUFlO0FBQ2xELFlBQUksS0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixTQUF0QixJQUFtQyxDQUFDLENBQUQsRUFBSTtBQUFDLG1CQUFPLElBQVAsQ0FBRDtTQUEzQztBQUNBLGVBQU8sS0FBSyxVQUFMLENBRjJDO0tBQXREO0FBSUEsV0FBTyxLQUFQLENBTHdDO0NBQXJDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjc3MgPSBcImJvZHksXFxuaHRtbCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGZvbnQtc2l6ZTogMS4yNWVtO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtZmFtaWx5OiBhcmlhbDtcXG4gIGNvbG9yOiAjNDQ0NDQ0O1xcbn1cXG4uZGFzaGdyaWRDb250YWluZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgLyp0b3A6IDElOyovXFxuICAvKm1hcmdpbjogMCBhdXRvOyovXFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIC8qaGVpZ2h0OiA4MDBweDsqL1xcbiAgLypoZWlnaHQ6IDgwMHB4OyovXFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuLmdyaWQsXFxuLmdyaWQtYm94LFxcbi5ncmlkLXNoYWRvdy1ib3gge1xcbiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuLmRhc2hncmlkIHtcXG4gIGJhY2tncm91bmQ6ICNGOUY5Rjk7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuLmRhc2hncmlkQm94IHtcXG4gIGJhY2tncm91bmQ6ICNFMUUxRTE7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDIwJTtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogODAlO1xcbn1cXG4uZGFzaGdyaWQtYm94IHtcXG4gIGJhY2tncm91bmQ6IHJlZDtcXG59XFxuLmRhc2hncmlkLXNoYWRvdy1ib3gge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI0U4RThFODtcXG4gIG9wYWNpdHk6IDAuNTtcXG59XFxuLyoqXFxuICogR1JJRCBEUkFXIEhFTFBFUlMuXFxuICovXFxuLmRhc2hncmlkLWhvcml6b250YWwtbGluZSxcXG4uZGFzaGdyaWQtdmVydGljYWwtbGluZSB7XFxuICBiYWNrZ3JvdW5kOiAjRkZGRkZGO1xcbn1cXG4uZGFzaGdyaWQtY2VudHJvaWQge1xcbiAgYmFja2dyb3VuZDogIzAwMDAwMDtcXG4gIHdpZHRoOiA1cHg7XFxuICBoZWlnaHQ6IDVweDtcXG59XFxuXCI7IChyZXF1aXJlKFwiYnJvd3NlcmlmeS1jc3NcIikuY3JlYXRlU3R5bGUoY3NzLCB7IFwiaHJlZlwiOiBcImRlbW8vZGVtby5jc3NcIn0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiaW1wb3J0IGRhc2hHcmlkR2xvYmFsIGZyb20gJy4uL3NyYy9kYXNoZ3JpZC5qcyc7XG5pbXBvcnQgJy4vZGVtby5jc3MnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgbWFpbigpO1xufSk7XG5cbmZ1bmN0aW9uIGZpbGxDZWxscyhudW1Sb3dzLCBudW1Db2x1bW5zKSB7XG4gICAgbGV0IGVsZW07XG4gICAgbGV0IGJveGVzQWxsID0gW107XG4gICAgbGV0IGlkID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbHVtbnM7IGogKz0gMSkge1xuICAgICAgICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSAnZHJhZ0hhbmRsZSc7XG4gICAgICAgICAgICBlbGVtLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICAgICAgZWxlbS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgICAgICBpZCArPSAxO1xuICAgICAgICAgICAgYm94ZXNBbGwucHVzaCh7cm93OiBpLCBjb2x1bW46IGosIHJvd3NwYW46IDEsIGNvbHVtbnNwYW46IDF9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBib3hlc0FsbDtcbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICBsZXQgYm94ZXM7XG4gICAgbGV0IG51bVJvd3MgPSA2O1xuICAgIGxldCBudW1Db2x1bW5zID0gNjtcblxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbS5jbGFzc05hbWUgPSAnZGFzaGdyaWRCb3gnO1xuXG4gICAgbGV0IGVsZW1Ud28gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtVHdvLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZEJveCc7XG5cbiAgICBsZXQgZWxlbVRocmVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbVRocmVlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZEJveCc7XG5cbiAgICBib3hlcyA9IFtcbiAgICAgICAge3JvdzogMCwgY29sdW1uOiAxLCByb3dzcGFuOiAyLCBjb2x1bW5zcGFuOiAyLCBjb250ZW50OiBlbGVtfSxcbiAgICAgICAge3JvdzogMiwgY29sdW1uOiAxLCByb3dzcGFuOiA0LCBjb2x1bW5zcGFuOiAyLCBjb250ZW50OiBlbGVtVHdvfSxcbiAgICAgICAgLy8ge3JvdzogMTUsIGNvbHVtbjogMywgcm93c3BhbjogMiwgY29sdW1uc3BhbjogMiwgY29udGVudDogZWxlbVRocmVlfVxuICAgIF07XG4gICAgLy8gYm94ZXMgPSBmaWxsQ2VsbHMobnVtUm93cywgbnVtQ29sdW1ucyk7XG5cbiAgICBsZXQgZ3JpZCA9IGRhc2hHcmlkR2xvYmFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkJyksIHtcbiAgICAgICAgYm94ZXM6IGJveGVzLFxuICAgICAgICBmbG9hdGluZzogdHJ1ZSxcblxuICAgICAgICB4TWFyZ2luOiAyMCxcbiAgICAgICAgeU1hcmdpbjogMjAsXG5cbiAgICAgICAgZHJhZ2dhYmxlOiB7ZW5hYmxlZDogdHJ1ZSwgaGFuZGxlOiAnZGFzaGdyaWQtYm94J30sXG5cbiAgICAgICAgcm93SGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIG1pblJvd3M6IG51bVJvd3MsXG4gICAgICAgIG1heFJvd3M6IG51bVJvd3MgKyA1LFxuXG4gICAgICAgIGNvbHVtbldpZHRoOiAnYXV0bycsXG4gICAgICAgIG1pbkNvbHVtbnM6IG51bUNvbHVtbnMsXG4gICAgICAgIG1heENvbHVtbnM6IG51bUNvbHVtbnMsXG5cbiAgICAgICAgbGl2ZUNoYW5nZXM6IHRydWVcbiAgICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGJyb3dzZXIgZmllbGQsIGNoZWNrIG91dCB0aGUgYnJvd3NlciBmaWVsZCBhdCBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svYnJvd3NlcmlmeS1oYW5kYm9vayNicm93c2VyLWZpZWxkLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBDcmVhdGUgYSA8bGluaz4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlTGluazogZnVuY3Rpb24oaHJlZiwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGUgYSA8c3R5bGU+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZVN0eWxlOiBmdW5jdGlvbihjc3NUZXh0LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoc3R5bGUuc2hlZXQpIHsgLy8gZm9yIGpzZG9tIGFuZCBJRTkrXG4gICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3NUZXh0O1xuICAgICAgICAgICAgc3R5bGUuc2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7IC8vIGZvciBJRTggYW5kIGJlbG93XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmlcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IEJveDtcblxuZnVuY3Rpb24gQm94KGNvbXApIHtcbiAgICBsZXQge2Rhc2hncmlkfSA9IGNvbXA7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgQm94IGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBib3guXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUJveCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihib3gsIGJveFNldHRpbmdzKGJveCwgZGFzaGdyaWQpKTtcbiAgICAgICAgaWYgKGJveC5jb250ZW50KSB7XG4gICAgICAgICAgICBib3guX2VsZW1lbnQuYXBwZW5kQ2hpbGQoYm94LmNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGFzaGdyaWQuX2JveGVzRWxlbWVudC5hcHBlbmRDaGlsZChib3guX2VsZW1lbnQpO1xuICAgICB9O1xuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe2NyZWF0ZUJveH0pO1xufVxuXG4vKipcbiAqIEJveCBwcm9wZXJ0aWVzIGFuZCBldmVudHMuXG4gKi9cbmZ1bmN0aW9uIGJveFNldHRpbmdzKGJveEVsZW1lbnQsIGRhc2hncmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2VsZW1lbnQ6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gnO1xuICAgICAgICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgZWwuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuICAgICAgICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IC4zcywgbGVmdCAuM3MsIHRvcCAuM3MsIHdpZHRoIC4zcywgaGVpZ2h0IC4zcyc7XG4gICAgICAgICAgICBlbC5zdHlsZS56SW5kZXggPSAxMDAzO1xuXG4gICAgICAgICAgICBjcmVhdGVCb3hSZXNpemVIYW5kbGVycyhlbCwgZGFzaGdyaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0oKSksXG5cbiAgICAgICAgcm93OiBib3hFbGVtZW50LnJvdyxcbiAgICAgICAgY29sdW1uOiBib3hFbGVtZW50LmNvbHVtbixcbiAgICAgICAgcm93c3BhbjogYm94RWxlbWVudC5yb3dzcGFuIHx8IDEsXG4gICAgICAgIGNvbHVtbnNwYW46IGJveEVsZW1lbnQuY29sdW1uc3BhbiB8fCAxLFxuICAgICAgICBkcmFnZ2FibGU6IChib3hFbGVtZW50LmRyYWdnYWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IChib3hFbGVtZW50LnJlc2l6YWJsZSA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICBwdXNoYWJsZTogKGJveEVsZW1lbnQucHVzaGFibGUgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmc6IChib3hFbGVtZW50LmZsb2F0aW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3RhY2tpbmc6IChib3hFbGVtZW50LnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChib3hFbGVtZW50LnN3YXBwaW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgaW5oZXJpdDogKGJveEVsZW1lbnQuaW5oZXJpdCA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGJveCByZXNpemUgaGFuZGxlcnMgYW5kIGFwcGVuZHMgdGhlbSB0byBib3guXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJveFJlc2l6ZUhhbmRsZXJzKGJveEVsZW1lbnQsIGRhc2hncmlkKSB7XG4gICAgbGV0IGhhbmRsZTtcblxuICAgIC8qKlxuICAgICAqIFRPUCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ24nKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbic7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICduLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCT1RUT00gSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdzJykgIT09IC0xKSB7XG4gICAgICAgIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXMnO1xuICAgICAgICBoYW5kbGUuc3R5bGUubGVmdCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuYm90dG9tID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAncy1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV0VTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ3cnKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtdyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICd3LXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGUuaW5kZXhPZignZScpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1lJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICdlLXJlc2l6ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgIGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOT1JUSC1FQVNUIEhhbmRsZXIuXG4gICAgICovXG4gICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGUuaW5kZXhPZignbmUnKSAhPT0gLTEpIHtcbiAgICAgICAgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhhbmRsZS5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbmUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUud2lkdGggPSBkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlV2lkdGggKyAncHgnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmN1cnNvciA9ICduZS1yZXNpemUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBoYW5kbGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS56SW5kZXggPSAxMDAzO1xuICAgICAgICBib3hFbGVtZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU09VVEgtRUFTVCBIYW5kbGVyLlxuICAgICAqL1xuICAgIGlmIChkYXNoZ3JpZC5yZXNpemFibGUuaGFuZGxlLmluZGV4T2YoJ3NlJykgIT09IC0xKSB7XG4gICAgICAgIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoYW5kbGUuY2xhc3NOYW1lID0gJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLXNlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnc2UtcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNPVVRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdzdycpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5ib3R0b20gPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnc3ctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5PUlRILVdFU1QgSGFuZGxlci5cbiAgICAgKi9cbiAgICBpZiAoZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZS5pbmRleE9mKCdudycpICE9PSAtMSkge1xuICAgICAgICBoYW5kbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGFuZGxlLmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1udyc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLndpZHRoID0gZGFzaGdyaWQucmVzaXphYmxlLmhhbmRsZVdpZHRoICsgJ3B4JztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmhlaWdodCA9IGRhc2hncmlkLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCArICdweCc7XG4gICAgICAgIGhhbmRsZS5zdHlsZS5jdXJzb3IgPSAnbnctcmVzaXplJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaGFuZGxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBoYW5kbGUuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgYm94RWxlbWVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCAnLi9zaGltcy5qcyc7XG5cbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZC5qcyc7XG5pbXBvcnQgQm94IGZyb20gXCIuL2JveC5qc1wiO1xuaW1wb3J0IFJlbmRlciBmcm9tICcuL3JlbmRlcmVyLmpzJztcbmltcG9ydCBNb3VzZSBmcm9tICcuL21vdXNlLmpzJztcbmltcG9ydCBEcmFnZ2VyIGZyb20gJy4vZHJhZy5qcyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL3Jlc2l6ZS5qcyc7XG5pbXBvcnQge2FkZEV2ZW50LCByZW1vdmVOb2Rlc30gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hncmlkO1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IFRoZSBkYXNoZ3JpZCBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGdzIEdyaWQgc2V0dGluZ3MuXG4gKi9cbmZ1bmN0aW9uIERhc2hncmlkKGVsZW1lbnQsIGdzKSB7XG4gICAgbGV0IGRhc2hncmlkID0gT2JqZWN0LmFzc2lnbih7fSwgZGFzaGdyaWRTZXR0aW5ncyhncywgZWxlbWVudCkpO1xuXG4gICAgbGV0IHJlbmRlcmVyID0gUmVuZGVyKHtkYXNoZ3JpZH0pO1xuICAgIGxldCBib3hIYW5kbGVyID0gQm94KHtkYXNoZ3JpZH0pO1xuICAgIGxldCBncmlkID0gR3JpZCh7ZGFzaGdyaWQsIHJlbmRlcmVyLCBib3hIYW5kbGVyfSk7XG4gICAgbGV0IGRyYWdnZXIgPSBEcmFnZ2VyKHtkYXNoZ3JpZCwgcmVuZGVyZXIsIGdyaWR9KTtcbiAgICBsZXQgcmVzaXplciA9IFJlc2l6ZXIoe2Rhc2hncmlkLCByZW5kZXJlciwgZ3JpZH0pO1xuICAgIGxldCBtb3VzZSA9IE1vdXNlKHtkcmFnZ2VyLCByZXNpemVyLCBkYXNoZ3JpZCwgZ3JpZH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZS5cbiAgICBncmlkLmluaXQoKTtcbiAgICBtb3VzZS5pbml0KCk7XG5cbiAgICAvLyBFdmVudCBsaXN0ZW5lcnMuXG4gICAgYWRkRXZlbnQod2luZG93LCAncmVzaXplJywgKCkgPT4ge1xuICAgICAgICByZW5kZXJlci5zZXRDb2x1bW5XaWR0aCgpO1xuICAgICAgICByZW5kZXJlci5zZXRSb3dIZWlnaHQoKTtcbiAgICAgICAgZ3JpZC5yZWZyZXNoR3JpZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gVXNlciBldmVudCBhZnRlciBncmlkIGlzIGRvbmUgbG9hZGluZy5cbiAgICBpZiAoZGFzaGdyaWQub25HcmlkUmVhZHkpIHtkYXNoZ3JpZC5vbkdyaWRSZWFkeSgpO30gLy8gdXNlciBldmVudC5cblxuICAgIC8vIEFQSS5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIHVwZGF0ZUJveDogZ3JpZC51cGRhdGVCb3gsXG4gICAgICAgIGluc2VydEJveDogZ3JpZC5pbnNlcnRCb3gsXG4gICAgICAgIHJlbW92ZUJveDogZ3JpZC5yZW1vdmVCb3gsXG4gICAgICAgIGdldEJveGVzOiBncmlkLmdldEJveGVzLFxuICAgICAgICByZWZyZXNoR3JpZDogZ3JpZC5yZWZyZXNoR3JpZCxcbiAgICAgICAgLy8gZGFzaGdyaWQ6IGRhc2hncmlkXG4gICAgfSk7XG59XG5cbi8qKlxuICogR3JpZCBwcm9wZXJ0aWVzIGFuZCBldmVudHMuXG4gKi9cbmZ1bmN0aW9uIGRhc2hncmlkU2V0dGluZ3MoZ3MsIGVsZW1lbnQpIHtcbiAgICBsZXQgZGFzaGdyaWQgPSB7XG4gICAgICAgIF9lbGVtZW50OiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG4gICAgICAgICAgICByZW1vdmVOb2RlcyhlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9KCkpLFxuXG4gICAgICAgIGJveGVzOiBncy5ib3hlcyB8fCBbXSxcblxuICAgICAgICByb3dIZWlnaHQ6IGdzLnJvd0hlaWdodCxcbiAgICAgICAgbnVtUm93czogKGdzLm51bVJvd3MgIT09IHVuZGVmaW5lZCkgPyBncy5udW1Sb3dzIDogNixcbiAgICAgICAgbWluUm93czogKGdzLm1pblJvd3MgIT09IHVuZGVmaW5lZCkgPyBncy5taW5Sb3dzIDogNixcbiAgICAgICAgbWF4Um93czogKGdzLm1heFJvd3MgIT09IHVuZGVmaW5lZCkgPyBncy5tYXhSb3dzIDogMTAsXG5cbiAgICAgICAgZXh0cmFSb3dzOiAwLFxuICAgICAgICBleHRyYUNvbHVtbnM6IDAsXG5cbiAgICAgICAgY29sdW1uV2lkdGg6IGdzLmNvbHVtbldpZHRoLFxuICAgICAgICBudW1Db2x1bW5zOiAoZ3MubnVtQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IGdzLm51bUNvbHVtbnMgOiA2LFxuICAgICAgICBtaW5Db2x1bW5zOiAoZ3MubWluQ29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IGdzLm1pbkNvbHVtbnMgOiA2LFxuICAgICAgICBtYXhDb2x1bW5zOiAoZ3MubWF4Q29sdW1ucyAhPT0gdW5kZWZpbmVkKSA/IGdzLm1heENvbHVtbnMgOiAxMCxcblxuICAgICAgICB4TWFyZ2luOiAoZ3MueE1hcmdpbiAhPT0gdW5kZWZpbmVkKSA/IGdzLnhNYXJnaW4gOiAyMCxcbiAgICAgICAgeU1hcmdpbjogKGdzLnlNYXJnaW4gIT09IHVuZGVmaW5lZCkgPyBncy55TWFyZ2luIDogMjAsXG5cbiAgICAgICAgZGVmYXVsdEJveFJvd3NwYW46IDIsXG4gICAgICAgIGRlZmF1bHRCb3hDb2x1bW5zcGFuOiAxLFxuXG4gICAgICAgIG1pblJvd3NwYW46IChncy5taW5Sb3dzcGFuICE9PSB1bmRlZmluZWQpID8gZ3MubWluUm93c3BhbiA6IDEsXG4gICAgICAgIG1heFJvd3NwYW46IChncy5tYXhSb3dzcGFuICE9PSB1bmRlZmluZWQpID8gZ3MubWF4Um93c3BhbiA6IDk5OTksXG5cbiAgICAgICAgbWluQ29sdW1uc3BhbjogKGdzLm1pbkNvbHVtbnNwYW4gIT09IHVuZGVmaW5lZCkgPyBncy5taW5Db2x1bW5zcGFuIDogMSxcbiAgICAgICAgbWF4Q29sdW1uc3BhbjogKGdzLm1heENvbHVtbnNwYW4gIT09IHVuZGVmaW5lZCkgPyBncy5tYXhDb2x1bW5zcGFuIDogOTk5OSxcblxuICAgICAgICBwdXNoYWJsZTogKGdzLnB1c2hhYmxlID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIGZsb2F0aW5nOiAoZ3MuZmxvYXRpbmcgPT09IHRydWUpID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBzdGFja2luZzogKGdzLnN0YWNraW5nID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgc3dhcHBpbmc6IChncy5zd2FwcGluZyA9PT0gdHJ1ZSkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGU6IChncy5hbmltYXRlID09PSB0cnVlKSA/IHRydWUgOiBmYWxzZSxcblxuICAgICAgICBsaXZlQ2hhbmdlczogKGdzLmxpdmVDaGFuZ2VzID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG5cbiAgICAgICAgLy8gRHJhZyBoYW5kbGUgY2FuIGJlIGEgY3VzdG9tIGNsYXNzbmFtZSBvciBpZiBub3Qgc2V0IHJldmVycyB0byB0aGVcbiAgICAgICAgLy8gYm94IGNvbnRhaW5lciB3aXRoIGNsYXNzbmFtZSAnZGFzaGdyaWQtYm94Jy5cbiAgICAgICAgZHJhZ2dhYmxlOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogKGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZW5hYmxlZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhhbmRsZTogKGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuaGFuZGxlKSB8fCAnZGFzaGdyaWQtYm94JyxcblxuICAgICAgICAgICAgICAgIC8vIHVzZXIgY2Incy5cbiAgICAgICAgICAgICAgICBkcmFnU3RhcnQ6IGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZHJhZ1N0YXJ0LFxuICAgICAgICAgICAgICAgIGRyYWdnaW5nOiBncy5kcmFnZ2FibGUgJiYgZ3MuZHJhZ2dhYmxlLmRyYWdnaW5nLFxuICAgICAgICAgICAgICAgIGRyYWdFbmQ6IGdzLmRyYWdnYWJsZSAmJiBncy5kcmFnZ2FibGUuZHJhZ0VuZFxuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2l6YWJsZToge1xuICAgICAgICAgICAgZW5hYmxlZDogKGdzLnJlc2l6YWJsZSAmJiBncy5yZXNpemFibGUuZW5hYmxlZCA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgaGFuZGxlOiAoZ3MucmVzaXphYmxlICYmIGdzLnJlc2l6YWJsZS5oYW5kbGUpIHx8IFsnbicsICdlJywgJ3MnLCAndycsICduZScsICdzZScsICdzdycsICdudyddLFxuICAgICAgICAgICAgaGFuZGxlV2lkdGg6IChncy5yZXNpemFibGUgJiYgIGdzLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCAhPT0gdW5kZWZpbmVkKSA/IGdzLnJlc2l6YWJsZS5oYW5kbGVXaWR0aCA6IDEwLFxuXG4gICAgICAgICAgICAvLyB1c2VyIGNiJ3MuXG4gICAgICAgICAgICByZXNpemVTdGFydDogZ3MucmVzaXphYmxlICYmIGdzLnJlc2l6YWJsZS5yZXNpemVTdGFydCxcbiAgICAgICAgICAgIHJlc2l6aW5nOiBncy5yZXNpemFibGUgJiYgZ3MucmVzaXphYmxlLnJlc2l6aW5nLFxuICAgICAgICAgICAgcmVzaXplRW5kOiBncy5yZXNpemFibGUgJiYgZ3MucmVzaXphYmxlLnJlc2l6ZUVuZFxuICAgICAgICB9LFxuXG4gICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7fSxcblxuICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAuM3MsIGxlZnQgLjNzLCB0b3AgLjNzLCB3aWR0aCAuM3MsIGhlaWdodCAuM3MnLFxuICAgICAgICBzY3JvbGxTZW5zaXRpdml0eTogMjAsXG4gICAgICAgIHNjcm9sbFNwZWVkOiAxMCxcbiAgICAgICAgc25hcEJhY2tUaW1lOiAoZ3Muc25hcEJhY2tUaW1lID09PSB1bmRlZmluZWQpID8gMzAwIDogZ3Muc25hcEJhY2tUaW1lLFxuXG4gICAgICAgIHNob3dHcmlkTGluZXM6IChncy5zaG93R3JpZExpbmVzID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgIHNob3dHcmlkQ2VudHJvaWRzOiAoZ3Muc2hvd0dyaWRDZW50cm9pZHMgPT09IGZhbHNlKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH07XG5cbiAgICBkYXNoZ3JpZC5fYm94ZXNFbGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBib3hlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGJveGVzRWxlbWVudC5jbGFzc05hbWUgPSAnZGFzaGdyaWQtYm94ZXMnO1xuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoYm94ZXNFbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiBib3hlc0VsZW1lbnQ7XG4gICAgICAgIH0oKSk7XG5cbiAgICByZXR1cm4gZGFzaGdyaWQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBEcmFnZ2VyO1xuXG5mdW5jdGlvbiBEcmFnZ2VyKGNvbXApIHtcbiAgICBsZXQge2Rhc2hncmlkLCByZW5kZXJlciwgZ3JpZH0gPSBjb21wO1xuXG4gICAgbGV0IGVYLCBlWSwgZVcsIGVILFxuICAgICAgICBtb3VzZVggPSAwLFxuICAgICAgICBtb3VzZVkgPSAwLFxuICAgICAgICBsYXN0TW91c2VYID0gMCxcbiAgICAgICAgbGFzdE1vdXNlWSA9IDAsXG4gICAgICAgIG1PZmZYID0gMCxcbiAgICAgICAgbU9mZlkgPSAwLFxuICAgICAgICBtaW5Ub3AgPSBkYXNoZ3JpZC55TWFyZ2luLFxuICAgICAgICBtaW5MZWZ0ID0gZGFzaGdyaWQueE1hcmdpbixcbiAgICAgICAgY3VyclN0YXRlID0ge30sXG4gICAgICAgIHByZXZTdGF0ZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHNoYWRvd2JveCwgcmVtb3ZlIHNtb290aCB0cmFuc2l0aW9ucyBmb3IgYm94LFxuICAgICAqIGFuZCBpbml0IG1vdXNlIHZhcmlhYmxlcy4gRmluYWxseSwgbWFrZSBjYWxsIHRvIGFwaSB0byBjaGVjayBpZixcbiAgICAgKiBhbnkgYm94IGlzIGNsb3NlIHRvIGJvdHRvbSAvIHJpZ2h0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IGRyYWdTdGFydCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDQ7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJyc7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmxlZnQgPSBib3guX2VsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUudG9wID0gYm94Ll9lbGVtZW50LnN0eWxlLnRvcDtcbiAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUud2lkdGggPSBib3guX2VsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmhlaWdodCA9IGJveC5fZWxlbWVudC5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcblxuICAgICAgICAvLyBNb3VzZSB2YWx1ZXMuXG4gICAgICAgIGxhc3RNb3VzZVggPSBlLnBhZ2VYO1xuICAgICAgICBsYXN0TW91c2VZID0gZS5wYWdlWTtcbiAgICAgICAgZVggPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgICBlWSA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5vZmZzZXRUb3AsIDEwKTtcbiAgICAgICAgZVcgPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0V2lkdGgsIDEwKTtcbiAgICAgICAgZUggPSBwYXJzZUludChib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0LCAxMCk7XG5cbiAgICAgICAgZ3JpZC51cGRhdGVTdGFydChib3gpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ1N0YXJ0KSB7ZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdTdGFydCgpO30gLy8gdXNlciBldmVudC5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgZHJhZyA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgdXBkYXRlTW92aW5nRWxlbWVudChib3gsIGUpO1xuICAgICAgICBncmlkLnVwZGF0aW5nKGJveCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICAvLyBXaGljaCBjZWxsIHRvIHNuYXAgcHJldmlldyBib3ggdG8uXG4gICAgICAgICAgICBjdXJyU3RhdGUgPSByZW5kZXJlci5nZXRDbG9zZXN0Q2VsbHMoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICB0b3A6IGJveC5fZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgYm90dG9tOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wICsgYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3ZlQm94KGJveCwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nKSB7ZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdnaW5nKCk7fSAvLyB1c2VyIGV2ZW50LlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCBkcmFnRW5kID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAoIWRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICAvLyBXaGljaCBjZWxsIHRvIHNuYXAgcHJldmlldyBib3ggdG8uXG4gICAgICAgICAgICBjdXJyU3RhdGUgPSByZW5kZXJlci5nZXRDbG9zZXN0Q2VsbHMoe1xuICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICB0b3A6IGJveC5fZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgYm90dG9tOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wICsgYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3ZlQm94KGJveCwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgYm94IHN0eWxlLlxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IGRhc2hncmlkLnRyYW5zaXRpb247XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUubGVmdDtcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcDtcblxuICAgICAgICAvLyBHaXZlIHRpbWUgZm9yIHByZXZpZXdib3ggdG8gc25hcCBiYWNrIHRvIHRpbGUuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDM7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZ3JpZC51cGRhdGVFbmQoKTtcbiAgICAgICAgfSwgZGFzaGdyaWQuc25hcEJhY2tUaW1lKTtcblxuICAgICAgICBpZiAoZGFzaGdyaWQuZHJhZ2dhYmxlLmRyYWdFbmQpIHtkYXNoZ3JpZC5kcmFnZ2FibGUuZHJhZ0VuZCgpO30gLy8gdXNlciBldmVudC5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgbW92ZUJveCA9IGZ1bmN0aW9uIChib3gsIGUpIHtcbiAgICAgICAgaWYgKGN1cnJTdGF0ZS5yb3cgIT09IHByZXZTdGF0ZS5yb3cgfHxcbiAgICAgICAgICAgIGN1cnJTdGF0ZS5jb2x1bW4gIT09IHByZXZTdGF0ZS5jb2x1bW4pIHtcblxuICAgICAgICAgICAgbGV0IHByZXZTY3JvbGxIZWlnaHQgPSBkYXNoZ3JpZC5fZWxlbWVudC5vZmZzZXRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICBsZXQgcHJldlNjcm9sbFdpZHRoID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICAgICAgbGV0IHZhbGlkTW92ZSA9IGdyaWQudXBkYXRlQm94KGJveCwgY3VyclN0YXRlLCBib3gpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGVHcmlkRGltZW5zaW9uIHByZXZpZXcgYm94LlxuICAgICAgICAgICAgaWYgKHZhbGlkTW92ZSkge1xuXG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFlQb3NpdGlvbihkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCwgY3VyclN0YXRlLnJvdyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFhQb3NpdGlvbihkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCwgY3VyclN0YXRlLmNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBsZXQgcG9zdFNjcm9sbEhlaWdodCA9IGRhc2hncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgcG9zdFNjcm9sbFdpZHRoID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICAgICAgICAgIC8vIEFjY291bnQgZm9yIG1pbmltaXppbmcgc2Nyb2xsIGhlaWdodCB3aGVuIG1vdmluZyBib3ggdXB3YXJkcy5cbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgYnVnIGhhcHBlbnMgd2hlcmUgdGhlIGRyYWdnZWQgYm94IGlzIGNoYW5nZWQgYnV0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgLy8gYWZ0ZXJ3YXJkcyB0aGUgZGFzaGdyaWQgZWxlbWVudCBkaW1lbnNpb24gaXMgY2hhbmdlZC5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0IC0gd2luZG93LnNjcm9sbFkpIDwgMzAgJiZcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFkgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIHByZXZTY3JvbGxIZWlnaHQgIT09IHBvc3RTY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgLSAxMDAgICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSB3aW5kb3cuaW5uZXJXaWR0aCAtIHdpbmRvdy5zY3JvbGxYKSA8IDMwICYmXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxYID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBwcmV2U2Nyb2xsV2lkdGggIT09IHBvc3RTY3JvbGxXaWR0aCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gYm94Ll9lbGVtZW50Lm9mZnNldExlZnQgLSAxMDAgICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBObyBwb2ludCBpbiBhdHRlbXB0aW5nIG1vdmUgaWYgbm90IHN3aXRjaGVkIHRvIG5ldyBjZWxsLlxuICAgICAgICBwcmV2U3RhdGUgPSB7cm93OiBjdXJyU3RhdGUucm93LCBjb2x1bW46IGN1cnJTdGF0ZS5jb2x1bW59O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbW92aW5nIGVsZW1lbnQsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZU1vdmluZ0VsZW1lbnQgPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGxldCBtYXhMZWZ0ID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSBkYXNoZ3JpZC54TWFyZ2luO1xuICAgICAgICBsZXQgbWF4VG9wID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZGFzaGdyaWQueU1hcmdpbjtcblxuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24uXG4gICAgICAgIG1vdXNlWCA9IGUucGFnZVg7XG4gICAgICAgIG1vdXNlWSA9IGUucGFnZVk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWx0YXNcbiAgICAgICAgbGV0IGRpZmZYID0gbW91c2VYIC0gbGFzdE1vdXNlWCArIG1PZmZYO1xuICAgICAgICBsZXQgZGlmZlkgPSBtb3VzZVkgLSBsYXN0TW91c2VZICsgbU9mZlk7XG5cbiAgICAgICAgbU9mZlggPSAwO1xuICAgICAgICBtT2ZmWSA9IDA7XG5cbiAgICAgICAgLy8gVXBkYXRlIGxhc3QgcHJvY2Vzc2VkIG1vdXNlIHBvc2l0aW9ucy5cbiAgICAgICAgbGFzdE1vdXNlWCA9IG1vdXNlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IG1vdXNlWTtcblxuICAgICAgICBsZXQgZFggPSBkaWZmWDtcbiAgICAgICAgbGV0IGRZID0gZGlmZlk7XG4gICAgICAgIGlmIChlWCArIGRYIDwgbWluTGVmdCkge1xuICAgICAgICAgICAgZGlmZlggPSBtaW5MZWZ0IC0gZVg7XG4gICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgIH0gZWxzZSBpZiAoZVggKyBlVyArIGRYID4gbWF4TGVmdCkge1xuICAgICAgICAgICAgZGlmZlggPSBtYXhMZWZ0IC0gZVggLSBlVztcbiAgICAgICAgICAgIG1PZmZYID0gZFggLSBkaWZmWDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlWSArIGRZIDwgbWluVG9wKSB7XG4gICAgICAgICAgICBkaWZmWSA9IG1pblRvcCAtIGVZO1xuICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICB9IGVsc2UgaWYgKGVZICsgZUggKyBkWSA+IG1heFRvcCkge1xuICAgICAgICAgICAgZGlmZlkgPSBtYXhUb3AgLSBlWSAtIGVIO1xuICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICB9XG4gICAgICAgIGVYICs9IGRpZmZYO1xuICAgICAgICBlWSArPSBkaWZmWTtcblxuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudG9wID0gZVkgKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGVYICsgJ3B4JztcblxuICAgICAgICAvLyBTY3JvbGxpbmcgd2hlbiBjbG9zZSB0byBib3R0b20gYm91bmRhcnkuXG4gICAgICAgIGlmIChlLnBhZ2VZIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCAtIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAtIChlLnBhZ2VZIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNjcm9sbGluZyB3aGVuIGNsb3NlIHRvIHJpZ2h0IGJvdW5kYXJ5LlxuICAgICAgICBpZiAoZS5wYWdlWCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgLSBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuaW5uZXJXaWR0aCAtIChlLnBhZ2VYIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0KSA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkYXNoZ3JpZC5zY3JvbGxTcGVlZDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGRyYWdTdGFydCxcbiAgICAgICAgZHJhZyxcbiAgICAgICAgZHJhZ0VuZFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtyZW1vdmVOb2RlcywgaW5zZXJ0aW9uU29ydCwgZ2V0TWF4TnVtfSBmcm9tICcuL3V0aWxzLmpzJztcbmV4cG9ydCBkZWZhdWx0IEdyaWQ7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXNoZ3JpZFxuICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmVyXG4gKiBAcGFyYW0ge09iamVjdH0gYm94SGFuZGxlclxuICogQHJldHVybnMge0Z1bmN0aW9ufSBpbml0IEluaXRpYWxpemUgR3JpZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gdXBkYXRlQm94IEFQSSBmb3IgdXBkYXRpbmcgYm94LCBtb3ZpbmcgLyByZXNpemluZy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gaW5zZXJ0Qm94IEluc2VydCBhIG5ldyBib3guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHJlbW92ZUJveCBSZW1vdmUgYSBib3guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGdldEJveCBSZXR1cm4gYm94IG9iamVjdCBnaXZlbiBET00gZWxlbWVudC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gdXBkYXRlU3RhcnQgV2hlbiBkcmFnIC8gcmVzaXplIHN0YXJ0cy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gdXBkYXRpbmcgRHVyaW5nIGRyYWdnaW5nIC8gcmVzaXppbmcuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHVwZGF0ZUVuZCBBZnRlciBkcmFnIC8gcmVzaXplIGVuZHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHJlbmRlckdyaWQgVXBkYXRlIGdyaWQgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gR3JpZChvYmopIHtcbiAgICBsZXQge2Rhc2hncmlkLCByZW5kZXJlciwgYm94SGFuZGxlcn0gPSBvYmo7XG5cbiAgICBsZXQgZ3JpZFZpZXcgPSBHcmlkVmlldyh7ZGFzaGdyaWQsIHJlbmRlcmVyfSk7XG4gICAgbGV0IGdyaWRFbmdpbmUgPSBHcmlkRW5naW5lKHtkYXNoZ3JpZCwgYm94SGFuZGxlcn0pO1xuXG4gICAgLyoqXG4gICAgICogY3JlYXRlcyB0aGUgbmVjZXNzYXJ5IGJveCBlbGVtZW50cyBhbmQgY2hlY2tzIHRoYXQgdGhlIGJveGVzIGlucHV0IGlzXG4gICAgICogY29ycmVjdC5cbiAgICAgKiAxLiBDcmVhdGUgYm94IGVsZW1lbnRzLlxuICAgICAqIDIuIFVwZGF0ZSB0aGUgZGFzaGdyaWQgc2luY2UgbmV3bHkgY3JlYXRlZCBib3hlcyBtYXkgbGllIG91dHNpZGUgdGhlXG4gICAgICogICAgaW5pdGlhbCBkYXNoZ3JpZCBzdGF0ZS5cbiAgICAgKiAzLiBSZW5kZXIgdGhlIGRhc2hncmlkLlxuICAgICAqL1xuICAgIGxldCBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGJveCBlbGVtZW50cyBhbmQgdXBkYXRlIG51bWJlciBvZiByb3dzIC8gY29sdW1ucy5cbiAgICAgICAgZ3JpZEVuZ2luZS5pbml0KCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBHcmlkIFZpZXcuXG4gICAgICAgIGdyaWRWaWV3LmluaXQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVRvXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGV4Y2x1ZGVCb3ggT3B0aW9uYWwgcGFyYW1ldGVyLCBpZiB1cGRhdGVCb3ggaXMgdHJpZ2dlcmVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgZHJhZyAvIHJlc2l6ZSBldmVudCwgdGhlbiBkb24ndCB1cGRhdGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgdXBkYXRlIHN1Y2NlZWRlZC5cbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlQm94ID0gZnVuY3Rpb24gKGJveCwgdXBkYXRlVG8sIGV4Y2x1ZGVCb3gpIHtcbiAgICAgICAgbGV0IG1vdmVkQm94ZXMgPSBncmlkRW5naW5lLnVwZGF0ZUJveChib3gsIHVwZGF0ZVRvKTtcblxuICAgICAgICBpZiAobW92ZWRCb3hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBncmlkVmlldy5yZW5kZXJCb3gobW92ZWRCb3hlcywgZXhjbHVkZUJveCk7XG4gICAgICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgYm94LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKi9cbiAgICBsZXQgcmVtb3ZlQm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBncmlkRW5naW5lLnJlbW92ZUJveChib3gpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc2l6ZXMgYSBib3guXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCByZXNpemVCb3ggPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIC8vIEluIGNhc2UgYm94IGlzIG5vdCB1cGRhdGVkIGJ5IGRyYWdnaW5nIC8gcmVzaXppbmcuXG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckJveChtb3ZlZEJveGVzKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBlaXRoZXIgcmVzaXplIG9yIGRyYWcgc3RhcnRzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlU3RhcnQgPSBmdW5jdGlvbiAoYm94KSB7XG4gICAgICAgIGdyaWRFbmdpbmUuaW5jcmVhc2VOdW1Sb3dzKGJveCwgMSk7XG4gICAgICAgIGdyaWRFbmdpbmUuaW5jcmVhc2VOdW1Db2x1bW5zKGJveCwgMSk7XG4gICAgICAgIGdyaWRWaWV3LnJlbmRlckdyaWQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV2hlbiBkcmFnZ2luZyAvIHJlc2l6aW5nIGlzIGRyb3BwZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqL1xuICAgIGxldCB1cGRhdGluZyA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgLy8gZ3JpZEVuZ2luZS5pbmNyZWFzZU51bVJvd3MoYm94LCAxKTtcbiAgICAgICAgLy8gZ3JpZEVuZ2luZS5pbmNyZWFzZU51bUNvbHVtbnMoYm94LCAxKTtcbiAgICAgICAgLy8gZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGRyYWdnaW5nIC8gcmVzaXppbmcgaXMgZHJvcHBlZC5cbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBncmlkRW5naW5lLmRlY3JlYXNlTnVtUm93cygpO1xuICAgICAgICBncmlkRW5naW5lLmRlY3JlYXNlTnVtQ29sdW1ucygpO1xuICAgICAgICBncmlkVmlldy5yZW5kZXJHcmlkKCk7XG4gICAgfTtcblxuICAgIGxldCByZWZyZXNoR3JpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyQm94KGRhc2hncmlkLmJveGVzKTtcbiAgICAgICAgZ3JpZFZpZXcucmVuZGVyR3JpZCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIHVwZGF0ZUJveDogdXBkYXRlQm94LFxuICAgICAgICBpbnNlcnRCb3g6IGdyaWRFbmdpbmUuaW5zZXJ0Qm94LFxuICAgICAgICByZW1vdmVCb3g6IGdyaWRFbmdpbmUucmVtb3ZlQm94LFxuICAgICAgICBnZXRCb3g6IGdyaWRFbmdpbmUuZ2V0Qm94LFxuICAgICAgICB1cGRhdGVTdGFydDogdXBkYXRlU3RhcnQsXG4gICAgICAgIHVwZGF0aW5nOiB1cGRhdGluZyxcbiAgICAgICAgdXBkYXRlRW5kOiB1cGRhdGVFbmQsXG4gICAgICAgIHJlZnJlc2hHcmlkOiByZWZyZXNoR3JpZFxuICAgIH0pO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgdGhlIHJlbmRlcmluZyBmcm9tIGphdmFzY3JpcHQgdG8gRE9NLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXNoZ3JpZC5cbiAqIEBwYXJhbSB7cmVuZGVyZXJ9IHJlbmRlcmVyLlxuICovXG5mdW5jdGlvbiBHcmlkVmlldyhvYmopIHtcbiAgICBsZXQge2Rhc2hncmlkLCByZW5kZXJlcn0gPSBvYmo7XG4gICAgbGV0IGdyaWRMaW5lc0VsZW1lbnQ7XG4gICAgbGV0IGdyaWRDZW50cm9pZHNFbGVtZW50O1xuXG4gICAgbGV0IGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkYXNoZ3JpZC5zaG93R3JpZExpbmVzKSB7Y3JlYXRlR3JpZExpbmVzRWxlbWVudCgpO31cbiAgICAgICAgaWYgKGRhc2hncmlkLnNob3dHcmlkQ2VudHJvaWRzKSB7Y3JlYXRlR3JpZENlbnRyb2lkc0VsZW1lbnQoKTt9XG5cbiAgICAgICAgY3JlYXRlU2hhZG93Qm94RWxlbWVudCgpO1xuXG4gICAgICAgIHJlbmRlcmVyLnNldENvbHVtbldpZHRoKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFJvd0hlaWdodCgpO1xuXG4gICAgICAgIHJlbmRlckdyaWQoKTtcbiAgICAgICAgcmVuZGVyQm94KGRhc2hncmlkLmJveGVzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIGxpbmUgZWxlbWVudHMuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUdyaWRMaW5lc0VsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBsaW5lRWxlbWVudElEID0gJ2Rhc2hncmlkLWdyaWQtbGluZXMnO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGluZUVsZW1lbnRJRCkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGdyaWRMaW5lc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGdyaWRMaW5lc0VsZW1lbnQuaWQgPSBsaW5lRWxlbWVudElEO1xuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZ3JpZExpbmVzRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIGxpbmUgZWxlbWVudHMuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZUdyaWRDZW50cm9pZHNFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgY2VudHJvaWRFbGVtZW50SUQgPSAnZGFzaGdyaWQtZ3JpZC1jZW50cm9pZHMnO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2VudHJvaWRFbGVtZW50SUQpID09PSBudWxsKSB7XG4gICAgICAgICAgICBncmlkQ2VudHJvaWRzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZ3JpZENlbnRyb2lkc0VsZW1lbnQuaWQgPSBjZW50cm9pZEVsZW1lbnRJRDtcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LmFwcGVuZENoaWxkKGdyaWRDZW50cm9pZHNFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGdyaWQgbGluZXMgd2l0aCB0aGUgdGhpY2tuZXNzIG9mIHhNYXJnaW5cbiAgICAgKiB5TWFyZ2luLlxuICAgICAqL1xuICAgIGxldCByZW5kZXJHcmlkTGluZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChncmlkTGluZXNFbGVtZW50ID09PSBudWxsKSB7cmV0dXJuO31cblxuICAgICAgICByZW1vdmVOb2RlcyhncmlkTGluZXNFbGVtZW50KTtcbiAgICAgICAgbGV0IGNvbHVtbldpZHRoID0gcmVuZGVyZXIuZ2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgbGV0IHJvd0hlaWdodCA9IHJlbmRlcmVyLmdldFJvd0hlaWdodCgpO1xuXG4gICAgICAgIGxldCBodG1sU3RyaW5nID0gJyc7XG4gICAgICAgIC8vIEhvcml6b250YWwgbGluZXNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZGFzaGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBodG1sU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdkYXNoZ3JpZC1ob3Jpem9udGFsLWxpbmUnXG4gICAgICAgICAgICAgICAgc3R5bGU9J3RvcDogJHtpICogKHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4pfXB4O1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwcHg7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7ZGFzaGdyaWQueU1hcmdpbn1weDtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyc+XG4gICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZlcnRpY2FsIGxpbmVzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGRhc2hncmlkLm51bUNvbHVtbnM7IGkgKz0gMSkge1xuICAgICAgICAgICAgaHRtbFN0cmluZyArPSBgPGRpdiBjbGFzcz0nZGFzaGdyaWQtdmVydGljYWwtbGluZSdcbiAgICAgICAgICAgICAgICBzdHlsZT0ndG9wOiAwcHg7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7aSAqIChjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW4pfXB4O1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke2Rhc2hncmlkLnhNYXJnaW59cHg7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsnPlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH1cblxuICAgICAgICBncmlkTGluZXNFbGVtZW50LmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERyYXcgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgZ3JpZCBsaW5lcyB3aXRoIHRoZSB0aGlja25lc3Mgb2YgeE1hcmdpblxuICAgICAqIHlNYXJnaW4uXG4gICAgICovXG4gICAgbGV0IHJlbmRlckdyaWRDZW50cm9pZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbW92ZU5vZGVzKGdyaWRDZW50cm9pZHNFbGVtZW50KTtcbiAgICAgICAgbGV0IGNvbHVtbldpZHRoID0gcmVuZGVyZXIuZ2V0Q29sdW1uV2lkdGgoKTtcbiAgICAgICAgbGV0IHJvd0hlaWdodCA9IHJlbmRlcmVyLmdldFJvd0hlaWdodCgpO1xuXG4gICAgICAgIGxldCBodG1sU3RyaW5nID0gJyc7XG4gICAgICAgIC8vIERyYXcgY2VudHJvaWRzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGFzaGdyaWQubnVtUm93czsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhc2hncmlkLm51bUNvbHVtbnM7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGh0bWxTdHJpbmcgKz0gYDxkaXYgY2xhc3M9J2Rhc2hncmlkLWNlbnRyb2lkJ1xuICAgICAgICAgICAgICAgICAgICBzdHlsZT0ndG9wOiAkeyhpICogKHJvd0hlaWdodCAgKyBkYXNoZ3JpZC55TWFyZ2luKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0IC8gMiArIGRhc2hncmlkLnlNYXJnaW4gKX1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7KGogKiAoY29sdW1uV2lkdGggICsgZGFzaGdyaWQueE1hcmdpbikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbldpZHRoIC8gMiArIGRhc2hncmlkLnhNYXJnaW4pfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsnPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ3JpZENlbnRyb2lkc0VsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgc2hhZG93IGJveCBlbGVtZW50IHdoaWNoIGlzIHVzZWQgd2hlbiBkcmFnZ2luZyAvIHJlc2l6aW5nXG4gICAgICogICAgIGEgYm94LiBJdCBnZXRzIGF0dGFjaGVkIHRvIHRoZSBkcmFnZ2luZyAvIHJlc2l6aW5nIGJveCwgd2hpbGVcbiAgICAgKiAgICAgYm94IGdldHMgdG8gbW92ZSAvIHJlc2l6ZSBmcmVlbHkgYW5kIHNuYXBzIGJhY2sgdG8gaXRzIG9yaWdpbmFsXG4gICAgICogICAgIG9yIG5ldyBwb3NpdGlvbiBhdCBkcmFnIC8gcmVzaXplIHN0b3AuXG4gICAgICovXG4gICAgbGV0IGNyZWF0ZVNoYWRvd0JveEVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGdyaWQtc2hhZG93LWJveCcpID09PSBudWxsKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuaWQgPSAnZGFzaGdyaWQtc2hhZG93LWJveCc7XG5cbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LmNsYXNzTmFtZSA9ICdkYXNoZ3JpZC1zaGFkb3ctYm94JztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzEwMDEnO1xuICAgICAgICAgICAgZGFzaGdyaWQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgZGFzaGdyaWQ6XG4gICAgICogICAgMS4gU2V0dGluZyBncmlkIGFuZCBjZWxsIGhlaWdodCAvIHdpZHRoXG4gICAgICogICAgMi4gUGFpbnRpbmcuXG4gICAgICovXG4gICAgbGV0IHJlbmRlckdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEdyaWRFbGVtZW50SGVpZ2h0KCk7XG4gICAgICAgIHJlbmRlcmVyLnNldEdyaWRFbGVtZW50V2lkdGgoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2VsbENlbnRyb2lkcygpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5zaG93R3JpZExpbmVzKSB7cmVuZGVyR3JpZExpbmVzKCk7fVxuICAgICAgICBpZiAoZGFzaGdyaWQuc2hvd0dyaWRDZW50cm9pZHMpIHtyZW5kZXJHcmlkQ2VudHJvaWRzKCk7fVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBib3hlcyBMaXN0IG9mIGJveGVzIHRvIHJlZHJhdy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXhjbHVkZUJveCBEb24ndCByZWRyYXcgdGhpcyBib3guXG4gICAgICovXG4gICAgbGV0IHJlbmRlckJveCA9IGZ1bmN0aW9uIChib3hlcywgZXhjbHVkZUJveCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyB1cGRhdGVHcmlkRGltZW5zaW9uIG1vdmVkIGJveGVzIGNzcy5cbiAgICAgICAgICAgIGJveGVzLmZvckVhY2goZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAgICAgICAgIGlmIChleGNsdWRlQm94ICE9PSBib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFlQb3NpdGlvbihib3guX2VsZW1lbnQsIGJveC5yb3cpO1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WFBvc2l0aW9uKGJveC5fZWxlbWVudCwgYm94LmNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRIZWlnaHQoYm94Ll9lbGVtZW50LCBib3gucm93c3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRXaWR0aChib3guX2VsZW1lbnQsIGJveC5jb2x1bW5zcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBpbml0LFxuICAgICAgICByZW5kZXJHcmlkLFxuICAgICAgICByZW5kZXJCb3gsXG4gICAgICAgIGNyZWF0ZUdyaWRMaW5lc0VsZW1lbnQsXG4gICAgICAgIGNyZWF0ZUdyaWRDZW50cm9pZHNFbGVtZW50XG4gICAgfSk7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIEhhbmRsZXMgY29sbGlzaW9uIGxvZ2ljIGFuZCBkYXNoZ3JpZCBkaW1lbnNpb24uXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cbmZ1bmN0aW9uIEdyaWRFbmdpbmUob2JqKSB7XG4gICAgbGV0IHtkYXNoZ3JpZCwgYm94SGFuZGxlcn0gPSBvYmo7XG4gICAgbGV0IGJveGVzLCBtb3ZpbmdCb3gsIG1vdmVkQm94ZXM7XG5cbiAgICBsZXQgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3JlYXRlQm94RWxlbWVudHMoKTtcbiAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG4gICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYm94IGVsZW1lbnRzLlxuICAgICAqL1xuICAgIGxldCBjcmVhdGVCb3hFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhc2hncmlkLmJveGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBib3hIYW5kbGVyLmNyZWF0ZUJveChkYXNoZ3JpZC5ib3hlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgYm94ZXMgPSBkYXNoZ3JpZC5ib3hlcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBET00gZWxlbWVudCwgcmV0cmlldmUgY29ycmVzcG9uZGluZyBqcyBvYmplY3QgZnJvbSBib3hlcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBET00gZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBib3ggR2l2ZW4gYSBET00gZWxlbWVudCwgcmV0dXJuIGNvcnJlc3BvbmRpbmcgYm94IG9iamVjdC5cbiAgICAgKi9cbiAgICBsZXQgZ2V0Qm94ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYm94ZXNbaV0uX2VsZW1lbnQgPT09IGVsZW1lbnQpIHtyZXR1cm4gYm94ZXNbaV19XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvcHkgYm94IHBvc2l0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXkuPE9iamVjdD59IFByZXZpb3VzIGJveCBwb3NpdGlvbnMuXG4gICAgICovXG4gICAgbGV0IGNvcHlCb3hlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHByZXZQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib3hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJldlBvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3c6IGJveGVzW2ldLnJvdyxcbiAgICAgICAgICAgICAgICBjb2x1bW46IGJveGVzW2ldLmNvbHVtbixcbiAgICAgICAgICAgICAgICBjb2x1bW5zcGFuOiBib3hlc1tpXS5jb2x1bW5zcGFuLFxuICAgICAgICAgICAgICAgIHJvd3NwYW46IGJveGVzW2ldLnJvd3NwYW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBwcmV2UG9zaXRpb25zO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlIE9sZCBwb3NpdGlvbnMuXG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gUHJldmlvdXMgcG9zaXRpb25zLlxuICAgICAqL1xuICAgIGxldCByZXN0b3JlT2xkUG9zaXRpb25zID0gZnVuY3Rpb24gKHByZXZQb3NpdGlvbnMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib3hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm94ZXNbaV0ucm93ID0gcHJldlBvc2l0aW9uc1tpXS5yb3csXG4gICAgICAgICAgICBib3hlc1tpXS5jb2x1bW4gPSBwcmV2UG9zaXRpb25zW2ldLmNvbHVtbixcbiAgICAgICAgICAgIGJveGVzW2ldLmNvbHVtbnNwYW4gPSBwcmV2UG9zaXRpb25zW2ldLmNvbHVtbnNwYW4sXG4gICAgICAgICAgICBib3hlc1tpXS5yb3dzcGFuID0gcHJldlBvc2l0aW9uc1tpXS5yb3dzcGFuXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGJveCBnaXZlbiBpdHMgaW5kZXggaW4gdGhlIGJveGVzIGFycmF5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3hJbmRleC5cbiAgICAgKi9cbiAgICBsZXQgcmVtb3ZlQm94ID0gZnVuY3Rpb24gKGJveEluZGV4KSB7XG4gICAgICAgIGxldCBlbGVtID0gYm94ZXNbYm94SW5kZXhdLl9lbGVtZW50O1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICAgIGJveGVzLnNwbGljZShib3hJbmRleCwgMSk7XG5cbiAgICAgICAgLy8gSW4gY2FzZSBmbG9hdGluZyBpcyBvbi5cbiAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICB1cGRhdGVOdW1Db2x1bW5zKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIGJveC4gQm94IG11c3QgY29udGFpbiBhdCBsZWFzdCB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gb2YgdGhlIGJveCxcbiAgICAgKiBjb250ZW50IGVsZW1lbnQgaXMgb3B0aW9uYWwuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBCb3ggZGltZW5zaW9ucy5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgaW5zZXJ0IHdhcyBwb3NzaWJsZS5cbiAgICAgKi9cbiAgICBsZXQgaW5zZXJ0Qm94ID0gZnVuY3Rpb24gKGJveCkge1xuICAgICAgICBtb3ZpbmdCb3ggPSBib3g7XG5cbiAgICAgICAgaWYgKGJveC5yb3dzID09PSB1bmRlZmluZWQgJiYgYm94LmNvbHVtbiA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBib3gucm93c3BhbiA9PT0gdW5kZWZpbmVkICYmIGJveC5jb2x1bW5zcGFuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNVcGRhdGVWYWxpZChib3gpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJldlBvc2l0aW9ucyA9IGNvcHlCb3hlcygpO1xuXG4gICAgICAgIGxldCBtb3ZlZEJveGVzID0gW2JveF07XG4gICAgICAgIGxldCB2YWxpZE1vdmUgPSBtb3ZlQm94KGJveCwgYm94LCBtb3ZlZEJveGVzKTtcbiAgICAgICAgbW92aW5nQm94ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmICh2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgIGJveEhhbmRsZXIuY3JlYXRlQm94KGJveCk7XG4gICAgICAgICAgICBib3hlcy5wdXNoKGJveCk7XG5cbiAgICAgICAgICAgIHVwZGF0ZU51bVJvd3MoKTtcbiAgICAgICAgICAgIHVwZGF0ZU51bUNvbHVtbnMoKTtcbiAgICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cblxuICAgICAgICByZXN0b3JlT2xkUG9zaXRpb25zKHByZXZQb3NpdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBhIHBvc2l0aW9uIG9yIHNpemUgb2YgYm94LlxuICAgICAqXG4gICAgICogV29ya3MgaW4gcG9zdGVyaW9yIGZhc2hpb24sIGFraW4gdG8gYXNrIGZvciBmb3JnaXZlbmVzcyByYXRoZXIgdGhhbiBmb3JcbiAgICAgKiBwZXJtaXNzaW9uLlxuICAgICAqIExvZ2ljOlxuICAgICAqXG4gICAgICogMS4gSXMgdXBkYXRlVG8gYSB2YWxpZCBzdGF0ZT9cbiAgICAgKiAgICAxLjEgTm86IFJldHVybiBmYWxzZS5cbiAgICAgKiAyLiBTYXZlIHBvc2l0aW9ucy5cbiAgICAgKiAzLiBNb3ZlIGJveC5cbiAgICAgKiAgICAgIDMuMS4gSXMgYm94IG91dHNpZGUgYm9yZGVyP1xuICAgICAqICAgICAgICAgIDMuMS4xLiBZZXM6IENhbiBib3JkZXIgYmUgcHVzaGVkP1xuICAgICAqICAgICAgICAgICAgICAzLjEuMS4xLiBZZXM6IEV4cGFuZCBib3JkZXIuXG4gICAgICogICAgICAgICAgICAgIDMuMS4xLjIuIE5vOiBSZXR1cm4gZmFsc2UuXG4gICAgICogICAgICAzLjIuIERvZXMgYm94IGNvbGxpZGU/XG4gICAgICogICAgICAgICAgMy4yLjEuIFllczogQ2FsY3VsYXRlIG5ldyBib3ggcG9zaXRpb24gYW5kXG4gICAgICogICAgICAgICAgICAgICAgIGdvIGJhY2sgdG8gc3RlcCAxIHdpdGggdGhlIG5ldyBjb2xsaWRlZCBib3guXG4gICAgICogICAgICAgICAgMy4yLjIuIE5vOiBSZXR1cm4gdHJ1ZS5cbiAgICAgKiA0LiBJcyBtb3ZlIHZhbGlkP1xuICAgICAqICAgIDQuMS4gWWVzOiBVcGRhdGUgbnVtYmVyIHJvd3MgLyBjb2x1bW5zLlxuICAgICAqICAgIDQuMi4gTm86IFJldmVydCB0byBvbGQgcG9zaXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveCBUaGUgYm94IGJlaW5nIHVwZGF0ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVRvIFRoZSBuZXcgc3RhdGUuXG4gICAgICogQHJldHVybnMge0FycmF5LjxPYmplY3Q+fSBtb3ZlZEJveGVzXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZUJveCA9IGZ1bmN0aW9uIChib3gsIHVwZGF0ZVRvKSB7XG4gICAgICAgIG1vdmluZ0JveCA9IGJveDtcblxuICAgICAgICBsZXQgcHJldlBvc2l0aW9ucyA9IGNvcHlCb3hlcygpXG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihib3gsIHVwZGF0ZVRvKTtcbiAgICAgICAgaWYgKCFpc1VwZGF0ZVZhbGlkKGJveCkpIHtcbiAgICAgICAgICAgIHJlc3RvcmVPbGRQb3NpdGlvbnMocHJldlBvc2l0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbW92ZWRCb3hlcyA9IFtib3hdO1xuICAgICAgICBsZXQgdmFsaWRNb3ZlID0gbW92ZUJveChib3gsIGJveCwgbW92ZWRCb3hlcyk7XG5cbiAgICAgICAgaWYgKHZhbGlkTW92ZSkge1xuICAgICAgICAgICAgdXBkYXRlTnVtUm93cygpO1xuICAgICAgICAgICAgdXBkYXRlTnVtQ29sdW1ucygpO1xuXG4gICAgICAgICAgICByZXR1cm4gbW92ZWRCb3hlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3RvcmVPbGRQb3NpdGlvbnMocHJldlBvc2l0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgYW5kIGhhbmRsZXMgY29sbGlzaW9ucyB3aXRoIHdhbGwgYW5kIGJveGVzLlxuICAgICAqIFdvcmtzIGFzIGEgdHJlZSwgcHJvcGFnYXRpbmcgbW92ZXMgZG93biB0aGUgY29sbGlzaW9uIHRyZWUgYW5kIHJldHVybnNcbiAgICAgKiAgICAgdHJ1ZSBvciBmYWxzZSBkZXBlbmRpbmcgaWYgdGhlIGJveCBpbmZyb250IGlzIGFibGUgdG8gbW92ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gZXhjbHVkZUJveFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG1vdmVkQm94ZXNcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIG1vdmUgaXMgcG9zc2libGUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBsZXQgbW92ZUJveCA9IGZ1bmN0aW9uIChib3gsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpIHtcbiAgICAgICAgaWYgKGlzQm94T3V0c2lkZUJvdW5kYXJ5KGJveCkpIHtyZXR1cm4gZmFsc2U7fVxuXG4gICAgICAgIGxldCBpbnRlcnNlY3RlZEJveGVzID0gZ2V0SW50ZXJzZWN0ZWRCb3hlcyhib3gsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpO1xuXG4gICAgICAgIC8vIEhhbmRsZSBib3ggQ29sbGlzaW9uLCByZWN1cnNpdmUgbW9kZWwuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBpbnRlcnNlY3RlZEJveGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIWNvbGxpc2lvbkhhbmRsZXIoYm94LCBpbnRlcnNlY3RlZEJveGVzW2ldLCBleGNsdWRlQm94LCBtb3ZlZEJveGVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQcm9wYWdhdGVzIGJveCBjb2xsaXNpb25zLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94QlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBleGNsdWRlQm94XG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gbW92ZWRCb3hlc1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIG1vdmUgaXMgYWxsb3dlZFxuICAgICAqL1xuICAgIGxldCBjb2xsaXNpb25IYW5kbGVyID0gZnVuY3Rpb24gKGJveCwgYm94QiwgZXhjbHVkZUJveCwgbW92ZWRCb3hlcykge1xuICAgICAgICBzZXRCb3hQb3NpdGlvbihib3gsIGJveEIpXG4gICAgICAgIHJldHVybiBtb3ZlQm94KGJveEIsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIG5ldyBib3ggcG9zaXRpb24gYmFzZWQgb24gdGhlIGJveCB0aGF0IHB1c2hlZCBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94IEJveCB3aGljaCBoYXMgbW92ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEIgQm94IHdoaWNoIGlzIHRvIGJlIG1vdmVkLlxuICAgICAqL1xuICAgIGxldCBzZXRCb3hQb3NpdGlvbiA9IGZ1bmN0aW9uIChib3gsIGJveEIpIHtcbiAgICAgICAgYm94Qi5yb3cgKz0gYm94LnJvdyArIGJveC5yb3dzcGFuIC0gYm94Qi5yb3c7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgYm94LCBmaW5kcyBvdGhlciBib3hlcyB3aGljaCBpbnRlcnNlY3Qgd2l0aCBpdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gZXhjbHVkZUJveCBBcnJheSBvZiBib3hlcy5cbiAgICAgKi9cbiAgICBsZXQgZ2V0SW50ZXJzZWN0ZWRCb3hlcyA9IGZ1bmN0aW9uIChib3gsIGV4Y2x1ZGVCb3gsIG1vdmVkQm94ZXMpIHtcbiAgICAgICAgbGV0IGludGVyc2VjdGVkQm94ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGJveGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBEb24ndCBjaGVjayBtb3ZpbmcgYm94IGFuZCB0aGUgYm94IGl0c2VsZi5cbiAgICAgICAgICAgIGlmIChib3ggIT09IGJveGVzW2ldICYmIGJveGVzW2ldICE9PSBleGNsdWRlQm94KSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvQm94ZXNJbnRlcnNlY3QoYm94LCBib3hlc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZWRCb3hlcy5wdXNoKGJveGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0ZWRCb3hlcy5wdXNoKGJveGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW5zZXJ0aW9uU29ydChpbnRlcnNlY3RlZEJveGVzLCAncm93Jyk7XG5cbiAgICAgICAgcmV0dXJuIGludGVyc2VjdGVkQm94ZXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIDIgYm94ZXMgaW50ZXJzZWN0IHVzaW5nIGJvdW5kaW5nIGJveCBtZXRob2QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveEFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94QlxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gVHJ1ZSBpZiBpbnRlcnNlY3QgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgZG9Cb3hlc0ludGVyc2VjdCA9IGZ1bmN0aW9uIChib3gsIGJveEIpIHtcbiAgICAgICAgcmV0dXJuIChib3guY29sdW1uIDwgYm94Qi5jb2x1bW4gKyBib3hCLmNvbHVtbnNwYW4gJiZcbiAgICAgICAgICAgICAgICBib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW4gPiBib3hCLmNvbHVtbiAmJlxuICAgICAgICAgICAgICAgIGJveC5yb3cgPCBib3hCLnJvdyArIGJveEIucm93c3BhbiAmJlxuICAgICAgICAgICAgICAgIGJveC5yb3dzcGFuICsgYm94LnJvdyA+IGJveEIucm93KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgbnVtYmVyIG9mIGNvbHVtbnMuXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZU51bUNvbHVtbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtYXhDb2x1bW4gPSBnZXRNYXhOdW0oYm94ZXMsICdjb2x1bW4nLCAnY29sdW1uc3BhbicpO1xuXG4gICAgICAgIGlmIChtYXhDb2x1bW4gPj0gZGFzaGdyaWQubWluQ29sdW1ucykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA9IG1heENvbHVtbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbW92aW5nQm94KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGFzaGdyaWQubnVtQ29sdW1ucyAtIG1vdmluZ0JveC5jb2x1bW4gLSBtb3ZpbmdCb3guY29sdW1uc3BhbiA9PT0gMCAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA8IGRhc2hncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXNoZ3JpZC5udW1Db2x1bW5zIC0gbW92aW5nQm94LmNvbHVtbi0gbW92aW5nQm94LmNvbHVtbnNwYW4gPiAxICYmXG4gICAgICAgICAgICBtb3ZpbmdCb3guY29sdW1uICsgbW92aW5nQm94LmNvbHVtbnNwYW4gPT09IG1heENvbHVtbiAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyA+IGRhc2hncmlkLm1pbkNvbHVtbnMgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bUNvbHVtbnMgPCBkYXNoZ3JpZC5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zID0gbWF4Q29sdW1uICsgMTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmNyZWFzZXMgbnVtYmVyIG9mIGRhc2hncmlkLm51bVJvd3MgaWYgYm94IHRvdWNoZXMgYm90dG9tIG9mIHdhbGwuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1Db2x1bW5zXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5jcmVhc2UgZWxzZSBmYWxzZS5cbiAgICAgKi9cbiAgICBsZXQgaW5jcmVhc2VOdW1Db2x1bW5zID0gZnVuY3Rpb24gKGJveCwgbnVtQ29sdW1ucykge1xuICAgICAgICAvLyBEZXRlcm1pbmUgd2hlbiB0byBhZGQgZXh0cmEgcm93IHRvIGJlIGFibGUgdG8gbW92ZSBkb3duOlxuICAgICAgICAvLyAxLiBBbnl0aW1lIGRyYWdnaW5nIHN0YXJ0cy5cbiAgICAgICAgLy8gMi4gV2hlbiBkcmFnZ2luZyBzdGFydHMgYW5kIG1vdmluZyBib3ggaXMgY2xvc2UgdG8gYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKChib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW4pID09PSBkYXNoZ3JpZC5udW1Db2x1bW5zICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Db2x1bW5zIDwgZGFzaGdyaWQubWF4Q29sdW1ucykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtQ29sdW1ucyArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY3JlYXNlcyBudW1iZXIgb2YgZGFzaGdyaWQubnVtUm93cyB0byBmdXJ0aGVzdCBsZWZ0d2FyZCBib3guXG4gICAgICogQHJldHVybnMgYm9vbGVhbiB0cnVlIGlmIGluY3JlYXNlIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGRlY3JlYXNlTnVtQ29sdW1ucyA9IGZ1bmN0aW9uICAoKSB7XG4gICAgICAgIGxldCBtYXhDb2x1bW5OdW0gPSAwO1xuXG4gICAgICAgIGJveGVzLmZvckVhY2goZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAgICAgaWYgKG1heENvbHVtbk51bSA8IChib3guY29sdW1uICsgYm94LmNvbHVtbnNwYW4pKSB7XG4gICAgICAgICAgICAgICAgbWF4Q29sdW1uTnVtID0gYm94LmNvbHVtbiArIGJveC5jb2x1bW5zcGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWF4Q29sdW1uTnVtIDwgZGFzaGdyaWQubnVtQ29sdW1ucykge2Rhc2hncmlkLm51bUNvbHVtbnMgPSBtYXhDb2x1bW5OdW07fVxuICAgICAgICBpZiAobWF4Q29sdW1uTnVtIDwgZGFzaGdyaWQubWluQ29sdW1ucykge2Rhc2hncmlkLm51bUNvbHVtbnMgPSBkYXNoZ3JpZC5taW5Db2x1bW5zO31cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIHJvd3MgZGVwZW5kcyBvbiB0aHJlZSB0aGluZ3MuXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+TWluIC8gTWF4IFJvd3MuPC9saT5cbiAgICAgKiAgICAgPGxpPk1heCBCb3guPC9saT5cbiAgICAgKiAgICAgPGxpPkRyYWdnaW5nIGJveCBuZWFyIGJvdHRvbSBib3JkZXIuPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqXG4gICAgICovXG4gICAgbGV0IHVwZGF0ZU51bVJvd3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtYXhSb3cgPSBnZXRNYXhOdW0oYm94ZXMsICdyb3cnLCAncm93c3BhbicpO1xuXG4gICAgICAgIGlmIChtYXhSb3cgPj0gZGFzaGdyaWQubWluUm93cykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA9IG1heFJvdztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbW92aW5nQm94KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZpbmcgYm94IHdoZW4gY2xvc2UgdG8gYm9yZGVyLlxuICAgICAgICBpZiAoZGFzaGdyaWQubnVtUm93cyAtIG1vdmluZ0JveC5yb3cgLSBtb3ZpbmdCb3gucm93c3BhbiA9PT0gMCAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA8IGRhc2hncmlkLm1heFJvd3MpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXNoZ3JpZC5udW1Sb3dzIC0gbW92aW5nQm94LnJvdyAtIG1vdmluZ0JveC5yb3dzcGFuID4gMSAmJlxuICAgICAgICAgICAgbW92aW5nQm94LnJvdyArIG1vdmluZ0JveC5yb3dzcGFuID09PSBtYXhSb3cgJiZcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgPiBkYXNoZ3JpZC5taW5Sb3dzICYmXG4gICAgICAgICAgICBkYXNoZ3JpZC5udW1Sb3dzIDwgZGFzaGdyaWQubWF4Um93cykge1xuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA9IG1heFJvdyArIDE7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbmNyZWFzZXMgbnVtYmVyIG9mIGRhc2hncmlkLm51bVJvd3MgaWYgYm94IHRvdWNoZXMgYm90dG9tIG9mIHdhbGwuXG4gICAgICogQHBhcmFtIGJveCB7T2JqZWN0fVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluY3JlYXNlIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGluY3JlYXNlTnVtUm93cyA9IGZ1bmN0aW9uIChib3gsIG51bVJvd3MpIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZW4gdG8gYWRkIGV4dHJhIHJvdyB0byBiZSBhYmxlIHRvIG1vdmUgZG93bjpcbiAgICAgICAgLy8gMS4gQW55dGltZSBkcmFnZ2luZyBzdGFydHMuXG4gICAgICAgIC8vIDIuIFdoZW4gZHJhZ2dpbmcgc3RhcnRzIEFORCBtb3ZpbmcgYm94IGlzIGNsb3NlIHRvIGJvdHRvbSBib3JkZXIuXG4gICAgICAgIGlmICgoYm94LnJvdyArIGJveC5yb3dzcGFuKSA9PT0gZGFzaGdyaWQubnVtUm93cyAmJlxuICAgICAgICAgICAgZGFzaGdyaWQubnVtUm93cyA8IGRhc2hncmlkLm1heFJvd3MpIHtcbiAgICAgICAgICAgIGRhc2hncmlkLm51bVJvd3MgKz0gMTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNyZWFzZXMgbnVtYmVyIG9mIGRhc2hncmlkLm51bVJvd3MgdG8gZnVydGhlc3QgZG93bndhcmQgYm94LlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluY3JlYXNlIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgbGV0IGRlY3JlYXNlTnVtUm93cyA9IGZ1bmN0aW9uICAoKSB7XG4gICAgICAgIGxldCBtYXhSb3dOdW0gPSAwO1xuXG4gICAgICAgIGJveGVzLmZvckVhY2goZnVuY3Rpb24gKGJveCkge1xuICAgICAgICAgICAgaWYgKG1heFJvd051bSA8IChib3gucm93ICsgYm94LnJvd3NwYW4pKSB7XG4gICAgICAgICAgICAgICAgbWF4Um93TnVtID0gYm94LnJvdyArIGJveC5yb3dzcGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobWF4Um93TnVtIDwgZGFzaGdyaWQubnVtUm93cykge2Rhc2hncmlkLm51bVJvd3MgPSBtYXhSb3dOdW07fVxuICAgICAgICBpZiAobWF4Um93TnVtIDwgZGFzaGdyaWQubWluUm93cykge2Rhc2hncmlkLm51bVJvd3MgPSBkYXNoZ3JpZC5taW5Sb3dzO31cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIG1pbiwgbWF4IGJveC1zaXplLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBsZXQgaXNVcGRhdGVWYWxpZCA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgaWYgKGJveC5yb3dzcGFuIDwgZGFzaGdyaWQubWluUm93c3BhbiB8fFxuICAgICAgICAgICAgYm94LnJvd3NwYW4gPiBkYXNoZ3JpZC5tYXhSb3dzcGFuIHx8XG4gICAgICAgICAgICBib3guY29sdW1uc3BhbiA8IGRhc2hncmlkLm1pbkNvbHVtbnNwYW4gfHxcbiAgICAgICAgICAgIGJveC5jb2x1bW5zcGFuID4gZGFzaGdyaWQubWF4Q29sdW1uc3Bhbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgYm9yZGVyIGNvbGxpc2lvbnMgYnkgcmV2ZXJ0aW5nIGJhY2sgdG8gY2xvc2VzdCBlZGdlIHBvaW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBjb2xsaWRlZCBhbmQgY2Fubm90IG1vdmUgd2FsbCBlbHNlIGZhbHNlLlxuICAgICAqL1xuICAgIGxldCBpc0JveE91dHNpZGVCb3VuZGFyeSA9IGZ1bmN0aW9uIChib3gpIHtcbiAgICAgICAgLy8gVG9wIGFuZCBsZWZ0IGJvcmRlci5cbiAgICAgICAgaWYgKGJveC5jb2x1bW4gPCAwIHx8XG4gICAgICAgICAgICBib3gucm93IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSaWdodCBhbmQgYm90dG9tIGJvcmRlci5cbiAgICAgICAgaWYgKGJveC5yb3cgKyBib3gucm93c3BhbiA+IGRhc2hncmlkLm1heFJvd3MgfHxcbiAgICAgICAgICAgIGJveC5jb2x1bW4gKyBib3guY29sdW1uc3BhbiA+IGRhc2hncmlkLm1heENvbHVtbnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgIGluaXQsXG4gICAgICAgIHVwZGF0ZUJveCxcbiAgICAgICAgdXBkYXRlTnVtUm93cyxcbiAgICAgICAgaW5jcmVhc2VOdW1Sb3dzLFxuICAgICAgICBkZWNyZWFzZU51bVJvd3MsXG4gICAgICAgIHVwZGF0ZU51bUNvbHVtbnMsXG4gICAgICAgIGluY3JlYXNlTnVtQ29sdW1ucyxcbiAgICAgICAgZGVjcmVhc2VOdW1Db2x1bW5zLFxuICAgICAgICBnZXRCb3gsXG4gICAgICAgIGluc2VydEJveCxcbiAgICAgICAgcmVtb3ZlQm94XG4gICAgfSk7XG59XG4iLCIvKipcbiAqIG1vdXNlSGFuZGxlci5qczogSW5pdGlhbGl6ZXMgYW5kIHNldHMgdXAgdGhlIGV2ZW50cyBmb3IgZHJhZ2dpbmcgLyByZXNpemluZy5cbiAqL1xuXG5pbXBvcnQge2ZpbmRQYXJlbnR9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb3VzZUhhbmRsZXIoY29tcCkge1xuICAgIGxldCB7ZHJhZ2dlciwgcmVzaXplciwgZGFzaGdyaWQsIGdyaWR9ID0gY29tcDtcblxuICAgIGxldCBpbnB1dFRhZ3MgPSBbJ3NlbGVjdCcsICdpbnB1dCcsICd0ZXh0YXJlYScsICdidXR0b24nXTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7ZGFzaGdyaWQuX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGUpIHttb3VzZURvd24oZSwgZGFzaGdyaWQuX2VsZW1lbnQpOyBlLnByZXZlbnREZWZhdWx0KCk7fSwgZmFsc2UpO31cblxuICAgIGZ1bmN0aW9uIG1vdXNlRG93bihlLCBlbGVtZW50KSB7XG4gICAgICAgIGxldCBub2RlID0gZS50YXJnZXQ7XG5cbiAgICAgICAgLy8gRXhpdCBpZjpcbiAgICAgICAgLy8gMS4gdGhlIHRhcmdldCBoYXMgaXQncyBvd24gY2xpY2sgZXZlbnQgb3JcbiAgICAgICAgLy8gMi4gdGFyZ2V0IGhhcyBvbmNsaWNrIGF0dHJpYnV0ZSBvclxuICAgICAgICAvLyAzLiBSaWdodCAvIG1pZGRsZSBidXR0b24gY2xpY2tlZCBpbnN0ZWFkIG9mIGxlZnQuXG4gICAgICAgIGlmIChpbnB1dFRhZ3MuaW5kZXhPZihub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtyZXR1cm47fVxuICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ29uY2xpY2snKSkge3JldHVybjt9XG4gICAgICAgIGlmIChlLndoaWNoID09PSAyIHx8IGUud2hpY2ggPT09IDMpIHtyZXR1cm47fVxuXG4gICAgICAgIC8vIEhhbmRsZSBkcmFnIC8gcmVzaXplIGV2ZW50LlxuICAgICAgICBpZiAobm9kZS5jbGFzc05hbWUuc2VhcmNoKC9kYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS8pID4gLTEpIHtoYW5kbGVFdmVudChlLCByZXNpemVFdmVudCk7fVxuICAgICAgICBlbHNlIGlmIChub2RlLmNsYXNzTmFtZS5zZWFyY2goZGFzaGdyaWQuZHJhZ2dhYmxlLmhhbmRsZSkgPiAtMSkge2hhbmRsZUV2ZW50KGUsIGRyYWdFdmVudCk7fVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBtb3VzZSBldmVudCwgY2xpY2sgb3IgcmVzaXplLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYW5kbGVFdmVudChlLCBjYikge1xuICAgICAgICBsZXQgYm94RWxlbWVudCA9IGZpbmRQYXJlbnQoZS50YXJnZXQsIC9eZGFzaGdyaWQtYm94JC8pO1xuICAgICAgICBsZXQgYm94ID0gZ3JpZC5nZXRCb3goYm94RWxlbWVudCk7XG4gICAgICAgIGlmIChib3gpIHsgY2IoYm94LCBlKTsgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYWcgZXZlbnQsIHNldHMgb2ZmIHN0YXJ0IGRyYWcsIGR1cmluZyBkcmFnIGFuZCBlbmQgZHJhZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkcmFnRXZlbnQoYm94LCBlKSB7XG4gICAgICAgIGlmICghZGFzaGdyaWQuZHJhZ2dhYmxlLmVuYWJsZWQgfHwgIWJveC5kcmFnZ2FibGUpIHtyZXR1cm47fVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnc3RhcnQnKTtcbiAgICAgICAgZHJhZ2dlci5kcmFnU3RhcnQoYm94LCBlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZHJhZ0VuZCwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmFnLCBmYWxzZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhZyhlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZHJhZycpO1xuICAgICAgICAgICAgZHJhZ2dlci5kcmFnKGJveCwgZSk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmFnRW5kKGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnZW5kJyk7XG4gICAgICAgICAgICBkcmFnZ2VyLmRyYWdFbmQoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBkcmFnRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmFnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemUgZXZlbnQsIHNldHMgb2ZmIHN0YXJ0IHJlc2l6ZSwgZHVyaW5nIHJlc2l6ZSBhbmQgZW5kIHJlc2l6ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNpemVFdmVudChib3gsIGUpIHtcbiAgICAgICAgaWYgKCFkYXNoZ3JpZC5yZXNpemFibGUuZW5hYmxlZCB8fCAhYm94LnJlc2l6YWJsZSkge3JldHVybjt9XG4gICAgICAgIHJlc2l6ZXIucmVzaXplU3RhcnQoYm94LCBlKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVzaXplRW5kLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlc2l6ZSwgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZShlKSB7cmVzaXplci5yZXNpemUoYm94LCBlKTtlLnByZXZlbnREZWZhdWx0KCk7fVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUVuZChlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVzaXplRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCByZXNpemUsIGZhbHNlKTtcblxuICAgICAgICAgICAgcmVzaXplci5yZXNpemVFbmQoYm94LCBlKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgaW5pdFxuICAgIH0pO1xuXG59XG4iLCJpbXBvcnQge3JlbW92ZU5vZGVzfSBmcm9tICcuL3V0aWxzLmpzJztcbmV4cG9ydCBkZWZhdWx0IFJlbmRlcjtcblxuZnVuY3Rpb24gUmVuZGVyKGNvbXApIHtcbiAgICBsZXQge2Rhc2hncmlkfSA9IGNvbXA7XG5cbiAgICAvLyBTdGFydCByb3cgLyBjb2x1bW4gZGVub3RlcyB0aGUgcGl4ZWwgYXQgd2hpY2ggZWFjaCBjZWxsIHN0YXJ0cyBhdC5cbiAgICBsZXQgc3RhcnRDb2x1bW4gPSBbXTtcbiAgICBsZXQgc3RhcnRSb3cgPSBbXTtcbiAgICBsZXQgY29sdW1uV2lkdGgsIHJvd0hlaWdodDtcblxuICAgIC8qKlxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgICBsZXQgZ2V0Q29sdW1uV2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5XaWR0aDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgIGxldCBnZXRSb3dIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByb3dIZWlnaHQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBzZXRHcmlkRWxlbWVudFdpZHRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5zdHlsZS53aWR0aCA9IChjb2x1bW5XaWR0aCkgP1xuICAgICAgICAgICAgY29sdW1uV2lkdGggKiBkYXNoZ3JpZC5udW1Db2x1bW5zICsgKGRhc2hncmlkLm51bUNvbHVtbnMgKyAxKSAqIGRhc2hncmlkLnhNYXJnaW4gKyAncHgnIDpcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0V2lkdGggKyAncHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Q29sdW1uV2lkdGggPSBmdW5jdGlvbiAoKSB7ICAgICAgICAgICAgXG4gICAgICAgIGNvbHVtbldpZHRoID0gKGRhc2hncmlkLmNvbHVtbldpZHRoICE9PSAnYXV0bycpID9cbiAgICAgICAgICAgIGRhc2hncmlkLmNvbHVtbldpZHRoIDpcbiAgICAgICAgICAgIChkYXNoZ3JpZC5fZWxlbWVudC5wYXJlbnROb2RlLm9mZnNldFdpZHRoIC0gKGRhc2hncmlkLm51bUNvbHVtbnMgKyAxKSAqIGRhc2hncmlkLnhNYXJnaW4pIC8gZGFzaGdyaWQubnVtQ29sdW1ucztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEdyaWRFbGVtZW50SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXNoZ3JpZC5fZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAocm93SGVpZ2h0KSA/XG4gICAgICAgICAgICByb3dIZWlnaHQgKiBkYXNoZ3JpZC5udW1Sb3dzICsgKGRhc2hncmlkLm51bVJvd3MgKyAxKSAqIGRhc2hncmlkLnlNYXJnaW4gKyAncHgnIDpcbiAgICAgICAgICAgIGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldFJvd0hlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcm93SGVpZ2h0ID0gKGRhc2hncmlkLnJvd0hlaWdodCAhPT0gJ2F1dG8nKSA/XG4gICAgICAgICAgICBkYXNoZ3JpZC5yb3dIZWlnaHQgOlxuICAgICAgICAgICAgKGRhc2hncmlkLl9lbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0IC0gKGRhc2hncmlkLm51bVJvd3MgKyAxKSAqIGRhc2hncmlkLnlNYXJnaW4pIC8gZGFzaGdyaWQubnVtUm93cztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEJveEVsZW1lbnRYUG9zaXRpb24gPSBmdW5jdGlvbiAoZWxlbWVudCwgY29sdW1uKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGNvbHVtbiAqIGNvbHVtbldpZHRoICsgZGFzaGdyaWQueE1hcmdpbiAqIChjb2x1bW4gKyAxKSArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICpcbiAgICAqIEBwYXJhbSB7fVxuICAgICogQHJldHVybnNcbiAgICAqL1xuICAgIGxldCBzZXRCb3hFbGVtZW50WVBvc2l0aW9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJvdykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHJvdyAqIHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4gKiAocm93ICsgMSkgKyAncHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge31cbiAgICAqIEByZXR1cm5zXG4gICAgKi9cbiAgICBsZXQgc2V0Qm94RWxlbWVudFdpZHRoID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbHVtbnNwYW4pIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGNvbHVtbnNwYW4gKiBjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW4gKiAoY29sdW1uc3BhbiAtIDEpICsgJ3B4JztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKlxuICAgICogQHBhcmFtIHt9XG4gICAgKiBAcmV0dXJuc1xuICAgICovXG4gICAgbGV0IHNldEJveEVsZW1lbnRIZWlnaHQgPSBmdW5jdGlvbiAoZWxlbWVudCwgcm93c3Bhbikge1xuICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IHJvd3NwYW4gKiByb3dIZWlnaHQgKyBkYXNoZ3JpZC55TWFyZ2luICogKHJvd3NwYW4gLSAxKSArICdweCc7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGNlbGwgY2VudHJvaWRzIHdoaWNoIGFyZSB1c2VkIHRvIGNvbXB1dGUgY2xvc2VzdCBjZWxsXG4gICAgICogICAgIHdoZW4gZHJhZ2dpbmcgYSBib3guXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bVJvd3MgVGhlIHRvdGFsIG51bWJlciBvZiByb3dzLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1Db2x1bW5zIFRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cy5cbiAgICAgKi9cbiAgICBsZXQgc2V0Q2VsbENlbnRyb2lkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhcnRSb3cgPSBbXTtcbiAgICAgICAgc3RhcnRDb2x1bW4gPSBbXTtcbiAgICAgICAgbGV0IHN0YXJ0O1xuICAgICAgICBsZXQgc3RvcDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhc2hncmlkLm51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgc3RhcnQgPSBpICogKHJvd0hlaWdodCArIGRhc2hncmlkLnlNYXJnaW4pICsgZGFzaGdyaWQueU1hcmdpbiAvIDI7XG4gICAgICAgICAgICBzdG9wID0gc3RhcnQgKyByb3dIZWlnaHQgKyBkYXNoZ3JpZC55TWFyZ2luO1xuICAgICAgICAgICAgc3RhcnRSb3cucHVzaChbTWF0aC5mbG9vcihzdGFydCksIE1hdGguY2VpbChzdG9wKV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXNoZ3JpZC5udW1Db2x1bW5zOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gaSAqIChjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW4pICsgZGFzaGdyaWQueE1hcmdpbiAvIDI7XG4gICAgICAgICAgICBzdG9wID0gc3RhcnQgKyBjb2x1bW5XaWR0aCArIGRhc2hncmlkLnhNYXJnaW47XG4gICAgICAgICAgICBzdGFydENvbHVtbi5wdXNoKFtNYXRoLmZsb29yKHN0YXJ0KSwgTWF0aC5jZWlsKHN0b3ApXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgd2hpY2ggY2VsbHMgYm94IGludGVyc2VjdHMgd2l0aC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94UG9zaXRpb24gQ29udGFpbnMgdG9wL2JvdHRvbS9sZWZ0L3JpZ2h0IGJveCBwb3NpdGlvblxuICAgICAqICAgICBpbiBweC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtUm93cyBIb3cgbWFueSByb3dzIHRoZSBib3ggc3BhbnMuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bUNvbHVtbnMgSG93IG1hbnkgcm93cyB0aGUgYm94IHNwYW5zLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJvdyBvciBjb2x1bW4gd2hpY2ggZWFjaCBzaWRlIGlzIGZvdW5kIGluLlxuICAgICAqICAgICBGb3IgaW5zdGFuY2UsIGJveExlZnQ6IGNvbHVtbiA9IDAsIGJveFJpZ2h0OiBjb2x1bW4gPSAxLFxuICAgICAqICAgICBCb3hUb3A6IHJvdyA9IDAsIEJveEJvdHRvbTogcm93ID0gMy5cbiAgICAgKi9cbiAgICBsZXQgZmluZEludGVyc2VjdGVkQ2VsbHMgPSBmdW5jdGlvbiAoY29tcCkge1xuICAgICAgICBsZXQge3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdH0gPSBjb21wO1xuICAgICAgICBsZXQgYm94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tO1xuXG4gICAgICAgIC8vIEZpbmQgdG9wIGFuZCBib3R0b20gaW50ZXJzZWN0aW9uIGNlbGwgcm93LlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhc2hncmlkLm51bVJvd3M7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHRvcCA+PSBzdGFydFJvd1tpXVswXSAmJiB0b3AgPD0gc3RhcnRSb3dbaV1bMV0pIHtib3hUb3AgPSBpO31cbiAgICAgICAgICAgIGlmIChib3R0b20gPj0gc3RhcnRSb3dbaV1bMF0gJiYgYm90dG9tIDw9IHN0YXJ0Um93W2ldWzFdKSB7Ym94Qm90dG9tID0gaTt9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5kIGxlZnQgYW5kIHJpZ2h0IGludGVyc2VjdGlvbiBjZWxsIGNvbHVtbi5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXNoZ3JpZC5udW1Db2x1bW5zOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChsZWZ0ID49IHN0YXJ0Q29sdW1uW2pdWzBdICYmIGxlZnQgPD0gc3RhcnRDb2x1bW5bal1bMV0pIHtib3hMZWZ0ID0gajt9XG4gICAgICAgICAgICBpZiAocmlnaHQgPj0gc3RhcnRDb2x1bW5bal1bMF0gJiYgcmlnaHQgPD0gc3RhcnRDb2x1bW5bal1bMV0pIHtib3hSaWdodCA9IGo7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtib3hMZWZ0LCBib3hSaWdodCwgYm94VG9wLCBib3hCb3R0b219O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY2xvc2VzdCBjZWxsIGdpdmVuIChyb3csIGNvbHVtbikgcG9zaXRpb24gaW4gcHguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFBvc2l0aW9uIENvbnRhaW5zIHRvcC9ib3R0b20vbGVmdC9yaWdodCBib3ggcG9zaXRpb25cbiAgICAgKiAgICAgaW4gcHguXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bVJvd3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtQ29sdW1uc1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgbGV0IGdldENsb3Nlc3RDZWxscyA9IGZ1bmN0aW9uIChjb21wKSB7XG4gICAgICAgIGxldCB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0fSA9IGNvbXA7XG4gICAgICAgIGxldCB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfSA9IGZpbmRJbnRlcnNlY3RlZENlbGxzKGNvbXApO1xuXG4gICAgICAgIGxldCBjb2x1bW47XG4gICAgICAgIGxldCBsZWZ0T3ZlcmxhcDtcbiAgICAgICAgbGV0IHJpZ2h0T3ZlcmxhcDtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVub3VnaCBvdmVybGFwIGZvciBob3Jpem9udGFsIG1vdmUuXG4gICAgICAgIGlmIChib3hMZWZ0ICE9PSB1bmRlZmluZWQgJiYgYm94UmlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGVmdE92ZXJsYXAgPSBNYXRoLmFicyhsZWZ0IC0gc3RhcnRDb2x1bW5bYm94TGVmdF1bMF0pO1xuICAgICAgICAgICAgcmlnaHRPdmVybGFwID0gTWF0aC5hYnMocmlnaHQgLSBzdGFydENvbHVtbltib3hSaWdodF1bMV0gLSBkYXNoZ3JpZC54TWFyZ2luKTtcbiAgICAgICAgICAgIGlmIChsZWZ0T3ZlcmxhcCA8PSByaWdodE92ZXJsYXApIHtjb2x1bW4gPSBib3hMZWZ0O31cbiAgICAgICAgICAgIGVsc2Uge2NvbHVtbiA9IGJveExlZnQgKyAxO31cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb3c7XG4gICAgICAgIGxldCB0b3BPdmVybGFwO1xuICAgICAgICBsZXQgYm90dG9tT3ZlcmxhcDtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGVub3VnaCBvdmVybGFwIGZvciB2ZXJ0aWNhbCBtb3ZlLlxuICAgICAgICBpZiAoYm94VG9wICE9PSB1bmRlZmluZWQgJiYgYm94Qm90dG9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvcE92ZXJsYXAgPSBNYXRoLmFicyh0b3AgLSBzdGFydFJvd1tib3hUb3BdWzBdKTtcbiAgICAgICAgICAgIGJvdHRvbU92ZXJsYXAgPSBNYXRoLmFicyhib3R0b20gLSBzdGFydFJvd1tib3hCb3R0b21dWzFdIC0gZGFzaGdyaWQueU1hcmdpbik7XG4gICAgICAgICAgICBpZiAodG9wT3ZlcmxhcCA8PSBib3R0b21PdmVybGFwKSB7cm93ID0gYm94VG9wO31cbiAgICAgICAgICAgIGVsc2Uge3JvdyA9IGJveFRvcCArIDE7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtyb3csIGNvbHVtbn07XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5mcmVlemUoe1xuICAgICAgICBnZXRDb2x1bW5XaWR0aCxcbiAgICAgICAgZ2V0Um93SGVpZ2h0LFxuICAgICAgICBzZXRDb2x1bW5XaWR0aCxcbiAgICAgICAgc2V0Um93SGVpZ2h0LFxuICAgICAgICBzZXRHcmlkRWxlbWVudEhlaWdodCxcbiAgICAgICAgc2V0R3JpZEVsZW1lbnRXaWR0aCxcbiAgICAgICAgc2V0Qm94RWxlbWVudFhQb3NpdGlvbixcbiAgICAgICAgc2V0Qm94RWxlbWVudFlQb3NpdGlvbixcbiAgICAgICAgc2V0Qm94RWxlbWVudFdpZHRoLFxuICAgICAgICBzZXRCb3hFbGVtZW50SGVpZ2h0LFxuICAgICAgICBmaW5kSW50ZXJzZWN0ZWRDZWxscyxcbiAgICAgICAgc2V0Q2VsbENlbnRyb2lkcyxcbiAgICAgICAgZ2V0Q2xvc2VzdENlbGxzXG4gICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IFJlc2l6ZXI7XG5cbmZ1bmN0aW9uIFJlc2l6ZXIoY29tcCkge1xuICAgIGxldCB7ZGFzaGdyaWQsIHJlbmRlcmVyLCBncmlkfSA9IGNvbXA7XG5cbiAgICBsZXQgbWluV2lkdGgsIG1pbkhlaWdodCwgZWxlbWVudExlZnQsIGVsZW1lbnRUb3AsIGVsZW1lbnRXaWR0aCwgZWxlbWVudEhlaWdodCwgbWluVG9wLCBtYXhUb3AsIG1pbkxlZnQsIG1heExlZnQsIGNsYXNzTmFtZSxcbiAgICBtb3VzZVggPSAwLFxuICAgIG1vdXNlWSA9IDAsXG4gICAgbGFzdE1vdXNlWCA9IDAsXG4gICAgbGFzdE1vdXNlWSA9IDAsXG4gICAgbU9mZlggPSAwLFxuICAgIG1PZmZZID0gMCxcbiAgICBuZXdTdGF0ZSA9IHt9LFxuICAgIHByZXZTdGF0ZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJveFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlXG4gICAgICovXG4gICAgbGV0IHJlc2l6ZVN0YXJ0ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBjbGFzc05hbWUgPSBlLnRhcmdldC5jbGFzc05hbWU7XG5cbiAgICAgICAgLy8gUmVtb3ZlcyB0cmFuc2l0aW9ucywgZGlzcGxheXMgYW5kIGluaXRzIHBvc2l0aW9ucyBmb3IgcHJldmlldyBib3guXG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS56SW5kZXggPSAxMDA0O1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICcnO1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5sZWZ0ID0gYm94Ll9lbGVtZW50LnN0eWxlLmxlZnQ7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLnRvcCA9IGJveC5fZWxlbWVudC5zdHlsZS50b3A7XG4gICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLndpZHRoID0gYm94Ll9lbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBib3guX2VsZW1lbnQuc3R5bGUuaGVpZ2h0O1xuICAgICAgICBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cbiAgICAgICAgLy8gTW91c2UgdmFsdWVzLlxuICAgICAgICBtaW5XaWR0aCA9IHJlbmRlcmVyLmdldENvbHVtbldpZHRoKCk7XG4gICAgICAgIG1pbkhlaWdodCA9IHJlbmRlcmVyLmdldFJvd0hlaWdodCgpO1xuICAgICAgICBsYXN0TW91c2VYID0gZS5wYWdlWDtcbiAgICAgICAgbGFzdE1vdXNlWSA9IGUucGFnZVk7XG4gICAgICAgIGVsZW1lbnRMZWZ0ID0gcGFyc2VJbnQoYm94Ll9lbGVtZW50LnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgZWxlbWVudFRvcCA9IHBhcnNlSW50KGJveC5fZWxlbWVudC5zdHlsZS50b3AsIDEwKTtcbiAgICAgICAgZWxlbWVudFdpZHRoID0gYm94Ll9lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBlbGVtZW50SGVpZ2h0ID0gYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICBncmlkLnVwZGF0ZVN0YXJ0KGJveCk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCkge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVTdGFydCgpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICB1cGRhdGVSZXNpemluZ0VsZW1lbnQoYm94LCBlKTtcbiAgICAgICAgZ3JpZC51cGRhdGluZyhib3gpO1xuXG4gICAgICAgIGlmIChkYXNoZ3JpZC5saXZlQ2hhbmdlcykge1xuICAgICAgICAgICAgLy8gV2hpY2ggY2VsbCB0byBzbmFwIHNoYWRvd2JveCB0by5cbiAgICAgICAgICAgIGxldCB7Ym94TGVmdCwgYm94UmlnaHQsIGJveFRvcCwgYm94Qm90dG9tfSA9IHJlbmRlcmVyLlxuICAgICAgICAgICAgICAgIGZpbmRJbnRlcnNlY3RlZENlbGxzKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBib3guX2VsZW1lbnQub2Zmc2V0TGVmdCArIGJveC5fZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IGJveC5fZWxlbWVudC5vZmZzZXRUb3AgKyBib3guX2VsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV3U3RhdGUgPSB7cm93OiBib3hUb3AsIGNvbHVtbjogYm94TGVmdCwgcm93c3BhbjogYm94Qm90dG9tIC0gYm94VG9wICsgMSwgY29sdW1uc3BhbjogYm94UmlnaHQgLSBib3hMZWZ0ICsgMX07XG5cbiAgICAgICAgICAgIHJlc2l6ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZykge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZygpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgcmVzaXplRW5kID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICBpZiAoIWRhc2hncmlkLmxpdmVDaGFuZ2VzKSB7XG4gICAgICAgICAgICBsZXQge2JveExlZnQsIGJveFJpZ2h0LCBib3hUb3AsIGJveEJvdHRvbX0gPSByZW5kZXJlci5cbiAgICAgICAgICAgICAgICBmaW5kSW50ZXJzZWN0ZWRDZWxscyh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5fZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICByaWdodDogYm94Ll9lbGVtZW50Lm9mZnNldExlZnQgKyBib3guX2VsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogYm94Ll9lbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiBib3guX2VsZW1lbnQub2Zmc2V0VG9wICsgYm94Ll9lbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgbnVtUm93czogZ3JpZC5nZXROdW1Sb3dzKCksXG4gICAgICAgICAgICAgICAgICAgIG51bUNvbHVtbnM6IGdyaWQuZ2V0TnVtQ29sdW1ucygpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHtyb3c6IGJveFRvcCwgY29sdW1uOiBib3hMZWZ0LCByb3dzcGFuOiBib3hCb3R0b20gLSBib3hUb3AgKyAxLCBjb2x1bW5zcGFuOiBib3hSaWdodCAtIGJveExlZnQgKyAxfTtcbiAgICAgICAgICAgIHJlc2l6ZUJveChib3gsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IGJveCBzdHlsZS5cbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBkYXNoZ3JpZC50cmFuc2l0aW9uO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmxlZnQ7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS50b3AgPSBkYXNoZ3JpZC5fc2hhZG93Qm94RWxlbWVudC5zdHlsZS50b3A7XG4gICAgICAgIGJveC5fZWxlbWVudC5zdHlsZS53aWR0aCA9IGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xuXG4gICAgICAgIC8vIEdpdmUgdGltZSBmb3IgcHJldmlld2JveCB0byBzbmFwIGJhY2sgdG8gdGlsZS5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUuekluZGV4ID0gMTAwMztcbiAgICAgICAgICAgIGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIGdyaWQudXBkYXRlRW5kKCk7XG4gICAgICAgIH0sIGRhc2hncmlkLnNuYXBCYWNrVGltZSk7XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemVFbmQpIHtkYXNoZ3JpZC5yZXNpemFibGUucmVzaXplRW5kKCk7fSAvLyB1c2VyIGNiLlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBib3hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZVxuICAgICAqL1xuICAgIGxldCByZXNpemVCb3ggPSBmdW5jdGlvbiAoYm94LCBlKSB7XG4gICAgICAgIGlmIChuZXdTdGF0ZS5yb3cgIT09IHByZXZTdGF0ZS5yb3cgIHx8XG4gICAgICAgICAgICBuZXdTdGF0ZS5jb2x1bW4gIT09IHByZXZTdGF0ZS5jb2x1bW4gIHx8XG4gICAgICAgICAgICBuZXdTdGF0ZS5yb3dzcGFuICE9PSBwcmV2U3RhdGUucm93c3BhbiAgfHxcbiAgICAgICAgICAgIG5ld1N0YXRlLmNvbHVtbnNwYW4gIT09IHByZXZTdGF0ZS5jb2x1bW5zcGFuICkge1xuXG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gZ3JpZC51cGRhdGVCb3goYm94LCBuZXdTdGF0ZSwgYm94KTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlR3JpZERpbWVuc2lvbiBwcmV2aWV3IGJveC5cbiAgICAgICAgICAgIGlmICh1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50WFBvc2l0aW9uKGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBuZXdTdGF0ZS5jb2x1bW4pO1xuICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldEJveEVsZW1lbnRZUG9zaXRpb24oZGFzaGdyaWQuX3NoYWRvd0JveEVsZW1lbnQsIG5ld1N0YXRlLnJvdyk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0Qm94RWxlbWVudFdpZHRoKGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBuZXdTdGF0ZS5jb2x1bW5zcGFuKTtcbiAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRCb3hFbGVtZW50SGVpZ2h0KGRhc2hncmlkLl9zaGFkb3dCb3hFbGVtZW50LCBuZXdTdGF0ZS5yb3dzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdXBkYXRlIGlmIG5vdCBzd2l0Y2hlZCB0byBuZXcgY2VsbC5cbiAgICAgICAgcHJldlN0YXRlLnJvdyA9IG5ld1N0YXRlLnJvdztcbiAgICAgICAgcHJldlN0YXRlLmNvbHVtbiA9IG5ld1N0YXRlLmNvbHVtbjtcbiAgICAgICAgcHJldlN0YXRlLnJvd3NwYW4gPSBuZXdTdGF0ZS5yb3dzcGFuO1xuICAgICAgICBwcmV2U3RhdGUuY29sdW1uc3BhbiA9IG5ld1N0YXRlLmNvbHVtbnNwYW47XG5cbiAgICAgICAgaWYgKGRhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZykge2Rhc2hncmlkLnJlc2l6YWJsZS5yZXNpemluZygpO30gLy8gdXNlciBjYi5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYm94XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVcbiAgICAgKi9cbiAgICBsZXQgdXBkYXRlUmVzaXppbmdFbGVtZW50ID0gZnVuY3Rpb24gKGJveCwgZSkge1xuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgbW91c2UgcG9zaXRpb24uXG4gICAgICAgIG1vdXNlWCA9IGUucGFnZVg7XG4gICAgICAgIG1vdXNlWSA9IGUucGFnZVk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWx0YXNcbiAgICAgICAgbGV0IGRpZmZYID0gbW91c2VYIC0gbGFzdE1vdXNlWCArIG1PZmZYO1xuICAgICAgICBsZXQgZGlmZlkgPSBtb3VzZVkgLSBsYXN0TW91c2VZICsgbU9mZlk7XG4gICAgICAgIG1PZmZYID0gbU9mZlkgPSAwO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBsYXN0IHByb2Nlc3NlZCBtb3VzZSBwb3NpdGlvbnMuXG4gICAgICAgIGxhc3RNb3VzZVggPSBtb3VzZVg7XG4gICAgICAgIGxhc3RNb3VzZVkgPSBtb3VzZVk7XG5cbiAgICAgICAgbGV0IGRZID0gZGlmZlk7XG4gICAgICAgIGxldCBkWCA9IGRpZmZYO1xuXG4gICAgICAgIG1pblRvcCA9IGRhc2hncmlkLnlNYXJnaW47XG4gICAgICAgIG1heFRvcCA9IGRhc2hncmlkLl9lbGVtZW50Lm9mZnNldEhlaWdodCAtIGRhc2hncmlkLnlNYXJnaW47XG4gICAgICAgIG1pbkxlZnQgPSBkYXNoZ3JpZC54TWFyZ2luO1xuICAgICAgICBtYXhMZWZ0ID0gZGFzaGdyaWQuX2VsZW1lbnQub2Zmc2V0V2lkdGggLSBkYXNoZ3JpZC54TWFyZ2luO1xuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtdycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1udycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdycpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50V2lkdGggLSBkWCA8IG1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBlbGVtZW50V2lkdGggLSBtaW5XaWR0aDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRMZWZ0ICsgZFggPCBtaW5MZWZ0KSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtaW5MZWZ0IC0gZWxlbWVudExlZnQ7XG4gICAgICAgICAgICAgICAgbU9mZlggPSBkWCAtIGRpZmZYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudExlZnQgKz0gZGlmZlg7XG4gICAgICAgICAgICBlbGVtZW50V2lkdGggLT0gZGlmZlg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLWUnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtbmUnKSA+IC0xIHx8XG4gICAgICAgICAgICBjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtc2UnKSA+IC0xKSB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50V2lkdGggKyBkWCA8IG1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtaW5XaWR0aCAtIGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgICAgICBtT2ZmWCA9IGRYIC0gZGlmZlg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoICsgZFggPiBtYXhMZWZ0KSB7XG4gICAgICAgICAgICAgICAgZGlmZlggPSBtYXhMZWZ0IC0gZWxlbWVudExlZnQgLSBlbGVtZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgbU9mZlggPSBkWCAtIGRpZmZYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudFdpZHRoICs9IGRpZmZYO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1uJykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW53JykgPiAtMSB8fFxuICAgICAgICAgICAgY2xhc3NOYW1lLmluZGV4T2YoJ2Rhc2hncmlkLWJveC1yZXNpemUtaGFuZGxlLW5lJykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRIZWlnaHQgLSBkWSA8IG1pbkhlaWdodCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gZWxlbWVudEhlaWdodCAtIG1pbkhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRUb3AgKyBkWSA8IG1pblRvcCkge1xuICAgICAgICAgICAgICAgIGRpZmZZID0gbWluVG9wIC0gZWxlbWVudFRvcDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50VG9wICs9IGRpZmZZO1xuICAgICAgICAgICAgZWxlbWVudEhlaWdodCAtPSBkaWZmWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGFzc05hbWUuaW5kZXhPZignZGFzaGdyaWQtYm94LXJlc2l6ZS1oYW5kbGUtcycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zdycpID4gLTEgfHxcbiAgICAgICAgICAgIGNsYXNzTmFtZS5pbmRleE9mKCdkYXNoZ3JpZC1ib3gtcmVzaXplLWhhbmRsZS1zZScpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50SGVpZ2h0ICsgZFkgPCBtaW5IZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBkaWZmWSA9IG1pbkhlaWdodCAtIGVsZW1lbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbU9mZlkgPSBkWSAtIGRpZmZZO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCArIGRZID4gbWF4VG9wKSB7XG4gICAgICAgICAgICAgICAgZGlmZlkgPSBtYXhUb3AgLSBlbGVtZW50VG9wIC0gZWxlbWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBtT2ZmWSA9IGRZIC0gZGlmZlk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50SGVpZ2h0ICs9IGRpZmZZO1xuICAgICAgICB9XG5cbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLnRvcCA9IGVsZW1lbnRUb3AgKyAncHgnO1xuICAgICAgICBib3guX2VsZW1lbnQuc3R5bGUubGVmdCA9IGVsZW1lbnRMZWZ0ICsgJ3B4JztcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLndpZHRoID0gZWxlbWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgYm94Ll9lbGVtZW50LnN0eWxlLmhlaWdodCA9IGVsZW1lbnRIZWlnaHQgKyAncHgnO1xuXG4gICAgICAgIC8vIFNjcm9sbGluZyB3aGVuIGNsb3NlIHRvIGJvdHRvbSBib3VuZGFyeS5cbiAgICAgICAgaWYgKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA8IGRhc2hncmlkLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIC0gZGFzaGdyaWQuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmlubmVySGVpZ2h0IC0gKGUucGFnZVkgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgPCBkYXNoZ3JpZC5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2Nyb2xsaW5nIHdoZW4gY2xvc2UgdG8gcmlnaHQgYm91bmRhcnkuXG4gICAgICAgIGlmIChlLnBhZ2VYIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCAtIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lcldpZHRoIC0gKGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpIDwgZGFzaGdyaWQuc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRhc2hncmlkLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgcmVzaXplU3RhcnQsXG4gICAgICAgIHJlc2l6ZSxcbiAgICAgICAgcmVzaXplRW5kXG4gICAgfSk7XG59XG4iLCIvLyBzaGltIGxheWVyIHdpdGggc2V0VGltZW91dCBmYWxsYmFjayBmb3IgcmVxdWllc3RBbmltYXRpb25GcmFtZVxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uIChjYil7XG4gICAgICAgICAgICBjYiA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2IsIDEwMDAgLyA2MCk7XG4gICAgICAgIH07XG59KSgpO1xuIiwiXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYm94XG4gKiBAcGFyYW0ge3N0cmluZ30gYXQxXG4gKiBAcGFyYW0ge3N0cmluZ30gYXQyXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4TnVtKGJveCwgYXQxLCBhdDIpIHtcbiAgICBsZXQgbWF4VmFsID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYm94Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChib3hbaV1bYXQxXSArIGJveFtpXVthdDJdID49IG1heFZhbCkge1xuICAgICAgICAgICAgbWF4VmFsID0gYm94W2ldW2F0MV0gKyBib3hbaV1bYXQyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXhWYWw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmRlclxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IG9ianNcbiAqIEByZXR1cm5zIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnRlZEFycihvcmRlciwgYXR0ciwgb2Jqcykge1xuICAgIGxldCBrZXk7XG4gICAgbGV0IGFyciA9IFtdO1xuXG4gICAgT2JqZWN0LmtleXMob2JqcykuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpbnNlcnRCeU9yZGVyKG9yZGVyLCBhdHRyLCBvYmpzW2ldLCBhcnIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFycjtcbn1cblxuLyoqXG4gKiBTb3J0IGFycmF5IHdpdGggbmV3bHkgaW5zZXJ0ZWQgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGJveFxuICogQHBhcmFtIHtzdHJpbmd9IGF0MVxuICogQHBhcmFtIHtPYmplY3R9IGF0MlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QnlPcmRlcihvcmRlciwgYXR0ciwgbywgYXJyKSB7XG4gICAgbGV0IGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluc2VydCBieSBvcmRlciwgc3RhcnQgZnVydGhlc3QgZG93bi5cbiAgICAgICAgLy8gSW5zZXJ0IGJldHdlZW4gMCBhbmQgbiAtMS5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKG9yZGVyID09PSAnZGVzYycpIHtcbiAgICAgICAgICAgICAgICBpZiAoby5yb3cgPiBhcnJbaV0ucm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMCwgbyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG8ucm93IDwgYXJyW2ldLnJvdykge1xuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksIDAsIG8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBub3QgaW5iZXR3ZWVuIDAgYW5kIG4gLSAxLCBpbnNlcnQgbGFzdC5cbiAgICAgICAgaWYgKGxlbiA9PT0gYXJyLmxlbmd0aCkge2Fyci5wdXNoKG8pO31cbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRpb25Tb3J0KGEsIGF0dHIpIHtcbiAgICBpZiAoYS5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSA9IGEubGVuZ3RoO1xuICAgIHZhciB0ZW1wO1xuICAgIHZhciBqO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaiA9IGk7XG4gICAgICAgIHdoaWxlIChqID4gMCAmJiBhW2ogLSAxXVthdHRyXSA8IGFbal1bYXR0cl0pIHtcbiAgICAgICAgICAgIHRlbXAgPSBhW2pdO1xuICAgICAgICAgICAgYVtqXSA9IGFbaiAtIDFdO1xuICAgICAgICAgICAgYVtqIC0gMV0gPSB0ZW1wO1xuICAgICAgICAgICAgaiAtPSAxO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2YgcHJvcGVydGllcyBpbiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBPYmplY3RMZW5ndGgob2JqKSB7XG4gICAgbGV0IGxlbmd0aCA9IDAsXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBsZW5ndGggKz0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xufVxuXG4vKipcbiAqIEFkZCBldmVudCwgYW5kIG5vdCBvdmVyd3JpdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV2ZW50SGFuZGxlXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRXZlbnQoZWxlbWVudCwgdHlwZSwgZXZlbnRIYW5kbGUpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCB8fCB0eXBlb2YoZWxlbWVudCkgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlLCBmYWxzZSApO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCAnb24nICsgdHlwZSwgZXZlbnRIYW5kbGUgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50WydvbicgKyB0eXBlXSA9IGV2ZW50SGFuZGxlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgbm9kZXMgZnJvbSBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU5vZGVzKGVsZW1lbnQpIHtcbiAgICB3aGlsZSAoZWxlbWVudC5maXJzdENoaWxkKSB7ZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50LmZpcnN0Q2hpbGQpO31cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAqIEByZXR1cm5zIHtPYmplY3R8Qm9vbGVhbn0gRE9NIGVsZW1lbnQgb2JqZWN0IG9yIGZhbHNlIGlmIG5vdCBmb3VuZC4gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGNsYXNzTmFtZSkge1xuICAgIHdoaWxlIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lLnNlYXJjaChjbGFzc05hbWUpID4gLTEpIHtyZXR1cm4gbm9kZTt9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==
