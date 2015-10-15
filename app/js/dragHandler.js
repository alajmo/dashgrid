/**
 *
 */

export default function DragHandler(spec) {
    let {grid, renderer, moveBox, getNumRows, getNumColumns,
        updateNumRows, setMovingBox} = spec;

    let boxElement;
    // X position of mouse relative to box.
    let xRelBox = 0;
    // Y position of mouse relative to box.
    let yRelBox = 0;
    // Next attempted move.
    let moveTo = {
        column: -1,
        row: -1
    };
    // Used to prevent attempting a move when box not snapped to new cell.
    let lastMoveTo = {
        column: null,
        row: null
    };

    // Shadow /gray element.
    let previewBoxElement = spec.previewBoxElement;

    /**
     *
     */
    let dragStart = function (e) {
        boxElement = e.target;
        // x position of mouse, resets after box move
        let mouseX = 0;
        // y position of mouse, resets after box move
        let mouseY = 0;

        // Removes transitions.
        boxElement.className += ' grid-box-moving';

        // Display and initialize positions for previefw box.
        previewBoxElement.style.left = boxElement.style.left;
        previewBoxElement.style.top = boxElement.style.top;
        previewBoxElement.style.width = boxElement.style.width;
        previewBoxElement.style.height = boxElement.style.height;
        previewBoxElement.style.display = 'block';

        // Mouse clicked position.
        mouseX = e.clientX + window.scrollX;
        mouseY = e.clientY + window.scrollY;

        // Position relative to box. Constant.
        xRelBox = mouseX - parseInt(previewBoxElement.style.left);
        yRelBox = mouseY - parseInt(previewBoxElement.style.top);
        // TODO: Add custom drag start function.

        // Engine calls.
        setMovingBox({boxId: boxElement.id});
        updateNumRows({isDragging: true});
    };

    /**
     *
     */
    let drag = function (e) {
        let calibratedX = e.clientX + window.scrollX;
        let calibratedY = e.clientY + window.scrollY;
        updateHoverElement(calibratedX, calibratedY);

        let relPos = {
            left: boxElement.offsetLeft,
            right: boxElement.offsetLeft + boxElement.offsetWidth,
            top: boxElement.offsetTop,
            bottom: boxElement.offsetTop + boxElement.offsetHeight
        }

        // Which cell to snap preview box to.
        moveTo = renderer.getClosestCells({
            relPos: relPos,
            numRows: getNumRows(),
            numColumns: getNumColumns()
        });

        if (grid.liveChanges !== 'drop') {
            move(e);
        }
    };

    /**
     *
     */
    let move = function (e) {
        if (lastMoveTo.row !== moveTo.row ||
            lastMoveTo.column !== moveTo.column) {

            // Attempt the move.
            let moveAccepted = moveBox({
                boxId: boxElement.id,
                moveTo: moveTo
            });

            // UpdateGrid preview box.
            if (moveAccepted) {
                renderer.setBoxYPosition({
                    element: previewBoxElement,
                    row: moveAccepted.row
                });
                renderer.setBoxXPosition({
                    element: previewBoxElement,
                    column: moveAccepted.column
                });
            }
        }

        // No point in attempting move if not switched to new cell.
        lastMoveTo.row = moveTo.row;
        lastMoveTo.column = moveTo.column;
    };

    /**
     *
     */
    let dragStop = function (e) {
        if (grid.liveChanges === 'drop') {
            move(e);
        }

        boxElement.classList.remove('grid-box-moving'); // no ie support.
        boxElement.style.left = previewBoxElement.style.left;
        boxElement.style.top = previewBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            previewBoxElement.style.display = 'none';
        }, 300);

        updateNumRows({isDragging: false});
        // TODO: Add custom drag stop function.
    };

    /**
     *
     */
    let updateHoverElement = function (x, y) {
        // Order of css and snap to wall matters.
        boxElement.style.left = x - xRelBox + 'px';
        boxElement.style.top = y - yRelBox + 'px';

        // Snap to wall if attempt to go outside boundary.
        // Left/right boundaries.
        if (boxElement.offsetLeft < grid.xMargin) {
            boxElement.style.left = grid.xMargin + 'px';
        } else if ((boxElement.offsetLeft + boxElement.offsetWidth) >
            (grid.element.offsetWidth - grid.xMargin)) {
            boxElement.style.left = 'auto';
            boxElement.style.right = grid.xMargin + 'px';
        }

        // Top/bottom boundaries.
        if (boxElement.offsetTop < grid.yMargin) {
            boxElement.style.top = grid.yMargin + 'px';
        } else if (boxElement.offsetTop + boxElement.offsetHeight >
            grid.element.offsetHeight - grid.yMargin) {
            boxElement.style.top = 'auto';
            boxElement.style.bottom = grid.yMargin + 'px';
        }
    };

    return Object.freeze({
        dragStart,
        drag,
        dragStop
    });
}
