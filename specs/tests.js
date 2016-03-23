// import test from 'tape';

// import dashGridGlobal from '../src/dashgrid.js';
// import '../css/demo.css';

// import {decorateRunAll} from './utils.js';
// import initGrid from './initGrid.test.js';
// import boxAddRemove from './boxAddRemove.test.js';
// import boxMove from './boxMove.test.js';
// import boxCollisions from './boxCollision.test.js';
// import boxResize from './boxResize.test.js';
// import gridResize from './gridResize.test.js';
// import dragger from './dragger.test.js';

// document.addEventListener('DOMContentLoaded', function() {
//     main();
// });

// function main() {
//     let boxes;
//     let numRows = 6;
//     let numColumns = 6;

//     let elem = document.createElement('div');
//     elem.className = 'dragHandle';

//     boxes = [
//         {row: 0, column: 1, rowspan: 2, columnspan: 2, content: elem},
//         {row: 2, column: 1, rowspan: 4, columnspan: 2}
//     ];

//     let grid = dashGridGlobal('#grid', {
//         boxes: boxes,
//         floating: true,

//         xMargin: 20,
//         yMargin: 20,

//         draggable: {
//             handle: 'dragHandle'
//         },

//         rowHeight: 80,
//         numRows: numRows,
//         minRows: numRows,
//         maxRows: 10,

//         columnWidth: 80,
//         numColumns: numColumns,
//         minColumns: numColumns,
//         maxColumns: 10,

//         snapback: 200,

//         liveChanges: true,
//         displayGrid: true
//     });
// }
