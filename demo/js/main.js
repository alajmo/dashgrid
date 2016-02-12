import dashGridGlobal from '../../src/dashgrid.js';
import tests from '../../specs/tests.js';
import '../css/demo.css';

document.addEventListener('DOMContentLoaded', function() {
    // main();
    let testHandler = tests(dashGridGlobal);
    // testHandler.initGrid();
    // testHandler.boxMove();
    testHandler.boxResize();
});

function fillCells(numRows, numColumns) {
    var elem;
    let boxesAll = [];
    let id = 0;
    for (let i = 0; i < numRows; i += 1) {
        for (let j = 0; j < numColumns; j += 1) {
            elem = document.createElement('div');
            elem.className = 'dragHandle';
            elem.style.width = '100%';
            elem.style.height = '100%';

            id += 1;
            boxesAll.push({row: i, column: j, rowspan: 1, columnspan: 1});
        }
    }

    return boxesAll;
}

function main() {
    let boxes;
    let numRows = 6;
    let numColumns = 5;

    let elem = document.createElement('div');
    elem.className = 'dragHandle';
    boxes = [
        {row: 0, column: 1, rowspan: 3, columnspan: 2},
        {row: 3, column: 1, rowspan: 2, columnspan: 2}
    ];
    boxes = fillCells(numRows, numColumns);

    let gridSettings = {
        boxes: boxes,
        floating: true,

        xMargin: 20,
        yMargin: 20,

        // resizeHandle: ['n'],
        dragHandle: 'dragHandle',

        minRows: numRows,
        maxRows: 100,

        numColumns: numColumns,

        snapback: 200,

        liveChanges: true,
        displayGrid: true
    };

    var grid = dashGridGlobal('#grid', gridSettings);
}
