import {removeNodes, insertionSort, getMaxNum} from './utils.js';
// import {box} from './box.js';

export {gridEngine};
/**
 * @description Handles collision logic and dashgrid dimension.
 * @param {Object} obj
 */
function gridEngine() {

    let init = function (state) {
        // updateNumRows();
        // updateNumColumns();
     };

    /**
     * Given a DOM element, retrieve corresponding js object from boxes.
     * @param {Object} element DOM element.
     * @returns {Object} box Given a DOM element, return corresponding box object.
     */
    let getBox = function (element) {
        for (let i = 0, len = boxes.length; i < len; i++) {
            if (boxes[i]._element === element) {return boxes[i]}
        };
    };

    /**
     * Copy box positions.
     * @returns {Array.<Object>} Previous box positions.
     */
    let copyBoxes = function () {
        let prevPositions = [];
        for (let i = 0; i < boxes.length; i++) {
            prevPositions.push({
                row: boxes[i].row,
                column: boxes[i].column,
                columnspan: boxes[i].columnspan,
                rowspan: boxes[i].rowspan
            });
        };

        return prevPositions;
    };

    /**
     * Restore Old positions.
     * @param {Array.<Object>} Previous positions.
     */
    let restoreOldPositions = function (prevPositions) {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].row = prevPositions[i].row,
            boxes[i].column = prevPositions[i].column,
            boxes[i].columnspan = prevPositions[i].columnspan,
            boxes[i].rowspan = prevPositions[i].rowspan
        };
    };

    /**
     * Remove a box given its index in the boxes array.
     * @param {number} boxIndex.
     */
    let removeBox = function (boxIndex) {
        let elem = boxes[boxIndex]._element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

        // In case floating is on.
        updateNumRows();
        updateNumColumns();
    };

    /**
     * Insert a box. Box must contain at least the size and position of the box,
     * content element is optional.
     * @param {Object} box Box dimensions.
     * @returns {boolean} If insert was possible.
     */
    let insertBox = function (box) {
        movingBox = box;

        if (box.rows === undefined && box.column === undefined &&
            box.rowspan === undefined && box.columnspan === undefined) {
            return false;
        }

        if (!isUpdateValid(box)) {
            return false;
        }

        let prevPositions = copyBoxes();

        let movedBoxes = [box];
        let validMove = moveBox(box, box, movedBoxes);
        movingBox = undefined;

        if (validMove) {
            boxHandler.createBox(box);
            boxes.push(box);

            updateNumRows();
            updateNumColumns();
            return box;
        }

        restoreOldPositions(prevPositions);

        return false;
    };

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
    let updateBox = function (box, updateTo) {
        movingBox = box;

        let prevPositions = copyBoxes()

        Object.assign(box, updateTo);
        if (!isUpdateValid(box)) {
            restoreOldPositions(prevPositions);
            return false;
        }

        let movedBoxes = [box];
        let validMove = moveBox(box, box, movedBoxes);

        if (validMove) {
            updateNumRows();
            updateNumColumns();

            return movedBoxes;
        }

        restoreOldPositions(prevPositions);

        return [];
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {Object} box
     * @param {Array.<Object>} excludeBox
     * @param {Array.<Object>} movedBoxes
     * @return {boolean} true if move is possible, false otherwise.
     */
    let moveBox = function (box, excludeBox, movedBoxes) {
        if (isBoxOutsideBoundary(box)) {return false;}

        let intersectedBoxes = getIntersectedBoxes(box, excludeBox, movedBoxes);

        // Handle box Collision, recursive model.
        for (let i = 0, len = intersectedBoxes.length; i < len; i++) {
            if (!collisionHandler(box, intersectedBoxes[i], excludeBox, movedBoxes)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Propagates box collisions.
     * @param {Object} box
     * @param {Object} boxB
     * @param {Object} excludeBox
     * @param {Array.<Object>} movedBoxes
     * @return {boolean} If move is allowed
     */
    let collisionHandler = function (box, boxB, excludeBox, movedBoxes) {
        setBoxPosition(box, boxB)
        return moveBox(boxB, excludeBox, movedBoxes);
    };

    /**
     * Calculates new box position based on the box that pushed it.
     * @param {Object} box Box which has moved.
     * @param {Object} boxB Box which is to be moved.
     */
    let setBoxPosition = function (box, boxB) {
        boxB.row += box.row + box.rowspan - boxB.row;
    };

    /**
     * Given a box, finds other boxes which intersect with it.
     * @param {Object} box
     * @param {Array.<Object>} excludeBox Array of boxes.
     */
    let getIntersectedBoxes = function (box, excludeBox, movedBoxes) {
        let intersectedBoxes = [];
        for (let i = 0, len = boxes.length; i < len; i++) {
            // Don't check moving box and the box itself.
            if (box !== boxes[i] && boxes[i] !== excludeBox) {
                if (doBoxesIntersect(box, boxes[i])) {
                    movedBoxes.push(boxes[i]);
                    intersectedBoxes.push(boxes[i]);
                }
            }
        }
        insertionSort(intersectedBoxes, 'row');

        return intersectedBoxes;
    };

    /**
     * Checks whether 2 boxes intersect using bounding box method.
     * @param {Object} boxA
     * @param {Object} boxB
     * @returns boolean True if intersect else false.
     */
    let doBoxesIntersect = function (box, boxB) {
        return (box.column < boxB.column + boxB.columnspan &&
                box.column + box.columnspan > boxB.column &&
                box.row < boxB.row + boxB.rowspan &&
                box.rowspan + box.row > boxB.row);
    };

    /**
     * Updates the number of columns.
     */
    let updateNumColumns = function () {
        let maxColumn = getMaxNum(boxes, 'column', 'columnspan');

        if (maxColumn >= dashgrid.minColumns) {
            dashgrid.numColumns = maxColumn;
        }

        if (!movingBox) {
            return;
        }

        if (dashgrid.numColumns - movingBox.column - movingBox.columnspan === 0 &&
            dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns += 1;
        } else if (dashgrid.numColumns - movingBox.column- movingBox.columnspan > 1 &&
            movingBox.column + movingBox.columnspan === maxColumn &&
            dashgrid.numColumns > dashgrid.minColumns &&
            dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns = maxColumn + 1;
        }
    };

    /**
     * Increases number of dashgrid.numRows if box touches bottom of wall.
     * @param {Object} box
     * @param {number} numColumns
     * @returns {boolean} true if increase else false.
     */
    let increaseNumColumns = function (box, numColumns) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts and moving box is close to bottom border.
        if ((box.column + box.columnspan) === dashgrid.numColumns &&
            dashgrid.numColumns < dashgrid.maxColumns) {
            dashgrid.numColumns += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of dashgrid.numRows to furthest leftward box.
     * @returns boolean true if increase else false.
     */
    let decreaseNumColumns = function  () {
        let maxColumnNum = 0;

        boxes.forEach(function (box) {
            if (maxColumnNum < (box.column + box.columnspan)) {
                maxColumnNum = box.column + box.columnspan;
            }
        });

        if (maxColumnNum < dashgrid.numColumns) {dashgrid.numColumns = maxColumnNum;}
        if (maxColumnNum < dashgrid.minColumns) {dashgrid.numColumns = dashgrid.minColumns;}

        return true;
    };

    /**
     * Number rows depends on three things.
     * <ul>
     *     <li>Min / Max Rows.</li>
     *     <li>Max Box.</li>
     *     <li>Dragging box near bottom border.</li>
     * </ul>
     *
     */
    let updateNumRows = function () {
        let maxRow = getMaxNum(boxes, 'row', 'rowspan');

        if (maxRow >= dashgrid.minRows) {
            dashgrid.numRows = maxRow;
        }

        if (!movingBox) {
            return;
        }

        // Moving box when close to border.
        if (dashgrid.numRows - movingBox.row - movingBox.rowspan === 0 &&
            dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows += 1;
        } else if (dashgrid.numRows - movingBox.row - movingBox.rowspan > 1 &&
            movingBox.row + movingBox.rowspan === maxRow &&
            dashgrid.numRows > dashgrid.minRows &&
            dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows = maxRow + 1;
        }

    };

    /**
     * Increases number of dashgrid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    let increaseNumRows = function (box, numRows) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if ((box.row + box.rowspan) === dashgrid.numRows &&
            dashgrid.numRows < dashgrid.maxRows) {
            dashgrid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of dashgrid.numRows to furthest downward box.
     * @returns {boolean} true if increase else false.
     */
    let decreaseNumRows = function  () {
        let maxRowNum = 0;

        boxes.forEach(function (box) {
            if (maxRowNum < (box.row + box.rowspan)) {
                maxRowNum = box.row + box.rowspan;
            }
        });

        if (maxRowNum < dashgrid.numRows) {dashgrid.numRows = maxRowNum;}
        if (maxRowNum < dashgrid.minRows) {dashgrid.numRows = dashgrid.minRows;}

        return true;
    };

    /**
     * Checks min, max box-size.
     * @param {Object} box
     * @returns {boolean}
     */
    let isUpdateValid = function (box) {
        if (box.rowspan < dashgrid.minRowspan ||
            box.rowspan > dashgrid.maxRowspan ||
            box.columnspan < dashgrid.minColumnspan ||
            box.columnspan > dashgrid.maxColumnspan) {
            return false;
        }

        return true;
    };

    /**
     * Handles border collisions by reverting back to closest edge point.
     * @param {Object} box
     * @returns {boolean} True if collided and cannot move wall else false.
     */
    let isBoxOutsideBoundary = function (box) {
        // Top and left border.
        if (box.column < 0 ||
            box.row < 0) {
            return true;
        }

        // Right and bottom border.
        if (box.row + box.rowspan > dashgrid.maxRows ||
            box.column + box.columnspan > dashgrid.maxColumns) {
            return true;
        }

        return false;
    };

    return Object.freeze({
        init,
        updateBox,
        updateNumRows,
        increaseNumRows,
        decreaseNumRows,
        updateNumColumns,
        increaseNumColumns,
        decreaseNumColumns,
        getBox,
        insertBox,
        removeBox
    });
}
