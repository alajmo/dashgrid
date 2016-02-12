/**
 * grid.js
 */

import './shims.js';

import Engine from './engine.js';
import Box from "./box.js";
import Render from './renderer.js';
import Drawer from './drawer.js';
import Mouse from './mouse.js';
import Dragger from './drag.js';
import Resizer from './resize.js';
import {addEvent, removeNodes} from './utils.js';

/**
 * Initializes grid.
 * @param {String} cs Css selector.
 * @param {Object} g Settings for grid.
 */
export default function Grid(cs, gs) {
    let grid = Object.assign({}, gridSettings(gs, cs));

    let renderer = Render({grid});
    let boxHandler = Box({grid});
    let drawer = Drawer({grid, renderer});
    let engine = Engine({grid, renderer, drawer, boxHandler});
    let dragger = Dragger({grid, renderer, engine});
    let resizer = Resizer({grid, renderer, engine});
    let mouse = Mouse({dragger, resizer, grid, engine});

    // Initialize.
    drawer.initialize();
    engine.initialize();
    mouse.initialize();

    // Event listeners.
    addEvent(window, 'resize', engine.refreshGrid);

    // Api.
    return Object.freeze({
        updateBox: engine.updateBox,
        insertBox: engine.insertBoxAndRefresh,
        removeBox: engine.removeBoxAndRefresh,
        getBoxes: engine.getBoxes,
        grid: grid
    });
}

/**
 * Grid properties and events.
 */
function gridSettings(gs, cs) {

    let grid = {
        element: (function () {
            let el = document.getElementById(cs.replace('#', ''));
            el.style.position = 'absolute';
            el.style.display = 'block';
            el.style.zIndex = '1000';
            removeNodes(el);
            return el;
        }()),

        boxes: gs.boxes || [],

        rowHeight: gs.rowHeight,
        numRows: (gs.numRows !== undefined) ? gs.numRows : 6,
        minRows: (gs.minRows !== undefined) ? gs.minRows : 6,
        maxRows: (gs.maxRows !== undefined) ? gs.maxRows : 10,

        columnWidth: gs.columnWidth,
        numColumns: (gs.numColumns !== undefined) ? gs.numColumns : 6,
        minColumns: (gs.minColumns !== undefined) ? gs.minColumns : 6,
        maxColumns: (gs.maxColumns !== undefined) ? gs.maxColumns : 10,

        xMargin: (gs.xMargin !== undefined) ? gs.xMargin : 20,
        yMargin: (gs.yMargin !== undefined) ? gs.yMargin : 20,

         // defaultSizeX: 2, // the default width of a gridster item, if not specifed
         // defaultSizeY: 1, // the default height of a gridster item, if not specified

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

        mobileBreakPoint: 600,
        mobileBreakPointEnabled: false,

        draggable: {
                enabled: (gs.draggable && gs.draggable.enabled === false) ? false : true,
                handles: (gs.draggable && gs.draggable.handles) || undefined,

                // user cb's.
                dragStart: gs.draggable && gs.draggable.dragStart,
                dragging: gs.draggable && gs.draggable.dragging,
                dragEnd: gs.draggable && gs.draggable.dragEnd
        },

        resizable: {
            enabled: (gs.draggable && gs.resizable.enabled === false) ? false : true,
            handles: (gs.draggable && gs.resizable.handles) || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: (gs.draggable &&  gs.draggable.handleWidth !== undefined) ? gs.draggable.handleWidth : 10,

            // user cb's.
            resizeStart: gs.draggable && gs.resizable.resizeStart,
            resizing: gs.draggable && gs.resizable.resizing,
            resizeEnd: gs.draggable && gs.resizable.resizeEnd
        },

        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapbacktime: (gs.snapbacktime === undefined) ? 300 : gs.snapbacktime,
        displayGrid: (gs.displayGrid === false) ? false : true
    };

    return grid;
}
