/**
 * Works in posterior fashion, akin to ask for forgiveness rather than for
 * permission.
 * Logic:
 *
 * 1. Is updateTo a valid state?
 *    1.1 No: Return false.
 * 2. Save positions.
 * 3. Move box.
 *      3.1. Is box outside border?
 *          3.1.1. Yes: Can border be pushed?
 *              3.1.1.1. Yes: Expand border.
 *              3.1.1.2. No: Return false.
 *      3.2. Does box collide?
 *          3.2.1. Yes: Calculate new box position and
 *                 go back to step 1 with the new collided box.
 *          3.2.2. No: Return true.
 * 4. Is move valid?
 *    4.1. Yes: Update number rows / columns.
 *    4.2. No: Revert to old positions.
 */

import * as Util from './utils.js';

export {
    updateBox,
    updateNumRows,
    increaseNumRows,
    decreaseNumRows,
    updateNumColumns,
    increaseNumColumns,
    decreaseNumColumns,
    insertBox,
    removeBox
};

/**
 * Updates a position or size of box.
 *
 * @param {Object} box The box being updated.
 * @param {Object} updateTo The new state.
 * @returns {Array.<Object>} movedBoxes
 */
function updateBox({grid, box, updateTo}) {
    let movingBox = box;

    let previousBoxPositions = copyPositions(grid.component.boxes);
    Object.assign(box.state.box, updateTo);

    if (!isUpdateValid({grid, box})) {
        restoreOldPositions({grid, previousBoxPositions});
        return false;
    }

    let movedBoxes = [box];
    let validMove = moveBox({
        box: box,
        excludeBox: box,
        movedBoxes,
        grid
    });

    if (validMove) {
        updateNumRows({grid});
        updateNumColumns({grid});

        return movedBoxes;
    }

    restoreOldPositions({grid, previousBoxPositions});

    return [];
}

 /**
  * Checks if the board state is valid.
  */
 function isBoardValid() {

 }

/**
 * Copy box positions.
 * @returns {Array.<Object>} Previous box positions.
 */
function copyPositions(boxes) {
    let previousBoxPositions = [];
    boxes.forEach(function (box) {
        previousBoxPositions.push({
            row: box.state.box.row,
            column: box.state.box.column,
            columnspan: box.state.box.columnspan,
            rowspan: box.state.box.rowspan
        });
    });

    return previousBoxPositions;
}

/**
 * Restore Old positions.
 * @param {Array.<Object>} Previous positions.
 */
function restoreOldPositions({grid, previousBoxPositions}) {
    for (let i = 0; i < grid.component.boxes.length; i++) {
        grid.component.boxes[i].state.box.row = previousBoxPositions[i].row,
        grid.component.boxes[i].state.box.column = previousBoxPositions[i].column,
        grid.component.boxes[i].state.box.columnspan = previousBoxPositions[i].columnspan,
        grid.component.boxes[i].state.box.rowspan = previousBoxPositions[i].rowspan
    };
}

/**
 * Remove a box given its index in the boxes array.
 * @param {number} boxIndex.
 */
function removeBox(boxIndex) {
    let elem = boxes[boxIndex]._element;
    elem.parentNode.removeChild(elem);
    grid.component.boxes.splice(boxIndex, 1);

    // In case floating is on.
    updateNumRows();
    updateNumColumns();
}

/**
 * Insert a box. Box must contain at least the size and position of the box,
 * content element is optional.
 * @param {Object} box Box dimensions.
 * @returns {boolean} If insert was possible.
 */
function insertBox(grid, box) {
    movingBox = box;

    if (box.rows === undefined && box.column === undefined &&
        box.rowspan === undefined && box.columnspan === undefined) {
        return false;
    }

    if (!isUpdateValid(grid, box)) {
        return false;
    }

    // let previousBoxPositions = copyPositions(grid);

    let movedBoxes = [box];
    let validMove = moveBox({box, excludeBox: box, movedBoxes, grid});
    movingBox = undefined;

    if (validMove) {
        boxHandler.createBox(box);
        grid.component.boxes.push(box);

        updateNumRows();
        updateNumColumns();
        return box;
    }

    restoreOldPositions({grid, previousBoxPositions});

    return false;
}


/**
 * Checks and handles collisions with wall and grid.component.boxes.
 * Works as a tree, propagating moves down the collision tree and returns
 *     true or false depending if the box infront is able to move.
 * @param {Object} box
 * @param {Array.<Object>} excludeBox
 * @param {Array.<Object>} movedBoxes
 * @return {boolean} true if move is possible, false otherwise.
 */
