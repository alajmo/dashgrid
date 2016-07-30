import './node/shims.js';

// Component.
// import {Grid} from './component/grid.js';
// import {GridMethods} from './node/gridMethods.js';

export default Dashgrid;

/**
 * @param {Object} element Element to which bind Dashgrid to.
 * @param {Array.<Object>} boxes Boxes.
 * @param {Object} gridOptions Grid Options.
 * @returns {Function} updateBox API Update Box.
 * @returns {Function} insertBox API Insert Box.
 * @returns {Function} removeBox API Remove Box.
 * @returns {Function} refreshGrid API Refresh Grid.
 * @returns {Object} dashgrid API Copy of dashgrid.
 *
 */
function Dashgrid(element, boxes, gridOptions) {
    // let grid = Grid(element, gridOptions);

    console.log(9);
    // Initialize Grid.
    // GridMethods.addBox({grid, boxes});
    // GridMethods.UpdateRenderState({grid, renderState});

    return 9;
    // renderBoxes({grid});
    // renderGrid(grid);

    // API.
    return Object.freeze({
        // updateBox: dashgrid.updateBox,
        // insertBox: dashgrid.insertBox,
        // removeBox: dashgrid.removeBox,
        // refreshGrid: dashgrid.refreshGrid,
        // dashgrid: gridState
    });
};


// // // User event after grid is done loading.
// // if (gridState.onGridReady) {gridState.onGridReady();} // user event.
// return;
//
// function addEvents() {
//     // Event listeners.
//     addEvent(window, 'resize', () => {
//         renderer.setColumnWidth();
//         renderer.setRowHeight();
//         grid.refreshGrid();
//     });
// }
//
