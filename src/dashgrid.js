import './shims.js';

import Engine from './engine.js';
import Box from "./box.js";
import Render from './renderer.js';
import Drawer from './drawer.js';
import Mouse from './mouse.js';
import Dragger from './drag.js';
import Resizer from './resize.js';
import {addEvent, removeNodes} from './utils.js';

export default Dashgrid;

/**
 * @param {Object} element The grid element.
 * @param {Object} gs Grid settings.
 */
function Dashgrid(element, gs) {
    let grid = Object.assign({}, gridSettings(gs, element));

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
    let grid = {
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

        draggable: {
                enabled: (gs.draggable && gs.draggable.enabled === false) ? false : true,
                handles: (gs.draggable && gs.draggable.handles) || undefined,

                // user cb's.
                dragStart: gs.draggable && gs.draggable.dragStart,
                dragging: gs.draggable && gs.draggable.dragging,
                dragEnd: gs.draggable && gs.draggable.dragEnd
        },

        resizable: {
            enabled: (gs.resizable && gs.resizable.enabled === false) ? false : true,
            handles: (gs.resizable && gs.resizable.handles) || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: (gs.resizable &&  gs.resizable.handleWidth !== undefined) ? gs.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: gs.resizable && gs.resizable.resizeStart,
            resizing: gs.resizable && gs.resizable.resizing,
            resizeEnd: gs.resizable && gs.resizable.resizeEnd
        },

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapbacktime: (gs.snapbacktime === undefined) ? 300 : gs.snapbacktime,
        displayGrid: (gs.displayGrid === false) ? false : true
    };

    return grid;
}
