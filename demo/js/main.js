import dashGridGlobal from '../../src/dashgrid.js';
import '../css/demo.css';

document.addEventListener('DOMContentLoaded', function() {
    main();
});

function fillCells(numRows, numColumns) {
    let elem;
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
    let numColumns = 6;

    let elem = document.createElement('div');
    elem.className = 'dragHandle';

    boxes = [
        {row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem},
        // {row: 0, column: 9, rowspan: 3, columnspan: 2},
        {row: 2, column: 1, rowspan: 4, columnspan: 2}
    ];
    // boxes = fillCells(numRows, numColumns);

    let grid = dashGridGlobal(document.getElementById('grid'), {
        boxes: boxes,
        floating: true,

        xMargin: 20,
        yMargin: 20,

        draggable: {enabled: true, handle: 'dragHandle'},

        rowHeight: 80,
        numRows: numRows,
        minRows: numRows,
        maxRows: 10,

        columnWidth: 80,
        numColumns: numColumns,
        minColumns: numColumns,
        maxColumns: 10,

        snapback: 200,

        liveChanges: true,
        displayGrid: true
    });
}
