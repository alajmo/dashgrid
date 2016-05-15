import './shims.js';

// Functions.
import {grid} from './grid.js';
import {gridEngine} from './gridEngine.js';
import {gridViewState} from './gridViewState.js';

// Element Models.
import {gridElementModel} from './gridElementModel.js';

// State Models.
import {gridStateModel} from './gridStateModel.js';
import {boxStateModel} from './boxStateModel.js';
import {renderStateModel} from './renderStateModel.js';
import {gridEngineStateModel} from './gridEngineStateModel.js';

export default dashgrid;

// Exporting States.
export {gridElement, renderState, gridState, boxState};

// Elements.
let gridElement;

// States.
let renderState;
let gridState;
let boxState;

function dashgrid(element, options) {
    gridState = Object.assign({}, gridStateModel(options));
    gridElement = gridElementModel(element, gridState);

    // User event after grid is done loading.
    if (dashgrid.onGridReady) {dashgrid.onGridReady();} // user event.

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
