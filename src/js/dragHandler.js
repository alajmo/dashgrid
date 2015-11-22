/**
 * dragHandler.js: Handles all box drag actions.
 */

export default function DragHandler(obj) {
    let {grid, renderer, updateBox, getNumRows, getNumColumns,
        updateNumRows, getBox, setActiveBox} = obj;

    let boxElement;
    // X position of mouse relative to box.
    let xRelativeBox = 0;
    // Y position of mouse relative to box.
    let yRelativeBox = 0;

    // Move
    let updateTo = {
        column: undefined,
        row: undefined,
        columnspan: undefined,
        rowspan: undefined
    };
    // Used to prevent attempting a move when box not snapped to new cell.
    let lastUpdateTo = {
        column: undefined,
        row: undefined,
        columnspan: undefined,
        rowspan: undefined
    };

    let activeBox;

    let dragStart = function (e) {
        boxElement = e.target;
        activeBox = getBox(boxElement);
        setActiveBox(activeBox);

        if (!grid.draggable.enabled || !activeBox.draggable) {return;}

        // x position of mouse, resets after box move
        let mouseX = 0;
        // y position of mouse, resets after box move
        let mouseY = 0;

        // Removes transitions.
        boxElement.className += " grid-box-moving";

        // Display and initialize positions for preview box.
        grid.shadowBoxElement.style.left = boxElement.style.left;
        grid.shadowBoxElement.style.top = boxElement.style.top;
        grid.shadowBoxElement.style.width = boxElement.style.width;
        grid.shadowBoxElement.style.height = boxElement.style.height;
        grid.shadowBoxElement.style.display = "block";

        // Mouse clicked position.
        mouseX = e.clientX + window.scrollX;
        mouseY = e.clientY + window.scrollY;

        // Position relative to box. Constant.
        xRelativeBox = mouseX - parseInt(grid.shadowBoxElement.style.left);
        yRelativeBox = mouseY - parseInt(grid.shadowBoxElement.style.top);
        // TODO: Add custom drag start function.

        // Engine calls.
        updateNumRows({isDragging: true});
    };

    /**
     *  Drag.
     */
    let drag = function (e) {
        if (!grid.draggable.enabled || !activeBox.draggable) {return;}

        let calibratedX = e.clientX + window.scrollX;
        let calibratedY = e.clientY + window.scrollY;

        updateMovingElement(calibratedX, calibratedY);

        let boxPosition = {
            left: boxElement.offsetLeft,
            right: boxElement.offsetLeft + boxElement.offsetWidth,
            top: boxElement.offsetTop,
            bottom: boxElement.offsetTop + boxElement.offsetHeight
        }

        // Which cell to snap preview box to.
        updateTo = renderer.getClosestCells({
            boxPosition: boxPosition,
            numRows: getNumRows(),
            numColumns: getNumColumns()
        });

        if (grid.liveChanges) {
            dragBox(e);
        }
    };

    /**
     *
     */
    let dragStop = function (e) {
        if (!grid.draggable.enabled || !activeBox.draggable) {return;}

        if (!grid.liveChanges) {
            dragBox(e);
        }

        boxElement.classList.remove("grid-box-moving"); // no ie support.
        boxElement.style.left = grid.shadowBoxElement.style.left;
        boxElement.style.top = grid.shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = "none";
        }, 300);

        lastUpdateTo = {
                column: null,
                row: null
            };

        updateNumRows({isDragging: false});
        // TODO: Add custom drag stop function.
        setActiveBox({});
    };

    /**
     *
     */
    let dragBox = function (e) {
        if (updateTo.row !== lastUpdateTo.row ||
            updateTo.column !== lastUpdateTo.column) {

            // Attempt the move. Returns updateTo as it is needed if element
            // is switched.
            updateTo = updateBox(activeBox, updateTo);

            // UpdateGrid preview box.
            if (updateTo) {
                renderer.setBoxYPosition({
                    element: grid.shadowBoxElement,
                    row: updateTo.row
                });
                renderer.setBoxXPosition({
                    element: grid.shadowBoxElement,
                    column: updateTo.column
                });
            }
        }

        // No point in attempting move if not switched to new cell.
        lastUpdateTo.row = updateTo.row;
        lastUpdateTo.column = updateTo.column;
    };

    /**
     *
     */
    let updateMovingElement = function (x, y) {
        // Order of css and snap to wall matters.
        boxElement.style.left = x - xRelativeBox + "px";
        boxElement.style.top = y - yRelativeBox + "px";

        // Snap to wall if attempt to go outside boundary.
        // Left/right boundaries.
        if (boxElement.offsetLeft < grid.xMargin) {
            boxElement.style.left = grid.xMargin + "px";
        }
        else if ((boxElement.offsetLeft + boxElement.offsetWidth) >
            (grid.element.offsetWidth - grid.xMargin)) {
            boxElement.style.left = "auto";
            boxElement.style.right = grid.xMargin + "px";
        }

        // Top/bottom boundaries.
        if (boxElement.offsetTop < grid.yMargin) {
            boxElement.style.top = grid.yMargin + "px";
        }
        else if (boxElement.offsetTop + boxElement.offsetHeight >
            grid.element.offsetHeight - grid.yMargin) {
            boxElement.style.top = "auto";
            boxElement.style.bottom = grid.yMargin + "px";
        }
    };

    return Object.freeze({
        dragStart,
        drag,
        dragStop
    });
}
