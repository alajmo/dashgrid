// Grid.
import {GridElement} from '../element/gridElement.js';
import {updateBox, updateNumRows, updateNumColumns} from '../node/gridEngine.js';
import {GridEngineState} from '../state/gridEngineState.js';

import {GridState} from '../state/gridState.js';
import {HorizontalLineElement} from '../element/horizontalLineElement.js';
import {VerticalLineElement} from '../element/verticalLineElement.js';
import {CentroidElement} from '../element/centroidElement.js';

import {render} from '../node/utils.js';

// Box.
import {Box} from './box.js';
import {BoxElement} from '../element/boxElement.js';
import {ShadowBoxElement} from '../element/shadowBoxElement.js';

// Render.
import {RenderState} from '../state/renderState.js';
import {
    getColumnWidth,
    getRowHeight,
    findIntersectedCells,
    getCellCentroidPosition,
    getClosestCells,
    getGridElementWidth,
    getGridElementHeight,
    getBoxElementXPosition,
    getBoxElementYPosition,
    getBoxElementWidth,
    getBoxElementHeight
} from '../element/render/render.js';

import {DragState} from '../node/drag.js';
// import {Resize} from '../node/resize.js';
import {mouseDown, dragEvent} from '../node/mouse.js';

// DOM.
import {DOM} from '../element/gridDOM.js';

export {
    Grid,
    addBox,
    renderBoxes,
    updateGridBox,
    updateStart,
    updateEnd,
    refreshGrid
};

/**
 *
 * @param {Object} dashgrid
 * @param {Object} renderer
 * @param {Object} boxHandler
 * @returns {Function} init Initialize Grid.
 * @returns {Function} updateBox API for updating box, moving / resizing.
 * @returns {Function} insertBox Insert a new box.
 * @returns {Function} removeBox Remove a box.
 * @returns {Function} getBox Return box object given DOM element.
 * @returns {Function} updateStart When drag / resize starts.
 * @returns {Function} update During dragging / resizing.
 * @returns {Function} updateEnd After drag / resize ends.
 * @returns {Function} renderGrid Update grid element.
 */
function Grid(element, gridOptions) {
    // Render.
    let renderState = RenderState();

    // Grid.
    let gridState = GridState(gridOptions);
    let gridEngineState = GridEngineState();
    let gridElement = GridElement(element, gridState);

    // Boxes.
    let boxes = [];

    // Element.
    DOM.gridElement = gridElement.element;
    let boxElements = new Map();

    // Drag / Resize.
    let dragState = DragState({gridState});

    // ShadowBox.
    if (gridState.showShadowBox) {
        render(gridElement, {'shadowBox': ShadowBoxElement()});
    }

    // Compose grid.
    let grid = Object.assign({}, {
        renderState,
        gridEngineState,
        gridState,
        dragState,
        gridElement,
        boxes,
        events: new WeakMap()
    });

    // Initialize events for mouse interaction.
    gridElement.element.addEventListener('mousedown', function (e) {
        let node = e.target;
        let inputTags = ['select', 'input', 'textarea', 'button'];
        // Exit if:
        // 1. the target has it's own click event or
        // 2. target has onclick attribute or
        // 3. Right / middle button clicked instead of left.
        if (inputTags.indexOf(node.nodeName.toLowerCase()) > -1) {return;}
        if (node.hasAttribute('onclick')) {return;}
        if (e.which === 2 || e.which === 3) {return;}

        if (grid.events.has(e.target)) {
            let {box, event} = grid.events.get(e.target);
            if (event === 'drag') {
                dragEvent({grid, box, e});
            }
        }
        // mouseDown(e, element);
        e.preventDefault();
    }, false);

    // Initialize num rows / columns.
    grid.gridState.numRows = updateNumRows({grid});
    grid.gridState.numColumns = updateNumColumns({grid});

    // Render grid.
    renderGrid(grid);

    Object.assign(grid.renderState, getCellCentroidPosition({
                numRows: grid.gridState.numRows,
                numColumns: grid.gridState.numColumns,
                yMargin: grid.gridState.yMargin,
                xMargin: grid.gridState.xMargin,
                rowHeight: grid.renderState.rowHeight,
                columnWidth: grid.renderState.columnWidth
            }));

    return grid;
}


/**
 *
 * @param {}
 */
