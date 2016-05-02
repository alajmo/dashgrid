var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

import {isNumber, arraysEqual} from '../util.js';

export default function boxCollisions(dashGridGlobal, test) {
    test('Propogated row collision', function (t) {
        let differences, prevState;

        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3},
            {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4},
            {'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4}
        ];
        let grid = dashGridGlobal('#grid', {boxes: boxes});

        // Tests.
        t.plan(4);

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {row: 1});
        t.equal(boxes[0].row, 1, 'Should move.');
        t.equal(boxes[1].row, 3, 'Should move.');
        t.equal(boxes[2].row, 4, 'Should move.');
        differences = diff(grid.grid, prevState);
        t.equal(differences.length, 3, 'Only 3 boxes moved.');

        t.end();
    });

    test('Another simple collision', function (t) {
        // Mockup.
        let differences, prevState;

        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3},
            {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4},
            {'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4}
        ];
        let grid = dashGridGlobal('#grid', {boxes: boxes});

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {row: 2});
        differences = diff(grid.grid, prevState);

        // Tests.
        t.plan(4);

        t.equal(boxes[0].row, 2, 'Should move.');
        t.equal(boxes[1].row, 4, 'Should move.');
        t.equal(boxes[2].row, 5, 'Should move.');
        t.equal(differences.length, 3, 'Should move.');

        t.end();
    });

    test('Column collision', function (t) {
        let differences, prevState;

        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 0, 'column': 2, 'rowspan': 2, 'columnspan': 1},
            {'row': 1, 'column': 3, 'rowspan': 2, 'columnspan': 1}
        ];
        let grid = dashGridGlobal('#grid', {boxes: boxes});

        // Tests.
        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {column: 2});
        differences = diff(grid.grid, prevState);

        t.plan(4);

        t.equal(boxes[0].column, 2, 'Should move.');
        t.equal(boxes[1].row, 2, 'Should move.');
        t.equal(boxes[2].row, 2, 'Should move.');
        t.equal(differences.length, 3, 'Should move.');

        t.end();
    });

    test('Complete collision', function (t) {
        let differences, prevState;

        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 2, 'column': 2, 'rowspan': 2, 'columnspan': 2}
        ];

        let grid = dashGridGlobal('#grid', {boxes: boxes});

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {row: 2, column: 2});
        differences = diff(grid.grid, prevState);

        // Tests.
        t.plan(5);
        t.equal(boxes[0].row, 2, 'Should move.');
        t.equal(boxes[0].column, 2, 'Should move.');
        t.equal(boxes[1].row, 4, 'Should move.');
        t.equal(boxes[1].column, 2, 'Should move.');
        t.equal(differences.length, 3, 'Should move.');
        t.end();
    });

    test('Collision outside boundary.', function (t) {
        let differences, prevState;

        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2}
        ];
        let grid = dashGridGlobal('#grid', {boxes: boxes, maxRows: 6});

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {row: 1});
        differences = diff(grid.grid, prevState);

        // Tests.
        t.plan(3);

        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');
        t.equal(differences, undefined, 'Should not move.');

        t.end();
    });

    test('Collision from under.', function (t) {
        let differences, prevState;

        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2}
        ];

        let grid = dashGridGlobal('#grid', {boxes: boxes, maxRows: 6});
        t.plan(12);

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[1], {row: 1});
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');
        t.equal(differences, undefined, 'Should not move.');

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[1], {row: 0});
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 4, 'Should move.');
        t.equal(boxes[1].row, 0, 'Should move.');
        t.equal(differences.length, 2, 'Should not move.');

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {row: 3});
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 4, 'Should not move.');
        t.equal(boxes[1].row, 0, 'Should not move.');
        t.equal(differences, undefined, 'Should not move.');

        prevState = deepcopy(grid.grid);
        grid.updateBox(boxes[0], {row: 0});
        differences = diff(grid.grid, prevState);
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');
        t.equal(differences.length, 2, 'Should not move.');

        t.end();
    });

}