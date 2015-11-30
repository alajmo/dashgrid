import dashGridGlobal from "../src/dashgrid.js";

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

export function basicTests(test) {
    // Mockup.
    let boxes = [
        {"row": 0, "column": 0, "rowspan": 3, "columnspan": 3, "floating": false, "swapping": false, "pushable": true, "resizable": true, "draggable": true},
    ];

    let grid = {
        boxes: boxes,
        floating: false,
        xMargin: 10,
        yMargin: 10,
        numRows: 6,
        numColumns: 5,
        displayGrid: true,
        // draggable: false,
        // resizable: false
    };

    dashGridGlobal("#grid", grid);

    // Tests.
    test("Initializing box", function (t) {
        t.plan(4);

        // Check that grid object gets all properties.
        t.notEqual(document.getElementById("grid"), null);
        t.notEqual(grid.api, undefined);
        t.notEqual(grid.boxApi, undefined);
        t.notEqual(grid.boxes, undefined);

        t.end();
    })

    test("Inserting a box", function (t) {
        t.plan(0);

        t.end();
    });

    test("Removing a box", function (t) {
        t.plan(0);

        t.end();
    });

    test("Toggling grid properties", function (t) {
        t.plan(0);

        t.end();
    });

    test("Toggling box properties", function (t) {
        t.plan(0);

        t.end();
    });

    test("Moving a box", function (t) {
        t.plan(13);

        /**
         * Moving inside boundary.
         */

        // Move down 1 row.
        let oldRow = boxes[0].row;
        grid.api.updateBox(boxes[0], {row: oldRow + 1});
        t.equal(boxes[0].row, oldRow + 1, "Should move.");

        // Move up 1 row.
        oldRow = boxes[0].row;
        grid.api.updateBox(boxes[0], {row: oldRow - 1});
        t.equal(boxes[0].row, oldRow - 1);

        // Move down 2 rows.
        oldRow = boxes[0].row;
        grid.api.updateBox(boxes[0], {row: oldRow + 2});
        t.equal(boxes[0].row, oldRow + 2);

        // Move up 2 rows.
        oldRow = boxes[0].row;
        grid.api.updateBox(boxes[0], {row: oldRow - 2});
        t.equal(boxes[0].row, oldRow - 2);

        // Move to right 1 column.
        let oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn + 1});
        t.equal(boxes[0].column, oldColumn + 1);

        // Move to left 1 column.
        oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn - 1});
        t.equal(boxes[0].column, oldColumn - 1);

        // Move to right 2 columns.
        oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn + 2});
        t.equal(boxes[0].column, oldColumn + 2);

        // Move to left 2 columns.
        oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn - 2});
        t.equal(boxes[0].column, oldColumn - 2);

        /**
         * Out-of-bound up-down left-right
         */

        // Attempt to move part of box outside top border.
        oldRow = boxes[0].row;
        grid.api.updateBox(boxes[0], {row: oldRow - 1});
        t.equal(boxes[0].row, oldRow);

        // Attempt to move whole box outside top border.
        oldRow = boxes[0].row;
        grid.api.updateBox(boxes[0], {row: oldRow - 9999});
        t.equal(boxes[0].row, oldRow);

        // Attempt to move part of box outside left border.
        oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn - 1});
        t.equal(boxes[0].column, oldColumn);

        // Attempt to move whole box outside left border.
        oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn - 9999});
        t.equal(boxes[0].column, oldColumn);

        // Attempt to move whole box outside right border.
        oldColumn = boxes[0].column;
        grid.api.updateBox(boxes[0], {column: oldColumn + 9999});
        t.equal(boxes[0].column, oldColumn);

        // Attempt to move out of bound row-wise (+).
        // oldRow = boxes[0].row;
        // grid.api.updateBox(boxes[0], {row: oldRow + 9999});
        // t.equal(boxes[0].row, oldRow);

        t.end();
    });

    test("Resizing a box", function (t) {
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
        t.equal(boxes[0].rowspan, oldRowspan, "Should not increase rowspan outside south boundary.");

        oldRowspan = boxes[0].rowspan;
        grid.api.updateBox(boxes[0], {rowspan: oldRowspan - 9999});
        t.equal(boxes[0].rowspan, oldRowspan, "Should not decrease rowspan below 1");

        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan + 9999});
        t.equal(boxes[0].columnspan, oldColumnspan, "Should not increase columnspan outside east boundary.");

        oldColumnspan = boxes[0].columnspan;
        grid.api.updateBox(boxes[0], {columnspan: oldColumnspan - 9999});
        t.equal(boxes[0].columnspan, oldColumnspan, "Should not decrease columnspan below 1.");

        t.end();
    });

}
