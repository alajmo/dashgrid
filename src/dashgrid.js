import './shims.js';

import Grid from './grid.js';
import Box from "./box.js";
import Render from './renderer.js';
import Mouse from './mouse.js';
import Dragger from './drag.js';
import Resizer from './resize.js';
import {addEvent, removeNodes} from './utils.js';

export default Dashgrid;

/**
 * @param {Object} element The dashgrid element.
 * @param {Object} gs Grid settings.
 */
function Dashgrid(element, gs) {
    let dashgrid = Object.assign({}, dashgridSettings(gs, element));

    let renderer = Render({dashgrid});
    let boxHandler = Box({dashgrid});
    let grid = Grid({dashgrid, renderer, boxHandler});
    let dragger = Dragger({dashgrid, renderer, grid});
    let resizer = Resizer({dashgrid, renderer, grid});
    let mouse = Mouse({dragger, resizer, dashgrid, grid});

    // Initialize.
    grid.init();
    mouse.init();

    // Event listeners.
    addEvent(window, 'resize', () => {
        renderer.setColumnWidth();
        renderer.setRowHeight();
        grid.refreshGrid();
    });

    // User event after grid is done loading.
    if (dashgrid.onGridReady) {dashgrid.onGridReady();} // user event.

    // API.
    return Object.freeze({
        updateBox: grid.updateBox,
        insertBox: grid.insertBox,
        removeBox: grid.removeBox,
        getBoxes: grid.getBoxes,
        refreshGrid: grid.refreshGrid,
        // dashgrid: dashgrid
    });
}

/**
 * Grid properties and events.
 */
function dashgridSettings(gs, element) {
    let dashgrid = {
        _element: (function () {
            element.style.position = 'absolute';
            element.style.display = 'block';
            element.style.zIndex = '1000';
            removeNodes(element);
            return element;
        }()),

        boxes: gs.boxes || [],

        rowHeight: gs.rowHeight,
        numRows: (gs.numRows !== undefined) ? gs.numRows : 6,
        minRows: (gs.minRows !== undefined) ? gs.minRows : 6,
        maxRows: (gs.maxRows !== undefined) ? gs.maxRows : 10,

        extraRows: 0,
        extraColumns: 0,

        columnWidth: gs.columnWidth,
        numColumns: (gs.numColumns !== undefined) ? gs.numColumns : 6,
        minColumns: (gs.minColumns !== undefined) ? gs.minColumns : 6,
        maxColumns: (gs.maxColumns !== undefined) ? gs.maxColumns : 10,

        xMargin: (gs.xMargin !== undefined) ? gs.xMargin : 20,
        yMargin: (gs.yMargin !== undefined) ? gs.yMargin : 20,

        defaultBoxRowspan: 2,
        defaultBoxColumnspan: 1,

        minRowspan: (gs.minRowspan !== undefined) ? gs.minRowspan : 1,
        maxRowspan: (gs.maxRowspan !== undefined) ? gs.maxRowspan : 9999,

        minColumnspan: (gs.minColumnspan !== undefined) ? gs.minColumnspan : 1,
        maxColumnspan: (gs.maxColumnspan !== undefined) ? gs.maxColumnspan : 9999,

        pushable: (gs.pushable === false) ? false : true,
        floating: (gs.floating === true) ? true : false,
        stacking: (gs.stacking === true) ? true : false,
        swapping: (gs.swapping === true) ? true : false,
        animate: (gs.animate === true) ? true : false,

        liveChanges: (gs.liveChanges === false) ? false : true,

        // Drag handle can be a custom classname or if not set revers to the
        // box container with classname 'dashgrid-box'.
        draggable: {
                enabled: (gs.draggable && gs.draggable.enabled === false) ? false : true,
                handle: (gs.draggable && gs.draggable.handle) || 'dashgrid-box',

                // user cb's.
                dragStart: gs.draggable && gs.draggable.dragStart,
                dragging: gs.draggable && gs.draggable.dragging,
                dragEnd: gs.draggable && gs.draggable.dragEnd
        },

        resizable: {
            enabled: (gs.resizable && gs.resizable.enabled === false) ? false : true,
            handle: (gs.resizable && gs.resizable.handle) || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: (gs.resizable &&  gs.resizable.handleWidth !== undefined) ? gs.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: gs.resizable && gs.resizable.resizeStart,
            resizing: gs.resizable && gs.resizable.resizing,
            resizeEnd: gs.resizable && gs.resizable.resizeEnd
        },

        onUpdate: () => {},

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapBackTime: (gs.snapBackTime === undefined) ? 300 : gs.snapBackTime,

        showGridLines: (gs.showGridLines === false) ? false : true,
        showGridCentroids: (gs.showGridCentroids === false) ? false : true
    };

    dashgrid._boxesElement = (function () {
            let boxesElement = document.createElement('div');
            boxesElement.className = 'dashgrid-boxes';
            dashgrid._element.appendChild(boxesElement);
            return boxesElement;
        }());

    return dashgrid;
}
