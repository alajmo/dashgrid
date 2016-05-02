import test from 'tape';

// Dashgrid.
import './demo.css';
import dashGridGlobal from '../dist/dashgrid.js';

// Util.
import {decorateRunAll} from './util.js';

// Tests.
import initGrid from './tests/initGrid.test.js';
import boxAddRemove from './tests/boxAddRemove.test.js';
import boxMove from './tests/boxMove.test.js';
import boxCollisions from './tests/boxCollision.test.js';
import boxResize from './tests/boxResize.test.js';
import gridResize from './tests/gridResize.test.js';
import dragger from './tests/dragger.test.js';

document.addEventListener('DOMContentLoaded', function() {
    tests();
});

/** Testing is done feature wise:
 *    Move / resize box:
 *        - Inside border edge.
 *        - Outside border edge.
 *        - Dragging disabled, globally and box-wise.
 *        - Collisions.
 *
 *    Insert / remove box:
 *        - Valid insert.
 *        - Non-valid insert.
 *
 *    Toggle properties:
 *        - Initialization.
 */
function tests (){
    let t = {
        initGrid: () => {initGrid(dashGridGlobal, test)},
        boxMove: () => {boxMove(dashGridGlobal, test)},
        boxResize: () => {boxResize(dashGridGlobal, test)},
        boxAddRemove: () => {boxAddRemove(dashGridGlobal, test)},
        boxCollisions: () => {boxCollisions(dashGridGlobal, test)},
        // propertyToggle: () => {propertyToggle(dashGridGlobal, test)}
    };

    decorateRunAll(t, dashGridGlobal, test);

    // t.initGrid();
    // t.boxMove();

}
