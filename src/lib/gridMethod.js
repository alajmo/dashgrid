// Manipulates Grid Component.

// Elements.
import * as GridElement from '../element/gridElement.js';
import * as GridVisual from '../element/gridVisual.js';

import * as Render from './render.js';
import * as GridEngine from './gridEngine.js';
import {Box} from '../component/box.js'

export {initializeGrid, addBox, removeBox, updateBox, updateRenderState};

function initializeGrid(grid, boxes, element) {
    grid.element.grid = GridElement.gridElement(element);

    grid.events.click(grid);

    // State Init.
    grid.state.grid.numRows = GridEngine.updateNumRows({grid});
    grid.state.grid.numColumns = GridEngine.updateNumColumns({grid});

    // Grid Element Structure.
    const shadowBoxElement = GridVisual.ShadowBoxElement();
    const boxesElement = GridElement.boxesElement();
    const verticalElement = GridVisual.VerticalLineElement(grid);
    const horizontalElement = GridVisual.HorizontalLineElement(grid);
    const centroidElement = GridVisual.CentroidElement(grid);

    grid.element.shadowBox = shadowBoxElement;
    grid.element.boxes = boxesElement;
    grid.element.vertical = verticalElement;
    grid.element.horizontal = horizontalElement;
    grid.element.centroid = centroidElement;

    grid.element.grid.appendChild(shadowBoxElement);
    grid.element.grid.appendChild(boxesElement);
    grid.element.grid.appendChild(verticalElement);
    grid.element.grid.appendChild(horizontalElement);
    grid.element.grid.appendChild(centroidElement);

    // Initialize Grid.
    Render.renderGrid(grid);
    addBox({grid, boxes});
    Render.renderBox({grid, boxes: grid.component.boxes});
    updateRenderState(grid);
}

/**
 * [updateBox description]
 * @return {[type]} [description]
 */
function updateBox({grid, box, updateTo}) {
  let movedBoxes = GridEngine.updateBox({grid, box, updateTo});

  if (movedBoxes.length > 0) {
      Render.renderBox({grid, boxes: movedBoxes, excludeBox: box});
      Render.renderGrid(grid);
      return true;
  }

  return false;
}

/**
 * Add box(es) to Grid.
 * @param {Object} grid
 * @param {Array.<Object>} boxes
 */
function addBox({grid, boxes}) {
    if (!Array.isArray(boxes)) { boxes = [boxes]; }
    boxes.forEach(function (boxOption) {
        const box = Box({boxOption, gridState: grid.state.grid});
        if (box !== undefined) {
          grid.component.boxes.push(box);
          grid.element.boxes.appendChild(box.element.box);
        }
    });
}

/**
 * Removes a box.
 * @param {Object} box
 */
function removeBox(box) {
    GridEngine.removeBox(box);
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
    GridEngine.increaseNumRows(box, 1);
    GridEngine.increaseNumColumns(box, 1);
    // gridView.renderGrid();
};

/**
 * When dragging / resizing is dropped.
 */
function updateEnd() {
    GridEngine.decreaseNumRows();
    GridEngine.decreaseNumColumns();
    // gridView.renderGrid();
};

/**
 *
 * @param {}
 * @returns
 */
function refreshGrid(grid) {
    renderGrid(grid);
    renderBox({grid, boxes: grid.component.boxes});
};

function updateRenderState(grid) {
    Object.assign(grid.state.render, Render.getCellCentroidPosition({
        numRows: grid.state.grid.numRows,
        numColumns: grid.state.grid.numColumns,
        yMargin: grid.state.grid.yMargin,
        xMargin: grid.state.grid.xMargin,
        rowHeight: grid.state.render.rowHeight,
        columnWidth: grid.state.render.columnWidth
    }));
}
