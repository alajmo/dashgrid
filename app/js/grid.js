import Render from './gridRender.js';
import GridEngine from './gridEngine.js';
import MouseHandler from './mouseHandler.js';
import DragHandler from './dragHandler.js';
import ResizeHandler from './resizeHandler.js';
import GridDraw from './gridDraw.js';

export function gridGlobalFunc(cssSelector, gridExpose) {
    // Expose gridExpose to user.
    gridExpose.api = {};
    gridExpose.boxApi = {};

    let grid = gridParams({
        element: document.getElementById(cssSelector.replace('#', '')),
        boxes: gridExpose.boxes
    });

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
        moveBox: engine.moveBox,
        getNumRows: engine.getNumRows,
        getNumColumns: engine.getNumColumns,
        setActiveBox: engine.setActiveBox,
        updateNumRows: engine.updateNumRows
    });

    let resizer = ResizeHandler({
        grid: grid,
        renderer: renderer,
        resizeBox: engine.resizeBox,
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
    mouse.addMouseEvents({element: grid.element});

    window.addEventListener('resize', function () {
        engine.refreshGrid();
    });
}

function gridParams(obj) {
    let {element, boxes} = obj;

    return {
        element: element,
        boxes: boxes || [],
        // Grid size options.
        width: 'inherit',
        height: '800',

        cellWidth: 3,
        cellHeight: 3,

        minRows: 3,
        minColumns: 3,

        maxRows: 30,
        maxColumns: 100,

        // Margins
        outerMargin: false,
        xMargin: 20,
        yMargin: 20,

        // Box options.
        boxHeight: 'auto',
        defaultBoxWidth: 2,
        defaultBoxHeight: 2,

        minBoxWidth: 1,
        minBoxHeight: 1,
        maxBoxWidth: 5,
        maxBoxHeight: 5,

        // Grid behavior.
        floating: true,
        swapping: false,
        stacking: false,
        pushable: true,
        animate: true,

        // Live Changes, delay in ms.
        liveChanges: 'dragging',
        dragDelay: 2000,

        // Misc
        displayGrid: true
    };
}
