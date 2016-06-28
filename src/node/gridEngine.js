import {removeNodes, insertionSort, getMaxNum} from './utils.js';

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
            row: box.boxState.row,
            column: box.boxState.column,
            columnspan: box.boxState.columnspan,
            rowspan: box.boxState.rowspan
        });
    });

    return previousBoxPositions;
}

/**
 * Restore Old positions.
 * @param {Array.<Object>} Previous positions.
 */
function restoreOldPositions(previousBoxPositions) {
    for (let i = 0; i < gridState.boxes.length; i++) {
        boxes[i].row = previousBoxPositions[i].row,
        boxes[i].column = previousBoxPositions[i].column,
        boxes[i].columnspan = previousBoxPositions[i].columnspan,
        boxes[i].rowspan = previousBoxPositions[i].rowspan
    };
}

/**
 * Remove a box given its index in the boxes array.
 * @param {number} boxIndex.
 */
function removeBox(boxIndex) {
    let elem = boxes[boxIndex]._element;
    elem.parentNode.removeChild(elem);
    gridState.boxes.splice(boxIndex, 1);

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
function insertBox(box) {
    movingBox = box;

    if (box.rows === undefined && box.column === undefined &&
        box.rowspan === undefined && box.columnspan === undefined) {
        return false;
    }

    if (!isUpdateValid(box)) {
        return false;
    }

    // let previousBoxPositions = copyPositions(grid);

    let movedBoxes = [box];
    let validMove = moveBox(box, box, movedBoxes);
    movingBox = undefined;

    if (validMove) {
        boxHandler.createBox(box);
        gridState.boxes.push(box);

        updateNumRows();
        updateNumColumns();
        return box;
    }

    restoreOldPositions(previousBoxPositions);

    return false;
}

/**
 * Updates a position or size of box.
 *
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
 *
 * @param {Object} box The box being updated.
 * @param {Object} updateTo The new state.
 * @returns {Array.<Object>} movedBoxes
 */
function updateBox({grid, box, updateTo}) {
    let movingBox = box;

    let previousBoxPositions = copyPositions(grid.boxes);
    Object.assign(box.boxState, updateTo);

    if (!isUpdateValid({gridState: grid.gridState, box: box.boxState})) {
        restoreOldPositions(previousBoxPositions);
        return false;
    }

    let movedBoxes = [box];
    let validMove = moveBox({
        box: box.boxState,
        boxes: grid.boxes,
        excludeBox: box.boxState,
        movedBoxes,
        gridState: grid.gridState
    });

    if (validMove) {
        updateNumRows({grid});
        updateNumColumns({grid});

        return movedBoxes;
    }

    restoreOldPositions(previousBoxPositions);

    return [];
}

/**
 * Checks and handles collisions with wall and gridState.boxes.
 * Works as a tree, propagating moves down the collision tree and returns
 *     true or false depending if the box infront is able to move.
 * @param {Object} box
 * @param {Array.<Object>} excludeBox
 * @param {Array.<Object>} movedBoxes
 * @return {boolean} true if move is possible, false otherwise.
 */
function moveBox({box, boxes, excludeBox, movedBoxes, gridState}) {
    if (isBoxOutsideBoundary({box, gridState})) {return false;}

    let intersectedBoxes = getIntersectedBoxes({box, boxes, excludeBox, movedBoxes});

    // Handle box Collision, recursive model.
    for (let i = 0, len = intersectedBoxes.length; i < len; i++) {
        if (!collisionHandler(box, intersectedBoxes[i], excludeBox, movedBoxes)) {
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
function collisionHandler(box, boxB, excludeBox, movedBoxes) {
    boxB.row += incrementRow(box, boxB)
   return moveBox(boxB, excludeBox, movedBoxes);
}

/**
 * Calculates new box position based on the box that pushed it.
 * @param {Object} box Box which has moved.
 * @param {Object} boxB Box which is to be moved.
 */
function incrementRow(box, boxB) {
    return box.row + box.rowspan - boxB.row;
}

/**
 * Given a box, finds other boxes which intersect with it.
 * @param {Object} box
 * @param {Array.<Object>} excludeBox Array of gridState.boxes.
 */
function getIntersectedBoxes({box, boxes, excludeBox, movedBoxes}) {
    let intersectedBoxes = [];

    boxes.forEach(function (boxB) {
        boxB = boxB.boxState;

        // Don't check moving box and the box itself.
        if (box !== boxB && boxB !== excludeBox) {
            if (doBoxesIntersect(box.boxState, boxB.boxState)) {
                movedBoxes.push(boxB);
                intersectedBoxes.push(boxB);
            }
        }
    });
    insertionSort(intersectedBoxes, 'row');

    return intersectedBoxes;
}

/**
 * Checks whether 2 boxes intersect using bounding box method.
 * @param {Object} boxA
 * @param {Object} boxB
 * @returns boolean True if intersect else false.
 */
function doBoxesIntersect(box, boxB) {
    return (box.column < boxB.column + boxB.columnspan &&
            box.column + box.columnspan > boxB.column &&
            box.row < boxB.row + boxB.rowspan &&
            box.rowspan + box.row > boxB.row);
}

/**
 * Updates the number of columns.
 */
function updateNumColumns({grid}) {
    let newNumColumns = grid.gridState.numColumns;
    let maxColumn = getMaxNum(grid.boxes, 'column', 'columnspan');

    if (maxColumn >= grid.gridState.minColumns) {
        grid.gridState.numColumns = maxColumn;
    }

    if (!grid.gridEngineState.movingBox) {
        return newNumColumns;
    }

    if (grid.gridState.numColumns - movingBox.column - movingBox.columnspan === 0 &&
        grid.gridState.numColumns < grid.gridState.maxColumns) {
        newNumColumns += 1;
    } else if (grid.gridState.numColumns - movingBox.column- movingBox.columnspan > 1 &&
        movingBox.column + movingBox.columnspan === maxColumn &&
        grid.gridState.numColumns > grid.gridState.minColumns &&
        grid.gridState.numColumns < grid.gridState.maxColumns) {
        newNumColumns = maxColumn + 1;
    }

    return newNumColumns;
}

/**
 * Increases number of gridState.numRows if box touches bottom of wall.
 * @param {Object} box
 * @param {number} numColumns
 * @returns {boolean} true if increase else false.
 */
function increaseNumColumns(box, numColumns) {
    // Determine when to add extra row to be able to move down:
    // 1. Anytime dragging starts.
    // 2. When dragging starts and moving box is close to bottom border.
    if ((box.column + box.columnspan) === gridState.numColumns &&
        gridState.numColumns < gridState.maxColumns) {
        gridState.numColumns += 1;
        return true;
    }

    return false;
}

/**
 * Decreases number of gridState.numRows to furthest leftward box.
 * @returns boolean true if increase else false.
 */
let decreaseNumColumns = function  () {
    let maxColumnNum = 0;

    gridState.boxes.forEach(function (box) {
        if (maxColumnNum < (box.column + box.columnspan)) {
            maxColumnNum = box.column + box.columnspan;
        }
    });

    if (maxColumnNum < gridState.numColumns) {gridState.numColumns = maxColumnNum;}
    if (maxColumnNum < gridState.minColumns) {gridState.numColumns = gridState.minColumns;}

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
    let newNumRows = grid.gridState.numRows;
    let maxRow = getMaxNum(grid.boxes, 'row', 'rowspan');

    if (maxRow >= grid.gridState.minRows) {
        grid.gridState.numRows = maxRow;
    }

    if (!grid.gridEngineState.movingBox) {
        return newNumRows;
    }

    // Moving box when close to border.
    if (grid.gridState.numRows - grid.gridEngineState.movingBox.row - grid.gridEngineState.movingBox.rowspan === 0 &&
        grid.gridState.numRows < grid.gridState.maxRows) {
        newNumRows += 1;
    } else if (grid.gridState.numRows - grid.gridEngineState.movingBox.row - grid.gridEngineState.movingBox.rowspan > 1 &&
        grid.gridEngineState.movingBox.row + grid.gridEngineState.movingBox.rowspan === maxRow &&
        grid.gridState.numRows > grid.gridState.minRows &&
        grid.gridState.numRows < grid.gridState.maxRows) {
        newNumRows = maxRow + 1;
    }

    return newNumRows;
}

/**
 * Increases number of gridState.numRows if box touches bottom of wall.
 * @param box {Object}
 * @returns {boolean} true if increase else false.
 */
function increaseNumRows(box, numRows) {
    // Determine when to add extra row to be able to move down:
    // 1. Anytime dragging starts.
    // 2. When dragging starts AND moving box is close to bottom border.
    if ((box.row + box.rowspan) === gridState.numRows &&
        gridState.numRows < gridState.maxRows) {
        gridState.numRows += 1;
        return true;
    }

    return false;
}

/**
 * Decreases number of gridState.numRows to furthest downward box.
 * @returns {boolean} true if increase else false.
 */
let decreaseNumRows = function  () {
    let maxRowNum = 0;

    gridState.boxes.forEach(function (box) {
        if (maxRowNum < (box.row + box.rowspan)) {
            maxRowNum = box.row + box.rowspan;
        }
    });

    if (maxRowNum < gridState.numRows) {gridState.numRows = maxRowNum;}
    if (maxRowNum < gridState.minRows) {gridState.numRows = gridState.minRows;}

    return true;
}

/**
 * Checks min, max box-size.
 * @param {Object} box
 * @returns {boolean}
 */
function isUpdateValid({gridState, box}) {
    if (box.rowspan < gridState.minRowspan ||
        box.rowspan > gridState.maxRowspan ||
        box.columnspan < gridState.minColumnspan ||
        box.columnspan > gridState.maxColumnspan) {
        return false;
    }

    return true;
}

/**
 * Handles border collisions by reverting back to closest edge point.
 * @param {Object} box
 * @returns {boolean} True if collided and cannot move wall else false.
 */
function isBoxOutsideBoundary({box, gridState}) {
    // Top and left border.
    if (box.column < 0 ||
        box.row < 0) {
        return true;
    }

    // Right and bottom border.
    if (box.row + box.rowspan > gridState.maxRows ||
        box.column + box.columnspan > gridState.maxColumns) {
        return true;
    }

    return false;
}
