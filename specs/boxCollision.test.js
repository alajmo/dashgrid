var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

import {isNumber, arraysEqual} from './sim-click.js';

export default function boxCollisions(dashGridGlobal, test) {
    // test('Propogated row collision', function (t) {
    //     let differences, prevState;

    //     // Mockup.
    //     let boxes = [
    //         {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3},
    //         {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4},
    //         {'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4}
    //     ];
    //     let grid = dashGridGlobal('#grid', {boxes: boxes});

    //     // Tests.
    //     t.plan(4);

    //     prevState = deepcopy(grid.grid);
    //     grid.updateBox(boxes[0], {row: 1});
    //     t.equal(boxes[0].row, 1, 'Should move.');
    //     t.equal(boxes[1].row, 3, 'Should move.');
    //     t.equal(boxes[2].row, 4, 'Should move.');
    //     differences = diff(grid.grid, prevState);
    //     t.equal(differences.length, 3, 'Only 3 boxes moved.');

    //     t.end();
    // });

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
        // t.plan(4);

        // t.equal(boxes[0].row, 2, 'Should move.');
        // t.equal(boxes[1].row, 4, 'Should move.');
        // t.equal(boxes[2].row, 5, 'Should move.');
        // t.equal(differences.length, 3, 'Should move.');

        // t.end();
    });

    // test('Column collision', function (t) {
    //     let differences, prevState;

    //     // Mockup.
    //     let boxes = [
    //         {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
    //         {'row': 0, 'column': 2, 'rowspan': 2, 'columnspan': 1},
    //         {'row': 1, 'column': 3, 'rowspan': 2, 'columnspan': 1}
    //     ];
    //     let grid = dashGridGlobal('#grid', {boxes: boxes});

    //     // Tests.
    //     grid.updateBox(boxes[0], {column: 2});
    //     differences = diff(grid.grid, prevState);

    //     t.plan(4);

    //     t.equal(boxes[0].column, 2, 'Should move.');
    //     t.equal(boxes[1].row, 2, 'Should move.');
    //     t.equal(boxes[2].row, 2, 'Should move.');
    //     t.equal(differences.length, 3, 'Should move.');

    //     t.end();
    // });

    // test('Complete collision', function (t) {
    //     let differences, prevState;

    //     // Mockup.
    //     let boxes = [
    //         {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
    //         {'row': 2, 'column': 2, 'rowspan': 2, 'columnspan': 2}
    //     ];

    //     let grid = dashGridGlobal('#grid', {boxes: boxes});

    //     // Tests.
    //     t.plan(4);

    //     grid.updateBox(boxes[0], {row: 2, column: 2});
    //     t.equal(boxes[0].row, 2, 'Should move.');
    //     t.equal(boxes[0].column, 2, 'Should move.');
    //     t.equal(boxes[1].row, 4, 'Should move.');
    //     t.equal(boxes[1].column, 2, 'Should move.');

    //     t.end();

    // });

    // test('Collision outside boundary.', function (t) {
    //     let differences, prevState;

    //     // Mockup.
    //     let boxes = [
    //         {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
    //         {'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2}
    //     ];
    //     let grid = dashGridGlobal('#grid', {boxes: boxes, maxRows: 6});

    //     // Tests.
    //     t.plan(2);

    //     grid.updateBox(boxes[0], {row: 1});
    //     t.equal(boxes[0].row, 0, 'Should not move.');
    //     t.equal(boxes[1].row, 2, 'Should not move.');

    //     t.end();
    // });

    // test('Collision from under.', function (t) {
    //     let differences, prevState;

    //     let boxes = [
    //         {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
    //         {'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2}
    //     ];

    //     let grid = dashGridGlobal('#grid', {boxes: boxes, maxRows: 6});

    //     t.plan(8);

    //     grid.updateBox(boxes[1], {row: 1});
    //     t.equal(boxes[0].row, 0, 'Should not move.');
    //     t.equal(boxes[1].row, 2, 'Should not move.');

    //     grid.updateBox(boxes[1], {row: 0});
    //     t.equal(boxes[0].row, 4, 'Should not move.');
    //     t.equal(boxes[1].row, 0, 'Should not move.');

    //     grid.updateBox(boxes[0], {row: 3});
    //     t.equal(boxes[0].row, 4, 'Should not move.');
    //     t.equal(boxes[1].row, 0, 'Should not move.');

    //     grid.updateBox(boxes[0], {row: 0});
    //     t.equal(boxes[0].row, 0, 'Should not move.');
    //     t.equal(boxes[1].row, 2, 'Should not move.');

    //     t.end();
    // });

}
