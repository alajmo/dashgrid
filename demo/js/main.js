import "../css/demo.css";
import runTests from "../../tests/unit.js";

let numRows = 6;
let numColumns = 5;

function fillCells() {
    let boxesAll = [];
    let id = 0;
    for (let i = 0; i < numRows; i += 1) {
        for (let j = 0; j < numColumns; j += 1) {1
            id += 1;
            boxesAll.push({"row": i, "column": j, "rowspan": 1, "columnspan": 1});
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    runTests();
});
