(function () {
    'use strict';

    function fillCells(numRows, numColumns) {
        var boxes = [];
        var id = 0;
        for (var i = 0; i < numRows; i += 1) {
            for (var j = 0; j < numColumns; j += 1) {
                id += 1;
                boxes.push({row: i, column: j, rowspan: 1, columnspan: 1});
            }
        }

        return boxes;
    }

    document.addEventListener("DOMContentLoaded", function() {

        var numRows = 20;
        var numColumns = 10;

        var boxes = fillCells(numRows, numColumns);

        var grid = {
            boxes: boxes,
            floating: false,
            xMargin: 10,
            yMargin: 10,

            minRows: numRows,

            // rowHeight: 100,
            // columnWidth: 50,
            numColumns: numColumns,

            displayGrid: true,
            // draggable: false,
            // resizable: false
        };

        dashGridGlobal("#grid", grid);
    });

}());
