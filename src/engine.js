import {insertionSort, getMaxObj} from './utils.js';

/**
 *
 * @param {Object} box
 * @param {Object} updateTo
 * @param {Object} excludeBox Optional parameter, if updateBox is triggered
 *                            by drag / resize event, then don't update
 *                            the element.
 * @returns {boolean} If update succeeded.
 */
export default function Engine(comp) {
    let {grid, renderer, drawer, boxHandler} = comp;

    let engineRender = EngineRender({grid, drawer, renderer});
    let engineCore = EngineCore({grid, boxHandler});

    let initialize = function () {
        engineCore.addBoxes();
        engineRender.renderGrid();
        engineRender.refreshGrid();
    };

    /**
     *
     * @param {Object} box
     * @param {Object} updateTo
     * @param {Object} excludeBox Optional parameter, if updateBox is triggered
     *                            by drag / resize event, then don't update
     *                            the element.
     * @returns {boolean} If update succeeded.
     */
    let updateBox = function (box, updateTo, excludeBox) {
        let movedBoxes = engineCore.updateBox(box, updateTo);

        if (movedBoxes.length > 0) {
            engineRender.updatePositions(movedBoxes, excludeBox);
            engineRender.renderGrid();

            return true;
        }

        return false;
    };

    /**
    *
    * @param {}
    */
    let removeBox = function () {
        engineBox.removeBox();
        engineRender.renderGrid();
    };

    /**
    *
    * @param {}
    */
    let resizeBox = function () {
        engineRender.updatePositions(movedBoxes); // In case box is not updated by dragging / resizing.
        engineRender.renderGrid();
    };

    /**
    * When dragging / resizing is dropped.
    */
    let dragResizeStart = function (box) {
        engineCore.incrementNumRows(box, 1);
        engineCore.incrementNumColumns(box, 1);
        engineRender.renderGrid();
    };

    /**
    * When dragging / resizing is dropped.
    */
    let draggingResizing = function (box) {
        // engineCore.incrementNumRows(box, 1);
        // engineCore.incrementNumColumns(box, 1);
        // engineRender.renderGrid();
    };

    /**
    * When dragging / resizing is dropped.
    */
    let dragResizeEnd = function () {
        engineCore.decreaseNumRows();
        engineCore.decreaseNumColumns();
        engineRender.renderGrid();
    };

    return Object.freeze({
        initialize: initialize,
        updateBox: updateBox,
        insertBox: engineCore.insertBox,
        removeBox: engineCore.removeBox,
        getBox: engineCore.getBox,
        setActiveBox: engineCore.setActiveBox,
        dragResizeStart: dragResizeStart,
        draggingResizing: draggingResizing,
        dragResizeEnd: dragResizeEnd,
        renderGrid: engineRender.renderGrid,
        refreshGrid: engineRender.refreshGrid
    });
}

/**
 *
 * @param {Function} 5
 * @param {Function} 6
 * @param {Function} 7
 */
function EngineRender(comp) {
    let {grid, drawer, renderer} = comp;

    /**
     * Refresh the grid,
     */
    let refreshGrid = function () {
        drawer.setGridDimensions();
        drawer.drawGrid();
        updatePositions(grid.boxes);
    };

    /**
     * Refresh the grid,
     */
    let renderGrid = function () {
        drawer.updateGrid();
        renderer.setCellCentroids();
        drawer.drawGrid();
    };

    /**
    * @param {Object} excludeBox Don't redraw this box.
    * @param {Object} boxes List of boxes to redraw.
    */
    let updatePositions = function (boxes, excludeBox) {
        window.requestAnimFrame(() => {
            // UpdateGrid moved boxes css.
            boxes.forEach(function (box) {
                if (excludeBox !== box) {
                    drawer.drawBox(box);
                }
            });
        });
    };

    return Object.freeze({
        refreshGrid,
        renderGrid,
        updatePositions
    });
}

/**
 * @description Handles collision logic and grid dimension.
 * @param {Function} 5
 * @param {Function} 6
 * @param {Function} 7
 */
