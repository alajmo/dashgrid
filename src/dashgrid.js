// Fix all functions to accept specific properties instead of whole objects.

import './node/shims.js';

// Component.
import {Grid, addBox, renderBoxes} from './component/grid.js';

// Virtual DOM.
import {DOM} from './element/gridDOM.js';

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
    // Grid.
    let grid = Grid(element, gridOptions);
    addBox({grid, boxes});
    renderBoxes({grid});

    // // User event after grid is done loading.
    // if (gridState.onGridReady) {gridState.onGridReady();} // user event.
    return;

    function addEvents() {
        // Event listeners.
        addEvent(window, 'resize', () => {
            renderer.setColumnWidth();
            renderer.setRowHeight();
            grid.refreshGrid();
        });
    }

    // API.
    return Object.freeze({
        updateBox: dashgrid.updateBox,
        insertBox: dashgrid.insertBox,
        removeBox: dashgrid.removeBox,
        refreshGrid: dashgrid.refreshGrid,
        dashgrid: gridState
    });
};
