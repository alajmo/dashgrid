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

        var numRows = 6;
        var numColumns = 6;

        var boxes = fillCells(numRows, numColumns);

        var grid = {
            boxes: boxes,
            floating: false,
            xMargin: 15,
            yMargin: 15,
            maxRows: 100,
            minRows: numRows,
            numColumns: numColumns,
            displayGrid: true,
        };

        dashGridGlobal("#grid", grid);
    });

}());
