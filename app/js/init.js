import {getMaxObj, addEvent, parseArrayOfJSON} from './utils.js';
import {gridSpec, Grid} from './grid.js';

export default function run(){
    document.addEventListener("DOMContentLoaded", function() {
        let element = document.getElementById('grid');
        initializeGrid(element);
    });
}

function initializeGrid(element) {
    let boxes = [
        {'row': 0, 'column': 0, 'rowspan': 1, 'columnspan': 1, 'id': 0, 'floating': false, 'swapping': true},
        {'row': 0, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 1, 'floating': false, 'swapping': true},
        {'row': 0, 'column': 2, 'rowspan': 1, 'columnspan': 1, 'id': 2, 'floating': false, 'swapping': true},
        // {'row': 1, 'column': 0, 'rowspan': 1, 'columnspan': 1, 'id': 3, 'float': true},
        // {'row': 1, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 4, 'float': true},
        // {'row': 1, 'column': 2, 'rowspan': 1, 'columnspan': 1, 'id': 5, 'float': true},
        {'row': 2, 'column': 0, 'rowspan': 1, 'columnspan': 1, 'id': 6, 'float': true},
        {'row': 2, 'column': 1, 'rowspan': 1, 'columnspan': 1, 'id': 7, 'float': true},
        {'row': 2, 'column': 2, 'rowspan': 1, 'columnspan': 1, 'id': 8, 'float': true},
    ];

    let grid = Grid({element: element, boxes: boxes});
    grid.start();
}
