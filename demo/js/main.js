import test from "tape";

import dashGridGlobal from "../../src/dashgrid.js";
import {basicTests} from "../../tests/unit.js";
import {collisionTest} from "../../tests/collision.test.js";

import "../css/demo.css";

let numRows = 6;
let numColumns = 5;

function fillCells() {
    let boxesAll = [];
    let id = 0;
    for (let i = 0; i < numRows; i += 1) {
        for (let j = 0; j < numColumns; j += 1) {
            id += 1;
            boxesAll.push({"row": i, "column": j, "rowspan": 1, "columnspan": 1});
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let boxes = [
        {"row": 0, "column": 0, "rowspan": 3, "columnspan": 3, "floating": false, "swapping": false, "pushable": true, "resizable": true, "draggable": true},
    ];

    let grid = {
        boxes: boxes,
        floating: false,
        xMargin: 10,
        yMargin: 10,

        minRows: 6,

        // rowHeight: 100,
        // columnWidth: 50,
        numColumns: 6,

        displayGrid: true,
        // draggable: false,
        // resizable: false
    };

    dashGridGlobal("#grid", grid);

    // basicTests(test);
    // collisionTest(test);
});
