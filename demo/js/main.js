import test from "tape";

import dashGridGlobal from "../../src/dashgrid.js";
// import {basicTests} from "../../tests/grid.test.js";
// import {collisionTest} from "../../tests/collision.test.js";
// import {insertTest} from "../../tests/box.test.js";

import "../css/demo.css";

function fillCells(numRows, numColumns) {
    let boxesAll = [];
    let id = 0;
    for (let i = 0; i < numRows; i += 1) {
        for (let j = 0; j < numColumns; j += 1) {
            id += 1;
            boxesAll.push({"row": i, "column": j, "rowspan": 1, "columnspan": 1});
        }
    }
    return boxesAll;
}

function main() {
    let numRows = 6;
    let numColumns = 5;

    let boxes = fillCells(numRows, numColumns);

    let grid = {
        boxes: boxes,
        floating: false,
        xMargin: 20,
        yMargin: 20,
        handleWidth: 10,

        minRows: numRows,
        maxRows: 100,
        // rowHeight: 100,
        // columnWidth: 50,
        numColumns: numColumns,

        classHandle: 'handle',
        animate: false,
        displayGrid: true,
        // draggable: false,
        // resizable: false
    };

    dashGridGlobal("#grid", grid);
}

document.addEventListener("DOMContentLoaded", function() {
    main();
    // basicTests(test);
    // collisionTest(test);
    // insertTest(test);
});