function renderGrid(grid) {
    grid.renderState.columnWidth = getColumnWidth({
        columnWidth: grid.gridState.columnWidth,
        parentWidth: DOM.gridElement.parentNode.offsetWidth,
        numColumns: grid.gridState.numColumns,
        xMargin: grid.gridState.xMargin
    });
    grid.renderState.rowHeight = getRowHeight({
        rowHeight: grid.gridState.rowHeight,
        parentHeight: DOM.gridElement.parentNode.offsetHeight,
        numRows: grid.gridState.numRows,
        yMargin: grid.gridState.yMargin
    });

    grid.gridElement.element.style.height = getGridElementHeight({
        rowHeight: grid.renderState.rowHeight,
        parentHeight: DOM.gridElement.parentNode.offsetHeight,
        numRows: grid.gridState.numRows,
        yMargin: grid.gridState.yMargin
    });
    grid.gridElement.element.style.width = getGridElementWidth({
        columnWidth: grid.renderState.columnWidth,
        parentWidth: DOM.gridElement.parentNode.offsetWidth,
        numColumns: grid.gridState.numColumns,
        xMargin: grid.gridState.xMargin
    });

    if (grid.gridState.showVerticalLine) {
        grid.gridElement.element.appendChild(VerticalLineElement().createVerticalLineElement(grid.gridState, grid.renderState));
    }

    if (grid.gridState.showHorizontalLine) {
        grid.gridElement.element.appendChild(HorizontalLineElement().createHorizontalLineElement(grid.gridState, grid.renderState));
    }

    if (grid.gridState.showCentroid) {
        grid.gridElement.element.appendChild(CentroidElement().createCentroidElement(grid.gridState, grid.renderState));
    }
}

/**
 * @param {Array.<Object>} boxes List of boxes to redraw.
 * @param {Object} excludeBox Don't redraw this box.
 */
function renderBoxes({grid}) {
    let excludeBox = {};
    window.requestAnimFrame(() => {
        // updateGridDimension moved boxes css.
        grid.boxes.forEach(function (box) {
            if (excludeBox !== box) {
                box.boxElement.element.style.top = getBoxElementYPosition({
                    row: box.boxState.row,
                    rowHeight: grid.renderState.rowHeight,
                    yMargin: grid.gridState.yMargin
                });
                box.boxElement.element.style.left = getBoxElementXPosition({
                    column: box.boxState.column,
                    columnWidth: grid.renderState.columnWidth,
                    xMargin: grid.gridState.xMargin
                });
                box.boxElement.element.style.height = getBoxElementHeight({
                    rowspan: box.boxState.rowspan,
                    rowHeight: grid.renderState.rowHeight,
                    yMargin: grid.gridState.yMargin
                });
                box.boxElement.element.style.width = getBoxElementWidth({
                    columnspan: box.boxState.columnspan,
                    columnWidth: grid.renderState.columnWidth,
                    xMargin: grid.gridState.xMargin
                });
            }
        });
    });
}

function GridEvents({element}){
}

/**
 * Add box(es) to Grid.
 * @param {Object} grid
 * @param {Array.<Object>} boxes
 */
function addBox({grid, boxes}) {
    // Create box container.
    if (boxes.length > 0 && grid.gridElement.boxes === undefined) {
        grid.gridElement.boxes = {element: document.createElement('div')};
        grid.gridElement.element.appendChild(grid.gridElement.boxes.element);
    }

    // Add boxes.
    boxes.forEach(function (boxOptions) {
        let box = Box({boxOptions: boxOptions, gridState: grid.gridState});

        if (box !== undefined) {
            grid.boxes.push(box);

            // let boxElement = BoxElement(box);
            let boxElement = {element: BoxElement({box, boxOptions.content})};
            grid.boxElements.set(box, boxElement);

            grid.gridElement.boxes.element.appendChild(box.boxElement.element);
            grid.events.set(box.boxElement.element, {box: box, event: 'drag'});
        }
    });
}

/**
 *
 * @param {Object} box
 * @param {Object} updateTo
 * @param {Object} excludeBox Optional parameter, if updateBox is triggered
 *                            by drag / resize event, then don't update
 *                            the element.
 * @returns {boolean} If update succeeded.
 */
function updateGridBox({grid, box, updateTo, excludeBox}) {
    let movedBoxes = updateBox({grid, box, updateTo});

    if (movedBoxes.length > 0) {
        // gridView.renderBox(movedBoxes, excludeBox);
        // gridView.renderGrid();

        return true;
    }

    return false;
};

/**
 * Removes a box.
 * @param {Object} box
 */
function removeBox(box) {
    gridEngine.removeBox(box);
    // gridView.renderGrid();
};

/**
 * Resizes a box.
 * @param {Object} box
 */
function resizeBox(box) {
    // In case box is not updated by dragging / resizing.
    // gridView.renderBox(movedBoxes);
    // gridView.renderGrid();
};

/**
 * Called when either resize or drag starts.
 * @param {Object} box
 */
function updateStart(box) {
    gridEngine.increaseNumRows(box, 1);
    gridEngine.increaseNumColumns(box, 1);
    // gridView.renderGrid();
};

/**
 * When dragging / resizing is dropped.
 */
function updateEnd() {
    gridEngine.decreaseNumRows();
    gridEngine.decreaseNumColumns();
    // gridView.renderGrid();
};

/**
 *
 * @param {}
 * @returns
 */
function refreshGrid() {
    // gridView.renderBox(dashgrid.boxes);
    // gridView.renderGrid();
};
