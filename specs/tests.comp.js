import test from 'tape';

import { decorateRunAll } from './sim-click.js';
import initGrid from './initGrid.test.js';
import boxInsert from './boxInsert.test.js';
import boxMove from './boxMove.test.js';
import boxCollision from './boxCollision.test.js';
import boxResize from './boxResize.test.js';
import gridResize from './gridResize.test.js';
import dragger from './dragger.test.js';

export default function tests(dashGridGlobal) {

    // Individual Tests.
    let t = {
        initGrid: () => {
            initGrid(dashGridGlobal, test);
        },
        boxMove: () => {
            boxMove(dashGridGlobal, test);
        },
        boxResize: () => {
            boxResize(dashGridGlobal, test);
        }
    };

    // boxInsert: () => {boxInsert(dashGridGlobal, test)},
    // boxRemove: () => {boxRemove(dashGridGlobal, test)},
    // boxCollision: () => {boxCollision(dashGridGlobal, test)},
    // propertyToggle: () => {propertyToggle(dashGridGlobal, test)},
    // gridResize: () => {gridResize(dashGridGlobal, test)},
    // dragger: () => {dragger(dashGridGlobal, test)}
    decorateRunAll(t, dashGridGlobal, test);

    return t;
}

/*
    UNIT TESTS:

        Moving
            - in-bound
            - out-of-bound
            - bottom when room to move
            - dragging disabled, globally and box-wise
            - moving while floating

        Resizing
            - in-bound
            - out-of-bound
            - bottom when room to move
            - resize disabled, globally and box-wise
            - resizing while floating

        Collisions

        Inserting box
            - Insert valid
            - Insert false

        Removing box
            - Insert valid
            - Insert false

        Properties initialized correctly
            -

        Properties in effect when toggled
            -
*/
