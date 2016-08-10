// Grid Component.

// Events.
import * as Event from '../lib/events.js';

// States.
import {GridState} from '../state/gridState.js';
import {GridEngineState} from '../state/gridEngineState.js';
import {MouseState} from '../state/mouseState.js';
import {RenderState} from '../state/renderState.js';

// Components.
import {Box} from './box.js';

// Functions.
import {GridEngine} from '../lib/gridEngine.js';
import * as Mouse from '../lib/mouse.js';

export {Grid};

/**
 * High Order Grid Component.
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
 * @returns {Function} update During dragging / resizing.
 * @returns {Function} updateEnd After drag / resize ends.
 * @returns {Function} renderGrid Update grid element.
 */
function Grid(element, gridOptions) {
    let grid = Object.assign({}, {
        component: {
            boxes: []
        },
        state: {
            grid: GridState(gridOptions),
            engine: GridEngineState(),
            render: RenderState(),
            mouse: MouseState({}),
            // resize: ResizeState({})
        },
        element: {
            grid: undefined,
            boxes: undefined,
            vertical: undefined,
            horizontal: undefined,
            centroid: undefined,
            shadowBox: undefined
        },
        events: {
            resize: new WeakMap(),
            click: gridEvents
        }
    });

    return Object.seal(grid);
}

function gridEvents(grid) {
    // TODO, need access to grid component.
    // Initialize events for mouse interaction.
    grid.element.grid.addEventListener('mousedown', function (e) {
        let node = e.target;
        let inputTags = ['select', 'input', 'textarea', 'button'];
        // Exit if:
        // 1. the target has it's own click event or
        // 2. target has onclick attribute or
        // 3. Right / middle button clicked instead of left.
        if (inputTags.indexOf(node.nodeName.toLowerCase()) > -1) {return;}
        if (node.hasAttribute('onclick')) {return;}
        if (e.which === 2 || e.which === 3) {return;}

        if (Event.click.has(e.target)) {
            let box  = Event.click.get(e.target);
            // if (event === 'drag') {
            Mouse.dragEvent({grid, box, e});
            // }
        }

        // mouseDown(e, element);
        e.preventDefault();
    }, false);
}

// // // User event after grid is done loading.
// // if (gridState.onGridReady) {gridState.onGridReady();} // user event.
// return;

function addEvents() {
    // Event listeners.
    addEvent(window, 'resize', () => {
        renderer.setColumnWidth();
        renderer.setRowHeight();
        grid.refreshGrid();
    });
}
