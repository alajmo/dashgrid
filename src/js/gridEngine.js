/**
 * gridEngine.js: Grid logic.
 */

import {getSortedArr, insertByOrder, getMaxObj} from "./utils.js";
import {createBox} from "./box.js";

export default function GridEngine (obj) {
    let {grid, renderer, drawer} = obj;

    let boxes = [];
    let numRows = grid.minRows;
    let numColumns = grid.numColumns;
    let isDragging = false;
    let movingBox;
    let oldBoxPositions;
    let activeBox = {};

    let getNumRows = () => { return numRows; };
    let getNumColumns = () => { return numColumns; };

    /**
     * Initializes the grid by inserting the boxes and drawing the grid.
     */
    let initialize = function () {
        grid.boxes.forEach(function (box) {
            insertBox({box: box});
        });
        singleFloaters();
        refreshGrid();
    };

    /**
     * Refresh the grid,
     */
    let refreshGrid = function () {
        drawer.renderGrid({numRows: numRows, numColumns: numColumns});
        drawer.drawGrid({numRows: numRows, numColumns: numColumns});
        drawBoxes();
    };

    /**
     *
     */
    let insertBox = function (obj) {
        let {box} = obj;
        createBox({box: box, gridElement: grid.element});
        boxes.push(box);
    };

    /**
     * @desc Draws boxes to DOM.
     */
    let drawBoxes = function () {
        boxes.forEach(function (box) {
            drawer.drawBox({box: box});
        });
    };

    /**
      *
      */
    let updatePositions = function (obj) {
        let {excludeBox, movedBoxes} = obj;

        // UpdateGrid moved boxes css.
        movedBoxes.forEach(function (box) {
            if (excludeBox !== box) {
                drawer.drawBox({box: box});
            }
        });

    };

    /**
     * @desc Floats all floatable boxes up as much as possible, doesn"t
     * effect boxes which grid.floating is set to false.
     */
    let floatAllUp = function () {
        // Order matters in which elements float up.
        let orderedBoxes = getSortedArr("asc", "y", boxes);

        orderedBoxes.forEach(function (b) {
            if (b.floating === true) {
                floatUp({box: b});
            }
        });
    };

    /**
     *  @desc Find the furtest upward position a box can float
     *      and float it up.
     *  @param {object} box
     */
    let floatUp = function (box) {
        let intersectedBoxes;

        while (box.row > 0) {
            box.row -= 1;
            intersectedBoxes = findIntersectedBoxes({
                box: box,
                excludeBox: {}
            });

            if (intersectedBoxes.length > 0) {
                box.row += 1
                break;
            }
        }
    };

    /**
     * @desc
     */
    let setActiveBox = function (box) {
        activeBox = box;
    };

    let isValidBoxChange = function (box, updateTo) {

        if ((box.row === updateTo.row &&
            box.column === updateTo.column &&
            box.rowspan === updateTo.rowspan &&
            box.columnspan === updateTo.columnspan) ||
            (updateTo.rowspan < 1) || (updateTo.columnspan < 1)) {
            return false;
        }

        return true;
    };

    /**
     *
     */
    let updateBox = function (box, updateTo) {
        movingBox = box;

        // Check box max conditions.
        if (!isValidBoxChange(box, updateTo)) {return false;}

        // Copy old positions to move back if move fails.
        oldBoxPositions = saveOldBoxes();

        if (updateTo.row !== undefined) {
            box.row = updateTo.row;
        }
        if (updateTo.column !== undefined) {
            box.column = updateTo.column;
        }
        if (updateTo.rowspan !== undefined) {
            box.rowspan = updateTo.rowspan;
        }
        if (updateTo.columnspan !== undefined) {
            box.columnspan = updateTo.columnspan;
        }

        // Is the dragging box a floater?
        if (box.floating) {floatUp(box);}

        // Attempt the move.
        let movedBoxes = [];
        let canOccupy = canOccupyCell({
            box: box,
            excludeBox: box,
            movedBoxes: movedBoxes
        });

        // If move fails revert back.
        if (!canOccupy) {revertBoxes(oldBoxPositions);}

        // TODO: Check out that floatAllUp and singleFloaters don"t do the
        // same thing or is redudant.
        // Handle all box floats.
        if (grid.floating) {floatAllUp();}

        // Handle single box floaters.
        singleFloaters();

        updateNumRows({isDragging: true});

        // In case box is updated directly from updateBox and not via
        // manual dragging or resizing.
        updatePositions({
            excludeBox: activeBox === box ? box : "",
            movedBoxes: boxes
        });

        movingBox = {};

        return {
            row: box.row,
            column: box.column,
            rowspan: box.rowspan,
            columnspan: box.columnspan,
        };
    };


    /**
     *
     */
    let handleDimensionChange = function () {
        renderer.setCellCentroids({
            numRows: numRows,
            numColumns: numColumns
        });

        drawer.updateGridSize({numRows: numRows, numColumns: numColumns});
        drawer.drawGrid({numRows: numRows, numColumns: numColumns});
    };

    /**
     *
     */
    let singleFloaters = function () {
        boxes.forEach(function (box) {
            if (box.floating) {floatUp({box: box});}
        });
    };

    /**
     *
     */
    let saveOldBoxes = function () {
        let oldBoxPositions = [];
        boxes.forEach(function (box) {
            oldBoxPositions.push({
                row: box.row,
                column: box.column,
                rowspan: box.rowspan,
                columnspan: box.columnspan
            });
        });

        return oldBoxPositions;
    };

    /**
     * @desc
     * @param {bool} isDragging
     */
    let updateNumRows = function (obj) {
        let {isDragging} = obj;
        let currentMaxRow = getMaxObj(boxes, "row");

        decreaseNumRows();

        // Determine when to add extra row to be able to move down:
        // 1st: anytime dragging starts
        // 2nd: or when dragging starts AND moving box is close
        // to bottom border.
        if (isDragging === true &&
            (activeBox.row + activeBox.rowspan) === numRows &&
            numRows < grid.maxRows) {
            numRows += 1;
        }

        handleDimensionChange();
    };

    /**
     *
     */
    let revertBoxes = function (oldBoxPositions) {
        oldBoxPositions.forEach(function (box, i) {
            boxes[i].row = oldBoxPositions[i].row;
            boxes[i].column = oldBoxPositions[i].column;
            boxes[i].rowspan = oldBoxPositions[i].rowspan;
            boxes[i].columnspan = oldBoxPositions[i].columnspan;
        });
    };

    /**
     * @desc Checks whether 2 boxes intersect using bounding box method.
     * @param boxA object
     * @param boxB object
     * @returns boolean True if intersect else false.
     */
    let doBoxesIntersect = function (obj) {
        let {box, boxB} = obj;
        if (box.column < boxB.column + boxB.columnspan &&
                box.column + box.columnspan > boxB.column &&
                box.row < boxB.row + boxB.rowspan &&
                box.rowspan + box.row > boxB.row) {
        }

        return (box.column < boxB.column + boxB.columnspan &&
                box.column + box.columnspan > boxB.column &&
                box.row < boxB.row + boxB.rowspan &&
                box.rowspan + box.row > boxB.row);
    };

    /**
     * @desc Given a box, finds other boxes which intersect with it.
     * @param box {object}
     * @param excludeBox {array of objects}
     */
    let findIntersectedBoxes = function (obj) {
        let {box, excludeBox} = obj;
        let intersectingBoxes = [];

        // let closeBoxes = hashMapping.getBoxesFromHash(box);
        // let cells = hashMapping.findIntersectedCells(box);

        boxes.forEach(function (boxB) {
            if (box !== boxB && boxB !== excludeBox) {
                if (doBoxesIntersect({box: box, boxB: boxB})) {
                    insertByOrder({
                        order: "desc",
                        attr: "y",
                        o: boxB,
                        arr: intersectingBoxes
                    });
                }
            }
        });

        return intersectingBoxes;

    };

    /**
     * @desc Increases number of numRows if box touches bottom of wall.
     * @param box {object}
     * @returns {boolean} true if increase else false.
     */
    let increaseNumRows = function (bottomBoxEdge) {

        if ((bottomBoxEdge + 1) < grid.maxRows) {
            numRows += 1;
            return true;
        }

        return false;
    };

    /**
     * @desc Decreases number of numRows to furthest downward box.
     * @param box {object}
     * @returns boolean true if increase else false.
     */
    let decreaseNumRows = function  () {
        let maxRowNum = 0;

        // Expand / Decrease number of numRows if needed.
        let box = getMaxObj(boxes, "y");

        boxes.forEach(function (boxB) {
            if (maxRowNum < (boxB.row + boxB.rowspan)) {
                maxRowNum = boxB.row + boxB.rowspan;
            }
        });

        if (maxRowNum < numRows) {
            numRows = maxRowNum;
        }

        if (maxRowNum < grid.minRows) {
            numRows = grid.minRows;
        }

        return true;
    };

    /**
     * @desc Handles border collisions by reverting back to closest edge point.
     * @param box object
     * @returns boolean True if collided and cannot move wall else false.
     */
    let handleBoundaryInteraction = function (box) {
        // top, right, left border.
        if (box.column < 0 ||
            box.column + box.columnspan > numColumns ||
            box.row < 0) {
            return true;
        }

        // Bottom border.
        // on collision expand till max numRows reached.
        let bottomBoxEdge = box.row + box.rowspan;
        let hasIncreased;
        if (bottomBoxEdge > numRows) { // box.row + box.rowspan > numRows

            hasIncreased = increaseNumRows(bottomBoxEdge);
            if (hasIncreased) {
                return false;
            }
            return true;

        }

        return false;
    };

    let isSwappable = function (obj) {
        let {boxA, boxB} = obj;
        if (boxA.rowspan === boxB.rowspan
            && boxA.columnspan === boxB.columnspan) {
            return true;
        }
        return false;
    };

    /**
     * Swap two boxes.
     */
    let swapBoxes = function (obj) {
        // TODO: correct oldboxposition index.
        let {boxA, boxB} = obj;
        // boxB.row = oldBoxPositions[boxA.id].row;
        // boxB.column = oldBoxPositions[boxA.id].column;
    };

    /**
     * Propagates box collisions.
     * @param {object} box
     * @param {object} boxB
     * @param {objects} excludeBox
     * @param {object} movedBoxes
     * @return {bool} If move is allowed
     */
    let handleBoxCollision = function (obj) {
        let {box, boxB, excludeBox, movedBoxes} = obj;
        let hasMoved = true;

        let swappable;
        if (movingBox === box &&
            box.swapping === true && boxB.swapping === true) {
            swappable = isSwappable({boxA: box, boxB: boxB});
            if (swappable) {
                swapBoxes({boxA: box, boxB: boxB});
                return true;
            }
        }

        if (boxB.stacking === true) { return true; }

        if (boxB.pushable === false) { return false; }

        boxB.row += box.row + box.rowspan - boxB.row;

        return canOccupyCell({
            box: boxB,
            excludeBox: excludeBox,
            movedBoxes: movedBoxes
        });
    };

    /**
     * Checks and handles collisions with wall and boxes.
     * @Works as a tree, propagating moves down the collision tree and returns
     *     true or false depending if the box infront is able to move.
     * @param {object} box
     * @param {objects} excludeBox
     * @param {objects} movedBoxes
     * @return {boolean} true if move is possible, false otherwise.
     */
    let canOccupyCell = function (obj) {
        let {box, excludeBox, movedBoxes} = obj;
        let intersectedBoxes;
        let hasMoved;

        movedBoxes.push(box);

        let collidedWithBoundary = handleBoundaryInteraction(box);
        if (collidedWithBoundary) { return false; }

        if (grid.stacking) { return true; }

        // Handle Block Collision, recursive tree system.
        intersectedBoxes = findIntersectedBoxes({
            box: box,
            excludeBox: excludeBox
        });

        // If grid.pushable is disabled.
        if (!grid.pushable && intersectedBoxes.length > 0) { return false; }

        // Handle collision.
        return intersectedBoxes.every(function (boxB, i, e) {
            return handleBoxCollision({
                box: box,
                boxB: boxB,
                excludeBox: excludeBox,
                movedBoxes: movedBoxes
            });
        });

        return true;
    };

    let getBox = function (element) {
        let box;

        grid.boxes.forEach(function (b) {
            if (b.element === element) {
                box = b;
            }
        });

        return box;
    }

    return Object.freeze({
        initialize,
        insertBox,
        updateBox,
        getBox,
        drawBoxes,
        getNumRows,
        getNumColumns,
        setActiveBox,
        updateNumRows,
        refreshGrid
    });

}
