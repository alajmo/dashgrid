import gridStyle from './css/grid.css';
import demoStyle from './css/demo.css';
import {gridGlobalFunc} from './js/grid.js';

function run () {
    // AG-GRID
    let columnDefs = [
        {headerName: "Make", field: "make", suppressSorting: true},
        {headerName: "Model", field: "model"},
        {headerName: "Price", field: "price"}
    ];
    let rowData = [
        {headerName: "hejsan", field: "make"},
        {headerName: "dada", field: "model"}
    ];
    let gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        enableColResize: true,
        showToolPanel: true
    };

    let boxes = [
        {'row': 1, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 0, 'floating': false, 'swapping': true},
        {'row': 0, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 1, 'floating': false, 'swapping': true},
        {'row': 0, 'column': 2, 'rowspan': 1, 'columnspan': 1, 'id': 2, 'floating': false, 'swapping': true},
        // {'row': 1, 'column': 0, 'rowspan': 1, 'columnspan': 1, 'id': 3, 'floating': true, 'swapping': true},
        // {'row': 1, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 4, 'floating': true, 'swapping': true},
        // {'row': 1, 'column': 2, 'rowspan': 1, 'columnspan': 1, 'id': 5, 'floating': true, 'swapping': true},
        // {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 1, 'id': 6, 'floating': true, 'swapping': true},
        // {'row': 2, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 7, 'floating': true, 'swapping': true},
        // {'row': 2, 'column': 2, 'rowspan': 1, 'columnspan': 1, 'id': 8, 'floating': true, 'swapping': true},
    ];

    let grid = {
        boxes: boxes
    };

    document.addEventListener("DOMContentLoaded", function() {
        // agGridGlobalFunc('#ag-grid', gridOptions);
        // console.log(gridOptions);
        // gridOptions.api.showToolPanel(false);

        gridGlobalFunc('#grid', grid);

        console.log(grid);
            
    });
}

run();
