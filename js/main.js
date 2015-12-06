(function () {
    'use strict';

    var numRows = 6;
    var numColumns = 5;

    function fillCells() {
        var boxesAll = [];
        var id = 0;
        for (var i = 0; i < numRows; i += 1) {
            for (var j = 0; j < numColumns; j += 1) {
                id += 1;
                boxesAll.push({row: i, column: j, rowspan: 1, columnspan: 1});
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        var boxes = [
            {row: 0, column: 0, rowspan: 3, columnspan: 3, floating: false, swapping: false, pushable: true, resizable: true, draggable: true},
        ];

        var grid = {
            boxes: boxes,
            floating: false,
            xMargin: 10,
            yMargin: 10,

            minRows: 6,

            // rowHeight: 100,
            // columnWidth: 50,
            numColumns: 20,

            displayGrid: true,
            // draggable: false,
            // resizable: false
        };

        dashGridGlobal("#grid", grid);
    });

}());
