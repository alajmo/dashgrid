import gridStyle from "./css/grid.css";
import demoStyle from "./css/demo.css";
import {gridGlobalFunc} from "./js/grid.js";

function run () {
    let numRows = 4;
    let numColumns = 3;

    let boxesAll = [];
    let id = 0;
    for (let i = 0; i < numRows; i += 1) {
        for (let j = 0; j < numColumns; j += 1) {
            id += 1;
            boxesAll.push({"row": i, "column": j, "rowspan": 1, "columnspan": 1, "id": id});
        }
    }

    let boxes = [
        {"row": 1, "column": 1, "rowspan": 1, "columnspan": 1, "id": 0, "floating": false, "swapping": false, "pushable": true},
        {"row": 0, "column": 1, "rowspan": 1, "columnspan": 1, "id": 1, "floating": false, "swapping": false, "pushable": true},
        {"row": 0, "column": 2, "rowspan": 1, "columnspan": 1, "id": 2, "floating": false, "swapping": false, "pushable": true},
        // {"row": 1, "column": 0, "rowspan": 1, "columnspan": 1, "id": 3, "floating": false, "swapping": false},
        // {"row": 1, "column": 1, "rowspan": 1, "columnspan": 1, "id": 4, "floating": false, "swapping": false},
        // {"row": 1, "column": 2, "rowspan": 1, "columnspan": 1, "id": 5, "floating": false, "swapping": false},
        // {"row": 2, "column": 0, "rowspan": 1, "columnspan": 1, "id": 6, "floating": false, "swapping": false},
        // {"row": 2, "column": 1, "rowspan": 1, "columnspan": 1, "id": 7, "floating": false, "swapping": false},
        // {"row": 2, "column": 2, "rowspan": 1, "columnspan": 1, "id": 8, "floating": false, "swapping": false},
    ];

    let grid = {
        boxes: boxes,
        floating: false,
        xMargin: 10,
        yMargin: 10,
        // numRows: numRows,
        // numColumns: numColumns
        // maxRows: 4
    };

    document.addEventListener("DOMContentLoaded", function() {
        gridGlobalFunc("#grid", grid);
    });
}

run();
