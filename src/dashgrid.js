import './node/shims.js';

// Node.
import {Grid} from './component/grid.js';

// DOM.
import {DOM} from './render/gridDOM.js';

export default Dashgrid;

function Dashgrid(element, boxes, gridOptions) {
    // Grid.
    let grid = Grid();
    let g = grid.createGrid();

    // // User event after grid is done loading.
    // if (gridState.onGridReady) {gridState.onGridReady();} // user event.
    return;

    // API.
    return Object.freeze({
        updateBox: g.updateBox,
        insertBox: g.insertBox,
        removeBox: g.removeBox,
        getBoxes: g.getBoxes,
        refreshGrid: g.refreshGrid,
        dashgrid: gridState
    });
};
