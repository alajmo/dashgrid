export function basicTests(test) {

    test('Resizing a box', function (t) {
        t.plan(12);

        /**
         * In-bound increase / decrease rowspan / columnspan
         */
        // Increase rowspan by 1.
        let oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan + 1});
        t.equal(boxes[0].rowspan, oldRowspan + 1);

        // Decrease rowspan by 1.
        oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan - 1});
        t.equal(boxes[0].rowspan, oldRowspan - 1);

        // Increase rowspan by 2.
        oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan + 2});
        t.equal(boxes[0].rowspan, oldRowspan + 2);

        // Decrease rowspan by 2.
        oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan - 2});
        t.equal(boxes[0].rowspan, oldRowspan - 2);

        // Increase columnspan by 1.
        let oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan + 1});
        t.equal(boxes[0].columnspan, oldColumnspan + 1);

        // Decrease columnspan by 1.
        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan - 1});
        t.equal(boxes[0].columnspan, oldColumnspan - 1);

        // Increase columnspan by 2.
        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan + 2});
        t.equal(boxes[0].columnspan, oldColumnspan + 2);

        // Decrease columnspan by 2.
        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan - 2});
        t.equal(boxes[0].columnspan, oldColumnspan - 2);

        /**
         * Out-of-bound increase / decrease rowspan / columnspan
         */

        oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan + 9999});
        t.equal(boxes[0].rowspan, oldRowspan, 'Should not increase rowspan outside south boundary.');

        oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan - 9999});
        t.equal(boxes[0].rowspan, oldRowspan, 'Should not decrease rowspan below 1');

        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan + 9999});
        t.equal(boxes[0].columnspan, oldColumnspan, 'Should not increase columnspan outside east boundary.');

        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan - 9999});
        t.equal(boxes[0].columnspan, oldColumnspan, 'Should not decrease columnspan below 1.');

        t.end();
    });
}

// import {basicTests} from '../../tests/grid.test.js';
// import {collisionTest} from '../../tests/collision.test.js';
// import {insertTest} from '../../tests/box.test.js';

// basicTests(test);
// collisionTest(test);
// insertTest(test);

export function engineTest(test) {

    test('Propogated row collision', function (t) {
        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3},
            {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4},
            {'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4}
        ];
        let grid = {boxes: boxes};
        dashGridGlobal('#grid', grid);

        // Tests.
        t.plan(3);

        grid.api.updateBox(boxes[0], {row: 1});
        t.equal(boxes[0].row, 1, 'Should move.');
        t.equal(boxes[1].row, 3, 'Should move.');
        t.equal(boxes[2].row, 4, 'Should move.');

        t.end();
    });

    test('Another simple collision', function (t) {
        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 3},
            {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 4},
            {'row': 3, 'column': 0, 'rowspan': 1, 'columnspan': 4}
        ];
        let grid = {boxes: boxes};
        dashGridGlobal('#grid', grid);

        // Tests.
        t.plan(3);

        grid.api.updateBox(boxes[0], {row: 2});
        t.equal(boxes[0].row, 2, 'Should move.');
        t.equal(boxes[1].row, 4, 'Should move.');
        t.equal(boxes[2].row, 5, 'Should move.');

        t.end();
    });

    test('Column collision', function (t) {
        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 0, 'column': 2, 'rowspan': 2, 'columnspan': 1},
            {'row': 1, 'column': 3, 'rowspan': 2, 'columnspan': 1}
        ];
        let grid = {boxes: boxes};
        dashGridGlobal('#grid', grid);

        // Tests.
        t.plan(3);

        grid.api.updateBox(boxes[0], {column: 2});
        t.equal(boxes[0].column, 2, 'Should move.');
        t.equal(boxes[1].row, 2, 'Should move.');
        t.equal(boxes[2].row, 2, 'Should move.');

        t.end();
    });

    test('Complete collision', function (t) {
        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 2, 'column': 2, 'rowspan': 2, 'columnspan': 2}
        ];

        let grid = {boxes: boxes};
        dashGridGlobal('#grid', grid);

        // Tests.
        t.plan(4);

        grid.api.updateBox(boxes[0], {row: 2, column: 2});
        t.equal(boxes[0].row, 2, 'Should move.');
        t.equal(boxes[0].column, 2, 'Should move.');
        t.equal(boxes[1].row, 4, 'Should move.');
        t.equal(boxes[1].column, 2, 'Should move.');

        t.end();

    });

    test('Collision outside boundary.', function (t) {
        // Mockup.
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2}
        ];

        let grid = {boxes: boxes, maxRows: 6};
        dashGridGlobal('#grid', grid);

        // Tests.
        t.plan(2);

        grid.api.updateBox(boxes[0], {row: 1});
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');

        t.end();
    });

    test('Collision from under.', function (t) {
        let boxes = [
            {'row': 0, 'column': 0, 'rowspan': 2, 'columnspan': 2},
            {'row': 2, 'column': 0, 'rowspan': 4, 'columnspan': 2}
        ];

        let grid = {boxes: boxes, maxRows: 6};
        dashGridGlobal('#grid', grid);

        t.plan(8);

        grid.api.updateBox(boxes[1], {row: 1});
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');

        grid.api.updateBox(boxes[1], {row: 0});
        t.equal(boxes[0].row, 4, 'Should not move.');
        t.equal(boxes[1].row, 0, 'Should not move.');

        grid.api.updateBox(boxes[0], {row: 3});
        t.equal(boxes[0].row, 4, 'Should not move.');
        t.equal(boxes[1].row, 0, 'Should not move.');

        grid.api.updateBox(boxes[0], {row: 0});
        t.equal(boxes[0].row, 0, 'Should not move.');
        t.equal(boxes[1].row, 2, 'Should not move.');

        t.end();
    });

}
