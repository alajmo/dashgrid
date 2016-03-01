/**
 * gridEngine.js: Grid logic.
 *
 */

import {insertionSort, getMaxObj} from './utils.js';

export default function Engine(comp) {
    let {grid, renderer, drawer, boxHandler} = comp;

    let engineView = EngineView({grid, drawer, renderer});
    let engineCore = EngineCore({grid, boxHandler, engineView});

    /**
     *
     */
    return Object.freeze({
        initialize: engineCore.initialize,
        updateBox: engineCore.updateBox,
        insertBox: engineCore.insertBox,
        removeBox: engineCore.removeBox,
        getBox: engineCore.getBox,
        getNumRows: engineCore.getNumRows,
        getNumColumns: engineCore.getNumColumns,
        setActiveBox: engineCore.setActiveBox,
        updateNumRows: engineCore.updateNumRows,
        updateNumColumns: engineCore.updateNumColumns,
        updateDimensionState: engineView.updateDimensionState,
        refreshGrid: engineView.refreshGrid
    });
}

/**
* Handles rendering to DOM.
*/
function EngineView(comp) {
    let {grid, drawer, renderer} = comp;

    /**
     * Refresh the grid,
     */
    let refreshGrid = function () {
        drawer.renderGrid();
        drawer.drawGrid();
        drawBoxes();
    };

    let updateDimensionState = function () {
        renderer.setCellCentroids();
        drawer.updateGrid();
        drawer.drawGrid();
    };

    /**
     * Draws boxes.
     */
    let drawBoxes = function () {
        for (var i = 0, len = grid.boxes.length; i < len; i++) {
            drawer.drawBox(grid.boxes[i]);
        }
    };

    /**
    *
    * @param {}
    * @returns
    */
    let updatePositions = function (excludeBox, movedBoxes) {
        window.requestAnimFrame(() => {
            // UpdateGrid moved boxes css.
            for (var i = 0, len = movedBoxes.a.length; i < len; i++) {
                if (excludeBox !== movedBoxes.a[i].bref) {
                    drawer.drawBox(movedBoxes.a[i].bref);
                }
            }
        });
    };

    return {refreshGrid, updateDimensionState, updatePositions};
}

