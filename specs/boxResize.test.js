var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

import {isNumber, arraysEqual} from './sim-click.js';

// TODO: resize columnspan AND rowspan test.
export default function boxResize(dashGridGlobal, test) {
    test('Resize boxes', function (t) {

        // Mockup.
        let differences, prevState;
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3}
        ];
        let grid = dashGridGlobal('#grid', {boxes: boxes});

        t.plan(36);
        /**
         * VALID MOVES.
         */
        // Resize down 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan + 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 4, 'Positive rowspan resize');
        t.equal(differences.length, 1, 'Positive rowspan resize');

        // Resize up 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan - 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 3, 'Negative rowspan resize');
        t.equal(differences.length, 1, 'Negative rowspan resize');

        // Resize down 2 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan + 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 5, 'Positive rowspan resize');
        t.equal(differences.length, 1, 'Positive rowspan resize');

        // Resize up 2 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan - 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, 3, 'Negative rowspan resize');
        t.equal(differences.length, 1, 'Negative rowspan resize');

        // Resize to right 1 columnspan.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan + 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 4, 'Resize 1 step columnspan');
        t.equal(differences.length, 1, 'Resize 1 step columnspan');

        // Resize to left 1 columnspan.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan - 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 3, 'Resize 1 step left');
        t.equal(differences.length, 1, 'Resize 1 step left');

        // Resize to columnspan 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan + 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 5, 'Resize 2 step columnspan');
        t.equal(differences.length, 1, 'Resize 2 step columnspan');

        // Resize to left 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan - 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, 3, 'Resize 2 step columnspan');
        t.equal(differences.length, 1, 'Resize 2 step columnspan');

        /**
         * NONE VALID MOVES.
         */

        // Attempt to Resize part of box outside top border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan - 3});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize 0 rowspan');
        t.equal(differences, undefined, 'Resize 0 rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan - 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize - rowspan');
        t.equal(differences, undefined, 'Resize - rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {rowspan: grid.grid.boxes[0].rowspan + 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].rowspan, prevState.boxes[0].rowspan, 'Resize + rowspan');
        t.equal(differences, undefined, 'Resize + rowspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan - 3});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize 0 columnspan');
        t.equal(differences, undefined, 'Resize 0 columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan - 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan + 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize + columnspan');
        t.equal(differences, undefined, 'Resize + columnspan');

        /**
         * Testing min/max Columnspan and min/max Rowspan.
         */

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan - 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan + 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize + columnspan');
        t.equal(differences, undefined, 'Resize + columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan - 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize - columnspan');
        t.equal(differences, undefined, 'Resize - columnspan');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {columnspan: grid.grid.boxes[0].columnspan + 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].columnspan, prevState.boxes[0].columnspan, 'Resize + columnspan');
        t.equal(differences, undefined, 'Resize + columnspan');

        t.end();
    });

}