function moveBox({box, excludeBox, movedBoxes, grid}) {
    if (isBoxOutsideBoundary({box, grid})) {return false;}

    let intersectedBoxes = getIntersectedBoxes({
      box, boxes: grid.component.boxes, excludeBox, movedBoxes
    });

    // {box, boxes, excludeBox, movedBoxes}
    // Handle box Collision, recursive model.
    for (let i = 0, len = intersectedBoxes.length; i < len; i++) {
        if (!collisionHandler({box, boxB: intersectedBoxes[i], excludeBox, movedBoxes, grid})) {
            return false;
        }
    }

    return true;
}

/**
 * Propagates box collisions.
 * @param {Object} box
 * @param {Object} boxB
 * @param {Object} excludeBox
 * @param {Array.<Object>} movedBoxes
 * @return {boolean} If move is allowed
 */
function collisionHandler({box, boxB, excludeBox, movedBoxes, grid}) {
    boxB.state.box.row += incrementRow(box, boxB)
    return moveBox({box: boxB, grid, excludeBox, movedBoxes});
}

/**
 * Calculates new box position based on the box that pushed it.
 * @param {Object} box Box which has moved.
 * @param {Object} boxB Box which is to be moved.
 */
function incrementRow(box, boxB) {
    return box.state.box.row + box.state.box.rowspan - boxB.state.box.row;
}

/**
 * Given a box, finds other boxes which intersect with it.
 * @param {Object} box
 * @param {Array.<Object>} excludeBox Array of grid.component.boxes.
 */
function getIntersectedBoxes({box, boxes, excludeBox, movedBoxes}) {
    let intersectedBoxes = [];

    console.log(boxes);
    boxes.forEach(function (boxB) {
        // Don't check moving box and the box itself.
        if (box !== boxB && boxB !== excludeBox) {
            if (doBoxesIntersect({box, boxB})) {
              console.log(9);
                movedBoxes.push(boxB);
                intersectedBoxes.push(boxB);
            }
        }
    });
    Util.insertionSort(intersectedBoxes, 'row');

    return intersectedBoxes;
}

/**
 * Checks whether 2 boxes intersect using bounding box method.
 * @param {Object} boxA
 * @param {Object} boxB
 * @returns boolean True if intersect else false.
 */
function doBoxesIntersect({box, boxB}) {
    return (box.state.box.column < boxB.state.box.column + boxB.state.box.columnspan &&
            box.state.box.column + box.state.box.columnspan > boxB.state.box.column &&
            box.state.box.row < boxB.state.box.row + boxB.state.box.rowspan &&
            box.state.box.rowspan + box.state.box.row > boxB.state.box.row);
}

/**
 * Updates the number of columns.
 */
function updateNumColumns({grid}) {
    let newNumColumns = grid.state.grid.numColumns;
    let maxColumn = Util.getMaxNum(grid.component.boxes, 'column', 'columnspan');

    if (maxColumn >= grid.state.grid.minColumns) {
        grid.state.grid.numColumns = maxColumn;
    }

    if (!grid.state.engine.movingBox) {
        return newNumColumns;
    }

    if (grid.state.grid.numColumns - grid.state.engine.movingBox.column - grid.state.engine.movingBox.columnspan === 0 &&
        grid.state.grid.numColumns < grid.state.grid.maxColumns) {
        newNumColumns += 1;
    } else if (grid.state.grid.numColumns - grid.state.engine.movingBox.column- grid.state.engine.movingBox.columnspan > 1 &&
        grid.state.engine.movingBox.column + grid.state.engine.movingBox.columnspan === maxColumn &&
        grid.state.grid.numColumns > grid.state.grid.minColumns &&
        grid.state.grid.numColumns < grid.state.grid.maxColumns) {
        newNumColumns = maxColumn + 1;
    }

    return newNumColumns;
}

/**
 * Increases number of grid.state.grid.numRows if box touches bottom of wall.
 * @param {Object} box
 * @param {number} numColumns
 * @returns {boolean} true if increase else false.
 */
function increaseNumColumns(box, numColumns) {
    // Determine when to add extra row to be able to move down:
    // 1. Anytime dragging starts.
    // 2. When dragging starts and moving box is close to bottom border.
    if ((box.column + box.columnspan) === grid.state.grid.numColumns &&
        grid.state.grid.numColumns < grid.state.grid.maxColumns) {
        grid.state.grid.numColumns += 1;
        return true;
    }

    return false;
}

