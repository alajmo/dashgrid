import './lib/shims.js';
import * as Event from './lib/events.js';

// Component.
import {Grid} from './component/grid.js';
import * as GridElement from './element/gridElement.js';
import * as GridVisual from './element/gridVisual.js';
import * as GridMethod from './lib/gridMethod.js';
import * as GridEngine from './lib/gridEngine.js';
import * as Render from './lib/render.js';

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
    let grid = Grid(element, gridOptions);
    GridMethod.initializeGrid(grid, boxes, element);

    // API.
    return Object.freeze({
        // updateBox: dashgrid.updateBox,
        // insertBox: dashgrid.insertBox,
        // removeBox: dashgrid.removeBox,
        // refreshGrid: dashgrid.refreshGrid,
        // dashgrid: gridState
    });
};
