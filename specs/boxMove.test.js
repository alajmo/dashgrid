var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

import {isNumber, arraysEqual} from './sim-click.js';

// TODO: move row AND column.

export default function boxMove(dashGridGlobal, test) {

    test('Move boxes', function (t) {

        // Mockup.
        let differences, prevState;
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3}
        ];
        let grid = dashGridGlobal('#grid', {boxes: boxes});

        t.plan(28);
        /**
         * Moving inside boundary.
         */
        // Move down 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row + 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 1, 'Move down 1 step');
        t.equal(differences.length, 1, 'Move down 1 step');

        // Move up 1 row.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row - 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move up 1 step');
        t.equal(differences.length, 1, 'Move down 1 step');

        // Move down 2 rows.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row + 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 2, 'Move up 2 step');
        t.equal(differences.length, 1, 'Move down 2 step');

        // Move up 2 rows.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row - 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move up 2 step');
        t.equal(differences.length, 1, 'Move down 2 step');

        // Move to right 1 column.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column + 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 1, 'Move 1 step right');
        t.equal(differences.length, 1, 'Move 1 step right');

        // Move to left 1 column.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column - 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step left');
        t.equal(differences.length, 1, 'Move 1 step left');

        // Move to right 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column + 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 2, 'Move 2 step right');
        t.equal(differences.length, 1, 'Move 2 step right');

        // Move to left 2 columns.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column - 2});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 2 step left');
        t.equal(differences.length, 1, 'Move 2 step left');

        /**
         * Out-of-bound up-down left-right
         */
        // Attempt to move part of box outside top border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row - 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row - 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move out of bound row-wise (+).
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {row: grid.grid.boxes[0].row + 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].row, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move part of box outside left border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column - 1});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move whole box outside left border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column - 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        // Attempt to move whole box outside right border.
        prevState = deepcopy(grid.grid);
        grid.updateBox(grid.grid.boxes[0], {column: grid.grid.boxes[0].column + 9999});
        differences = diff(grid.grid, prevState);
        t.equal(grid.grid.boxes[0].column, 0, 'Move 1 step north outside boundary');
        t.equal(differences, undefined, 'Move 1 step north outside boundary');

        t.end();
    });

}
