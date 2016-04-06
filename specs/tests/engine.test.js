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

}