function EngineCore(comp) {
    let {grid, boxHandler} = comp;
    let boxes, movingBox, movedBoxes;

    let addBoxes = function () {
        for (let i = 0, len = grid.boxes.length; i < len; i++) {
            boxHandler.createBox(grid.boxes[i]);
        }
        boxes = grid.boxes;
    };

    let getBox = function (element) {
        for (let i = boxes.length - 1; i >= 0; i--) {
            if (boxes[i].element === element) {return boxes[i]}
        };
    };

    let copyBox = function (box) {
        return {
            row: box.row,
            column: box.column,
            rowspan: box.rowspan,
            columnspan: box.columnspan
        };
    };

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

    let restoreOldPositions = function (prevPositions) {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].row = prevPositions[i].row,
            boxes[i].column = prevPositions[i].column,
            boxes[i].columnspan = prevPositions[i].columnspan,
            boxes[i].rowspan = prevPositions[i].rowspan
        };
    };

    let removeBox = function (boxIndex) {
        let elem = boxes[boxIndex].element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

        updateNumRows();
        updateNumColumns();
    };

    /**
    * Insert a box. Box must contain at least the size and position of the box,
    * content element is optional.
    * @param {Object} box Box dimensions.
    * @returns {Boolean} If insert was possible.
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
     * @returns {Array} movedBoxes
     */
    let updateBox = function (box, updateTo) {
        movingBox = box;

        let prevPositions = copyBoxes()

        makeChange(box, updateTo);
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
    * If a dimension state is not added, use the box current state.
    * @param {Object} box Box which is updating.
    * @param {Object} updateTo New dimension state.
    * @returns {Boolean}
    */
    let makeChange = function (box, updateTo) {
        if (updateTo.row !== undefined) {box.row = updateTo.row;}
        if (updateTo.column !== undefined) {box.column = updateTo.column;}
        if (updateTo.rowspan !== undefined) {box.rowspan = updateTo.rowspan;}
        if (updateTo.columnspan !== undefined) {box.columnspan = updateTo.columnspan;}
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {Object} box
     * @param {objects} excludeBox
     * @param {objects} movedBoxes
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
     * @param {objects} excludeBox
     * @param {Object} movedBoxes
     * @return {bool} If move is allowed
     */
    let collisionHandler = function (box, boxB, excludeBox, movedBoxes) {
        setBoxPosition(box, boxB)
        return moveBox(boxB, excludeBox, movedBoxes);
    };

    /**
    * Calculates new box position based on the box that pushed it.
    * @param {Object} box Box which has moved.
    * @param {Object} boxB Box which is to be moved.
    * @returns {Boolean}
    */
    let setBoxPosition = function (box, boxB) {
        boxB.row += box.row + box.rowspan - boxB.row;
    };

    /**
     * Given a box, finds other boxes which intersect with it.
     * @param {Object} box
     * @param {Array} excludeBox Array of boxes.
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
    *
    * @param {}
    * @returns {Boolean}
    */
    let updateNumColumns = function () {
        let currentMaxColumn = getMaxObj(boxes, 'column', 'columnspan');

        if (currentMaxColumn >= grid.minColumns) {
            grid.numColumns = currentMaxColumn;
        }

        if (grid.numColumns - movingBox.column - movingBox.columnspan < 1) {
            grid.numColumns += 1;
        } else if (grid.numColumns - movingBox.column - movingBox.columnspan > 1 &&
            movingBox.column + movingBox.columnspan === currentMaxColumn &&
            grid.numColumns > grid.minColumns) {
            grid.numColumns = currentMaxColumn + 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    let incrementNumColumns = function (box, numColumns) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if ((box.column + box.columnspan) === grid.numColumns &&
            grid.numColumns < grid.maxColumns) {
            grid.numColumns += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest leftward box.
     * @param box {Object}
     * @returns boolean true if increase else false.
     */
    let decreaseNumColumns = function  () {
        let maxColumnNum = 0;

        // Expand / Decrease number of grid.numRows if needed.
        let box = getMaxObj(boxes, 'x');

        boxes.forEach(function (boxB) {
            if (maxColumnNum < (boxB.column + boxB.columnspan)) {maxColumnNum = boxB.column + boxB.columnspan;}
        });

        if (maxColumnNum < grid.numColumns) {grid.numColumns = maxColumnNum;}
        if (maxColumnNum < grid.minColumns) {grid.numColumns = grid.minColumns;}

        return true;
    };

    /**
     * Number rows depends on three things.
     *  1. Min / Max Rows.
     *  2. Max Box.
     *  3. Dragging box near bottom border.
     *
     * @param {bool} isDragging
     */
    let updateNumRows = function () {
        let currentMaxRow = getMaxObj(boxes, 'row', 'rowspan');

        if (currentMaxRow >= grid.minRows) {
            grid.numRows = currentMaxRow;
        }

        // Moving box when close to border.
        if (grid.numRows - movingBox.row - movingBox.rowspan < 1 &&
            grid.numRows < grid.maxRows) {
            grid.numRows += 1;
        } else if (grid.numRows - movingBox.row - movingBox.rowspan > 1 &&
            movingBox.row + movingBox.rowspan === currentMaxRow &&
            grid.numRows > grid.minRows &&
            grid.numRows < grid.maxRows) {
            grid.numRows = currentMaxRow + 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {Object}
     * @returns {boolean} true if increase else false.
     */
    let incrementNumRows = function (box, numRows) {
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if ((box.row + box.rowspan) === grid.numRows &&
            grid.numRows < grid.maxRows) {
            grid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest downward box.
     * @param box {Object}
     * @returns boolean true if increase else false.
     */
    let decreaseNumRows = function  () {
        let maxRowNum = 0;

        boxes.forEach(function (boxB) {
            if (maxRowNum < (boxB.row + boxB.rowspan)) {
                maxRowNum = boxB.row + boxB.rowspan;
            }
        });

        if (maxRowNum < grid.numRows) {grid.numRows = maxRowNum;}
        if (maxRowNum < grid.minRows) {grid.numRows = grid.minRows;}

        return true;
    };

    /**
    * Checks min, max box-size.
    * @param {}
    * @returns {Boolean}
    */
    let isUpdateValid = function (box) {
        if (box.rowspan < grid.minRowspan ||
            box.rowspan > grid.maxRowspan ||
            box.columnspan < grid.minColumnspan ||
            box.columnspan > grid.maxColumnspan) {
            return false;
        }

        return true;
    };

    /**
     * Handles border collisions by reverting back to closest edge point.
     * @param box object
     * @returns boolean True if collided and cannot move wall else false.
     */
    let isBoxOutsideBoundary = function (box) {
        // Top and left border.
        if (box.column < 0 ||
            box.row < 0) {
            return true;
        }

        // Right and bottom border.
        if (box.row + box.rowspan > grid.maxRows ||
            box.column + box.columnspan > grid.maxColumns) {
            return true;
        }

        return false;
    };

    return Object.freeze({
        addBoxes,
        updateBox,
        incrementNumRows,
        incrementNumColumns,
        decreaseNumRows,
        decreaseNumColumns,
        getBox,
        insertBox,
        removeBox
    });
}
