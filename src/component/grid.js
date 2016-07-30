// Grid.
import {GridState} from '../state/gridState.js';
import {GridElement} from '../element/gridElement.js';
import {GridVisuals} from '../element/gridVisuals.js';

// Grid Engine.
import {GridEngineState} from '../state/gridEngineState.js';
import {GridEngine} from '../node/gridEngine.js';

// Functionality.
import {DragState} from '../node/drag.js';
import {Resize} from '../node/resize.js';
import {mouse} from '../node/mouse.js';

// Box.
import {Box} from './box.js';
import {ShadowBoxElement} from '../element/shadowBoxElement.js';

// Render.
import {render} from '../element/render/render.js';

export {
    Grid
};

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
        state: {
            grid: GridState(gridOptions),
            engine: GridEngineState(),
            render: RenderState(),
            drag: DragState({gridState}),
            boxes: []
        },
        element: {
            grid: GridElement(element)
        },
        events: new WeakMap()
    });

    return grid;
}

function gridEvents() {
    // Initialize events for mouse interaction.
    gridElement.element.addEventListener('mousedown', function (e) {
        let node = e.target;
        let inputTags = ['select', 'input', 'textarea', 'button'];
        // Exit if:
        // 1. the target has it's own click event or
        // 2. target has onclick attribute or
        // 3. Right / middle button clicked instead of left.
        if (inputTags.indexOf(node.nodeName.toLowerCase()) > -1) {return;}
        if (node.hasAttribute('onclick')) {return;}
        if (e.which === 2 || e.which === 3) {return;}

        if (grid.events.has(e.target)) {
            let {box, event} = grid.events.get(e.target);
            if (event === 'drag') {
                dragEvent({grid, box, e});
            }
        }

        // mouseDown(e, element);
        e.preventDefault();
    }, false);
}
