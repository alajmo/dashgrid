var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

import {isNumber, arraysEqual} from '../util.js';

export default function boxAddRemove(dashGridGlobal, test) {

    test('Valid box inserts', function (t) {
        // Mockup.
        let differences, prevState;
        let boxes = [{row: 0, column: 0, rowspan: 3, columnspan: 3}];
        let grid = dashGridGlobal('#grid', {boxes: boxes});

        t.plan(4);
        /**
         * Valid Add / Remove.
         */
        prevState = deepcopy(grid.grid);
        grid.insertBox({row: 0, column: 0, rowspan: 1, columnspan: 1});
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 2, 'Inserted box on a non-empty cell');

        prevState = deepcopy(grid.grid);
        grid.insertBox({row: 4, column: 4, rowspan: 1, columnspan: 1});
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 1, 'Inserted box on an empty cell');

        prevState = deepcopy(grid.grid);
        grid.removeBox(1);
        differences = diff(grid.grid, prevState);
        // TODO: checkout difference
        t.equal(differences.length, 3, 'Removing an inserted box');

        prevState = deepcopy(grid.grid);
        grid.removeBox(0);
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 5, 'Removing an initial box');

        t.end();
    });
}
