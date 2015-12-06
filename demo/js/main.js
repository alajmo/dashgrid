import test from "tape";

import dashGridGlobal from "../../src/dashgrid.js";
import {basicTests} from "../../tests/unit.js";
import {collisionTest} from "../../tests/collision.test.js";

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

document.addEventListener("DOMContentLoaded", function() {
    let numRows = 6;
    let numColumns = 5;

    // let element = document.createElement("div");
    // element.style.position = "absolute";
    // element.style.top = "20px";
    // element.style.left = "20px";
    // // element.style.background = "red";
    // element.innerHTML = "Drag me!";
    let boxes = fillCells(numRows, numColumns);

    // let boxes = [
    //     {row: 0, column: 0, rowspan: 3, columnspan: 3, floating: false, swapping: false, pushable: false, resizable: true, draggable: true},
    //     {row: 5, column: 5, rowspan: 2, columnspan: 2, floating: true, pushable: true, resizable: true, draggable: false},
    //     {row: 5, column: 0, rowspan: 2, columnspan: 2, floating: true, pushable: true, resizable: true, draggable: true}
    // ];

    let grid = {
        boxes: boxes,
        floating: false,
        xMargin: 20,
        yMargin: 20,

        minRows: numRows,
        maxRows: 100,
        // rowHeight: 100,
        // columnWidth: 50,
        numColumns: numColumns,

        displayGrid: true,
        // draggable: false,
        // resizable: false
    };

    dashGridGlobal("#grid", grid);

    // basicTests(test);
    // collisionTest(test);
});