/**
 * Decreases number of grid.state.grid.numRows to furthest leftward box.
 * @returns boolean true if increase else false.
 */
let decreaseNumColumns = function  () {
    let maxColumnNum = 0;

    grid.component.boxes.forEach(function (box) {
        if (maxColumnNum < (box.column + box.columnspan)) {
            maxColumnNum = box.column + box.columnspan;
        }
    });

    if (maxColumnNum < grid.state.grid.numColumns) {grid.state.grid.numColumns = maxColumnNum;}
    if (maxColumnNum < grid.state.grid.minColumns) {grid.state.grid.numColumns = grid.state.grid.minColumns;}

    return true;
}


/**
 * Number rows depends on three things.
 * <ul>
 *     <li>Min / Max Rows.</li>
 *     <li>Max Box.</li>
 *     <li>Dragging box near bottom border.</li>
 * </ul>
 *
 */
function updateNumRows({grid}) {
    let newNumRows = grid.state.grid.numRows;
    let maxRow = Util.getMaxNum(grid.component.boxes, 'row', 'rowspan');

    if (maxRow >= grid.state.grid.minRows) {
        grid.state.grid.numRows = maxRow;
    }

    if (!grid.state.engine.movingBox) {
        return newNumRows;
    }

    // Moving box when close to border.
    if (grid.state.grid.numRows - grid.state.engine.movingBox.row - grid.state.engine.movingBox.rowspan === 0 &&
        grid.state.grid.numRows < grid.state.grid.maxRows) {
        newNumRows += 1;
    } else if (grid.state.grid.numRows - grid.state.engine.movingBox.row - grid.state.engine.movingBox.rowspan > 1 &&
        grid.state.engine.movingBox.row + grid.state.engine.movingBox.rowspan === maxRow &&
        grid.state.grid.numRows > grid.state.grid.minRows &&
        grid.state.grid.numRows < grid.state.grid.maxRows) {
        newNumRows = maxRow + 1;
    }

    return newNumRows;
}

/**
 * Increases number of grid.state.grid.numRows if box touches bottom of wall.
 * @param box {Object}
 * @returns {boolean} true if increase else false.
 */
function increaseNumRows(box, numRows) {
    // Determine when to add extra row to be able to move down:
    // 1. Anytime dragging starts.
    // 2. When dragging starts AND moving box is close to bottom border.
    if ((box.row + box.rowspan) === grid.state.grid.numRows &&
        grid.state.grid.numRows < grid.state.grid.maxRows) {
        grid.state.grid.numRows += 1;
        return true;
    }

    return false;
}

/**
 * Decreases number of grid.state.grid.numRows to furthest downward box.
 * @returns {boolean} true if increase else false.
 */
let decreaseNumRows = function  () {
    let maxRowNum = 0;

    grid.component.boxes.forEach(function (box) {
        if (maxRowNum < (box.row + box.rowspan)) {
            maxRowNum = box.row + box.rowspan;
        }
    });

    if (maxRowNum < grid.state.grid.numRows) {grid.state.grid.numRows = maxRowNum;}
    if (maxRowNum < grid.state.grid.minRows) {grid.state.grid.numRows = grid.state.grid.minRows;}

    return true;
}

/**
 * Checks min, max box-size.
 * @param {Object} box
 * @returns {boolean}
 */
function isUpdateValid({grid, box}) {
    if (box.state.box.rowspan < grid.state.grid.minRowspan ||
        box.state.box.rowspan > grid.state.grid.maxRowspan ||
        box.state.box.columnspan < grid.state.grid.minColumnspan ||
        box.state.box.columnspan > grid.state.grid.maxColumnspan) {
        return false;
    }

    return true;
}

/**
 * Handles border collisions by reverting back to closest edge point.
 * @param {Object} box
 * @returns {boolean} True if collided and cannot move wall else false.
 */
function isBoxOutsideBoundary({box, grid}) {
    // Top and left border.
    if (box.state.box.column < 0 ||
        box.state.box.row < 0) {
        return true;
    }

    // Right and bottom border.
    if (box.state.box.row + box.state.box.rowspan > grid.state.grid.maxRows ||
        box.state.box.column + box.state.box.columnspan > grid.state.grid.maxColumns) {
        return true;
    }
    return false;
}
