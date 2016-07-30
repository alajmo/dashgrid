import './demo.css';
import Dashgrid from '../src/dashgrid.js';

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
    elem.className = 'dashgridBox';

    let elemTwo = document.createElement('div');
    elemTwo.className = 'dashgridBox';

    let elemThree = document.createElement('div');
    elemThree.className = 'dashgridBox';

    boxes = [
        {row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem},
        {row: 1, column: 3, rowspan: 3, columnspan: 2, content: elemTwo},
        // {row: 15, column: 3, rowspan: 2, columnspan: 2, content: elemThree}
    ];
    // boxes = fillCells(numRows, numColumns);

    let gridElement = document.getElementById('grid');
    let gridOptions = {
        floating: true,

        xMargin: 20,
        yMargin: 20,

        draggable: {enabled: true, handle: 'dashgrid-box'},

        rowHeight: 'auto',
        minRows: numRows,
        maxRows: numRows + 5,

        columnWidth: 'auto',
        minColumns: numColumns,
        maxColumns: numColumns,

        showVerticalLine: true,
        showHorizontalLine: true,
        showGridCentroids: false,
        liveChanges: true
    };

    let dashgrid = dashGridGlobal(gridElement, boxes, gridOptions);
}