function EngineCore(comp) {
    let {grid, boxHandler, engineView} = comp;
    let boxes, movingBox, movedBoxes;
    let isDragging = false;
    let activeBox = {};

    let initialize = function () {
        boxes = grid.boxes;
        addBox();
        engineView.refreshGrid();
    };

    let addBox = function () {
        for (var i = 0, len = boxes.length; i < len; i++) {boxHandler.createBox(boxes[i]);}
    };
    let getBox = function (element) {
        for (var i = boxes.length - 1; i >= 0; i--) {
            if (boxes[i].element === element) {return boxes[i]}
        };
    };
    let copyBox = function (box) {
        return {row: box.row,column: box.column,rowspan: box.rowspan,columnspan: box.columnspan};
    };
    let setActiveBox = function (box) {
        activeBox = box;
    };
    let updateBoxState = function (movedBoxes) {
        for (var i = 0, len = movedBoxes.a.length; i < len; i++) {
            movedBoxes.w[movedBoxes.a[i]].row = movedBoxes.a[i].row;
            movedBoxes.w[movedBoxes.a[i]].column = movedBoxes.a[i].column;
            movedBoxes.w[movedBoxes.a[i]].rowspan = movedBoxes.a[i].rowspan;
            movedBoxes.w[movedBoxes.a[i]].columnspan = movedBoxes.a[i].columnspan;
        }
    };

    let removeBox = function (boxIndex) {
        var elem = boxes[boxIndex].element;
        elem.parentNode.removeChild(elem);
        boxes.splice(boxIndex, 1);

        updateNumRows(false);
        updateNumColumns(false);
        engineView.updateDimensionState();
    };

    let insertBox = function (box) {
        movingBox = box;
        let boxB = copyBox(box);

        decorateBox(box, boxB);
        if (!isUpdateValid(boxB)) {return false;}

        let movedBoxes = [boxB];
        let validMove = moveBox(boxB, boxB, movedBoxes);

        movingBox = undefined;

        if (validMove) {
            boxHandler.createBox(box);
            boxes.push(box);
            updateBoxState(movedBoxes);
            engineView.updatePositions(activeBox === box ? box : {}, movedBoxes); // In case box is not updated by dragging / resizing.
            updateNumRows(false);
            updateNumColumns(false);
            engineView.updateDimensionState();
            return boxB;
        }

        return false;
    };

    /**
     * Updates a position or size of box.
     * @desc
     * 1. Check constraints such as outside grid and that there is a change.
     * 2. Save old positions in case move is later found to be invalid.
     * 3.
     * @param {Object} box The box being updated.
     * @param {Object} updateTo The new position and/or size.
     */
    let updateBox = function (box, updateTo) {
        movingBox = box;
        let boxB = copyBox(box);

        decorateBox(updateTo, boxB);

        if (!isUpdateValid(boxB)) {return false;}

        let movedBoxes = new Map();

        movedBoxes.w.set(boxB, box);
        movedBoxes.a.push(box);

        let validMove = moveBox(boxB, boxB, movedBoxes);
        movingBox = undefined;

        if (validMove) {
            updateBoxState(movedBoxes);
            engineView.updatePositions(activeBox === box ? box : {}, movedBoxes); // In case box is not updated by dragging / resizing.
            updateNumRows(true);
            updateNumColumns(true);
            engineView.updateDimensionState();
            return boxB;
        }

        return false;
    };

    let decorateBox = function (updateTo, boxB) {
        if (updateTo.row !== undefined) {boxB.row = updateTo.row;}
        if (updateTo.column !== undefined) {boxB.column = updateTo.column;}
        if (updateTo.rowspan !== undefined) {boxB.rowspan = updateTo.rowspan;}
        if (updateTo.columnspan !== undefined) {boxB.columnspan = updateTo.columnspan;}
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {object} box
     * @param {objects} excludeBox
     * @param {objects} movedBoxes
     * @return {boolean} true if move is possible, false otherwise.
     */
    let moveBox = function (box, excludeBox, movedBoxes) {
        if (isBoxOutsideBoundary(box)) {return false;}

        let intersectedBoxes = getIntersectedBoxes(box, excludeBox, movedBoxes);

        // Handle box Collision, recursive model.
        for (var i = 0, len = intersectedBoxes.length; i < len; i++) {
            if (!collisionHandler(box, intersectedBoxes[i], excludeBox, movedBoxes)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Propagates box collisions.
     * @param {object} box
     * @param {object} boxB
     * @param {objects} excludeBox
     * @param {object} movedBoxes
     * @return {bool} If move is allowed
     */
    let collisionHandler = function (box, boxB, excludeBox, movedBoxes) {
        movedBoxes.w.set(boxB, boxB);
        movedBoxes.a.push(boxB);
        boxB.row += box.row + box.rowspan - boxB.row;
        return moveBox(boxB, excludeBox, movedBoxes);
    };

    /**
     * Given a box, finds other boxes which intersect with it.
     * @param {Object} box
     * @param {Array} excludeBox Array of boxes.
     */
    let getIntersectedBoxes = function (box, excludeBox, movedBoxes) {

        let intersectedBoxes = [];
        for (var i = 0, len = boxes.length; i < len; i++) {
            // Don't check moving box and the box itself.
            if (box.bref !== boxes[i] && boxes[i] !== excludeBox) {
                if (doBoxesIntersect(box, boxes[i])) {
                    intersectedBoxes.push(copyBox(boxes[i]));
                }
            }
        }

        insertionSort(intersectedBoxes);
        console.log(intersectedBoxes);

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
     * @param {bool} isDragging
     */
    let updateNumColumns = function (isDragging) {
        let currentMaxColumns = getMaxObj(boxes, 'column');

        decreaseNumColumns();
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if (isDragging === true &&
            (activeBox.column + activeBox.columnspan) === grid.numColumns &&
            grid.numColumns < grid.maxColumns) {
            grid.numColumns += 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {object}
     * @returns {boolean} true if increase else false.
     */
    let increaseNumColumns = function (bottomBoxEdge) {
        if ((bottomBoxEdge + 1) < grid.maxRows) {
            grid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest downward box.
     * @param box {object}
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
     *
     * @param {bool} isDragging
     */
    let updateNumRows = function (isDragging) {
        let currentMaxRow = getMaxObj(boxes, 'row');

        decreaseNumRows();
        // Determine when to add extra row to be able to move down:
        // 1. Anytime dragging starts.
        // 2. When dragging starts AND moving box is close to bottom border.
        if (isDragging === true &&
            (activeBox.row + activeBox.rowspan) === grid.numRows &&
            grid.numRows < grid.maxRows) {
            grid.numRows += 1;
        }
    };

    /**
     * Increases number of grid.numRows if box touches bottom of wall.
     * @param box {object}
     * @returns {boolean} true if increase else false.
     */
    let increaseNumRows = function (bottomBoxEdge) {
        if ((bottomBoxEdge + 1) < grid.maxRows) {
            grid.numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * Decreases number of grid.numRows to furthest downward box.
     * @param box {object}
     * @returns boolean true if increase else false.
     */
    let decreaseNumRows = function  () {
        let maxRowNum = 0;

        // Expand / Decrease number of grid.numRows if needed.
        let box = getMaxObj(boxes, 'y');

        boxes.forEach(function (boxB) {
            if (maxRowNum < (boxB.row + boxB.rowspan)) {maxRowNum = boxB.row + boxB.rowspan;}
        });

        if (maxRowNum < grid.numRows) {grid.numRows = maxRowNum;}
        if (maxRowNum < grid.minRows) {grid.numRows = grid.minRows;}

        return true;
    };

    /**
    * Checks min, max box-size.
    * @param {}
    * @returns
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
        // top, left border.
        if (box.column < 0 ||
            box.row < 0) {
            return true;
        }

        // right, bottom border.
        if (box.row + box.rowspan > grid.maxRows ||
            box.column + box.columnspan > grid.maxColumns) {
            return true;
        }

        return false;
    };

    return {
        initialize,
        updateBox,
        setActiveBox,
        updateNumRows,
        updateNumColumns,
        getBox,
        insertBox,
        removeBox
    };
}
