import Render from './gridRender.js';
import MouseHandler from './mouseHandler.js';
import DragHandler from './dragHandler.js';
import ResizeHandler from './resizeHandler.js';
import {gridEngine} from './gridEngine.js';
import {gridDraw} from './gridDraw.js';
import {boxSpec} from './box.js';

function gridSpec(spec) {
    let grid = {
        element: spec.element,

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
        liveChanges: 'yes',

        // Misc
        displayGrid: true
    };

    return Object.seal({grid});
}

export function Grid(spec) {
    let {grid} = gridSpec({element: spec.element});

    /**
     * Constructors.
     */
    let previewBoxElement = createPreviewBox();

    let renderer = Render(grid);

    let drawer = gridDraw({
        grid: grid,
        renderer: renderer
    });

    let engine = gridEngine({
        grid: grid,
        renderer: renderer,
        drawer: drawer
    });

    let dragger = DragHandler({
        renderer: renderer,
        grid: grid,
        moveBox: engine.moveBox,
        getNumRows: engine.getNumRows,
        getNumColumns: engine.getNumColumns,
        setMovingBox: engine.setMovingBox,
        updateNumRows: engine.updateNumRows,
        previewBoxElement: previewBoxElement
    });

    let resizer = ResizeHandler();

    let mouse = MouseHandler({dragger: dragger, resizer: resizer});

    let start = function () {
        spec.boxes.forEach(function (box) {
            engine.insertBox({box: createBox(box)});
        });
        engine.initializeEngine();
    };

    /**
     * @desc Insert box to grid.
     * @param object box
     */
    let createBox = function (box) {
        let boxElement = document.createElement('div');
        boxElement.id = box.id;
        boxElement.className = 'grid-box';
        grid.element.appendChild(boxElement);
        return boxSpec(Object.assign(box, {element: boxElement})).member;
    };

    /**
     * @desc
     * @returns {DOM object}
     */
    function createPreviewBox () {
        previewBoxElement = document.createElement('div');
        previewBoxElement.id = 'preview-box';
        previewBoxElement.className = 'grid-preview-box';
        grid.element.appendChild(previewBoxElement);

        return previewBoxElement;
    };

    /**
     * Event listeners.
     */
    mouse.addEvent({element: grid.element});

    window.addEventListener('resize', function () {
        engine.initializeEngine();
    });

    return Object.freeze({
        start
    });
}
