/**
 * grid.js: Grid constructor.
 */

import GridEngine from "./gridEngine.js";
import Render from "./gridRender.js";
import GridDraw from "./gridDraw.js";
import MouseHandler from "./mouseHandler.js";
import DragHandler from "./dragHandler.js";
import ResizeHandler from "./resizeHandler.js";

/**
 * Initializes grid.
 */
export default function Grid(cssSelector, gridExpose) {
    // Expose gridExpose to user.
    gridExpose.api = {};
    gridExpose.boxApi = {};

    let grid = {
        element: (() => {
            let element = document.getElementById(
                cssSelector.
                replace("#", "")
            );
            element.style.position = "absolute";
            element.style.display = "block";
            element.style.zIndex = "1000";

            return element;
        }()),
        boxes: gridExpose.boxes || []
    };

    Object.assign(grid, gridParams(gridExpose));

    /**
     *  Constructors.
     *  Order in which constructors are placed matters.
     */
    let renderer = Render(grid);

    let drawer = GridDraw({
        grid: grid,
        renderer: renderer
    });

    let engine = GridEngine({
        grid: grid,
        renderer: renderer,
        drawer: drawer
    });

    let dragger = DragHandler({
        grid: grid,
        renderer: renderer,
        updateBox: engine.updateBox,
        getBox: engine.getBox,
        getNumRows: engine.getNumRows,
        getNumColumns: engine.getNumColumns,
        setActiveBox: engine.setActiveBox,
        updateNumRows: engine.updateNumRows
    });

    let resizer = ResizeHandler({
        grid: grid,
        renderer: renderer,
        updateBox: engine.updateBox,
        getBox: engine.getBox,
        getNumRows: engine.getNumRows,
        getNumColumns: engine.getNumColumns,
        setActiveBox: engine.setActiveBox,
        updateNumRows: engine.updateNumRows
    });

    let mouse = MouseHandler({dragger: dragger, resizer: resizer});

    /**
     *  Initialize.
     */
    drawer.initialize()
    engine.initialize();

    /**
     *  Event listeners.
     */
    mouse.addMouseEvents(grid.element);
    window.addEventListener("resize", () => engine.refreshGrid());

    /**
     * Expose API.
     */
     gridExpose.api.updateBox = engine.updateBox;
}

/**
 * Grid properties and events.
 */
function gridParams(obj) {
    return {
        // Grid size options.
        width: () => {
            if (Number(obj.width)) {
                return obj.width;
            }

            return "inherit";
        }(),

        height: () => {
            if (Number(obj.height)) {
                return obj.height;
            } else if (obj.height === "match") {
                return "match";
            }

            return "inherit";
        }(),

        minRows: (obj.minRows !== undefined) ? obj.minRows : 6,
        minColumns: (obj.minColumns !== undefined) ? obj.minColumns : 6,

        maxRows: (obj.maxRows !== undefined) ? obj.maxRows : 10,
        maxColumns: (obj.maxColumns !== undefined) ? obj.maxColumns : 10,

        // Margins
        outerMargin: (obj.outerMargin === false) ? false : true,

        xMargin: (obj.xMargin !== undefined) ? obj.xMargin : 20,
        yMargin: (obj.yMargin !== undefined) ? obj.yMargin : 20,

        // Box options.
        boxHeight: (obj.boxHeight !== undefined) ? obj.boxHeight : "auto",

        minBoxWidth: (obj.minBoxWidth !== undefined) ? obj.minBoxWidth : 1,
        minBoxHeight: (obj.minBoxHeight !== undefined) ? obj.minBoxHeight : 1,
        maxBoxWidth: (obj.maxBoxWidth !== undefined) ? obj.maxBoxWidth : 3,
        maxBoxHeight: (obj.maxBoxHeight !== undefined) ? obj.maxBoxHeight : 3,

        // Grid behavior actively on a box.
        draggable: {
            enabled: (obj.draggable === false) ? false : true,
            handle: "className",
            start: function(event, elem, widget) {},
            drag: function(event, elem, widget) {},
            stop: function(event, elem, widget) {}
        },

        resizable: {
            enabled: (obj.resizable === false) ? false : true,
            handles: ["n", "e", "s", "w", "ne", "se", "sw", "nw"],
            start: function(event, elem, widget) {},
            resize: function(event, elem, widget) {},
            stop: function(event, elem, widget) {}
        },

        // Indirect behavior on a box.
        pushable: (obj.pushable === false) ? false : true,
        floating: (obj.floating === true) ? true : false,
        stacking: (obj.stacking === true) ? true : false,
        swapping: (obj.swapping === true) ? true : false,

        animate: (obj.animate === true) ? true : false,

        // Live Changes, delay in ms.
        liveChanges: (obj.liveChanges === false) ? false : true,

        // Mobile break point.
        mobileBreakPoint: 600,
        mobileBreakPointEnabled: false,

        // Misc
        displayGrid: (obj.displayGrid === false) ? false : true
    };
}
