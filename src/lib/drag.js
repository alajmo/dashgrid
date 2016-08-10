import * as Render from './render.js';
import * as GridMethod from './gridMethod.js';

export {start, dragging, end};

/**
 * Initialize Dragging.
 * any box is close to bottom / right
 * @param {Object} box
 * @param {Object} e
 */
function start({grid, box, e}) {
    // Initialize moving box.
    box.element.box.style.zIndex = 1004;
    box.element.box.style.transition = '';

    // Initialize shadowBox.
    grid.element.shadowBox.style.left = box.element.box.style.left;
    grid.element.shadowBox.style.top = box.element.box.style.top;
    grid.element.shadowBox.style.width = box.element.box.style.width;
    grid.element.shadowBox.style.height = box.element.box.style.height;
    grid.element.shadowBox.style.display = 'block';

    // Mouse values.
    grid.state.mouse.lastMouseX = e.pageX;
    grid.state.mouse.lastMouseY = e.pageY;
    grid.state.mouse.eX = parseInt(box.element.box.offsetLeft, 10);
    grid.state.mouse.eY = parseInt(box.element.box.offsetTop, 10);
    grid.state.mouse.eW = parseInt(box.element.box.offsetWidth, 10);
    grid.state.mouse.eH = parseInt(box.element.box.offsetHeight, 10);

    // grid.updateStart(box);
    // if (dashgrid.draggable.start) {dashgrid.draggable.start();} // user event.
}

/**
 * During dragging.
 * @param {Object} box
 * @param {Object} e
 */
function dragging({grid, box, e}) {
    updateMovingElement({grid, box, e});

    if (grid.state.grid.liveChanges) {
        // Which cell to snap preview box to.
        // TODO: fix left / top, gives wrong value of -20.
        let left = box.element.box.offsetLeft;
        let right = box.element.box.offsetLeft + box.element.box.offsetWidth;
        let top = box.element.box.offsetTop;
        let bottom = box.element.box.offsetTop + box.element.box.offsetHeight;
        let {boxLeft, boxRight, boxTop, boxBottom} = Render.findIntersectedCells({
            numRows: grid.state.grid.numRows,
            numColumns: grid.state.grid.numColumns,
            startRow: grid.state.render.startRow,
            startColumn: grid.state.render.startColumn,
            left, right, top, bottom});

        grid.state.mouse.currentPosition = Render.getClosestCells({
            xMargin: grid.state.grid.xMargin,
            yMargin: grid.state.grid.yMargin,
            startRow: grid.state.render.startRow,
            startColumn: grid.state.render.startColumn,
            boxLeft, boxRight, boxTop, boxBottom, left, right, top, bottom});

        moveBox({grid, box, e});
    }

    // if (dashgrid.draggable.dragging) {dashgrid.draggable.dragging();} // user event.
}

/**
 * On drag end.
 * @param {Object} box
 * @param {Object} e
 */
function end({grid, box, e}) {
    if (!grid.state.grid.liveChanges) {

        // Which cell to snap preview box to.
        grid.state.mouse.currentPosition = getClosestCells({
            left: box.element.box.offsetLeft,
            right: box.element.box.offsetLeft + box.element.box.offsetWidth,
            top: box.element.box.offsetTop,
            bottom: box.element.box.offsetTop + box.element.box.offsetHeight
        });

        moveBox(box, e);
    }

    // Set box style.
    box.element.box.style.transition = grid.state.grid.transition;
    box.element.box.style.left = grid.element.shadowBox.style.left;
    box.element.box.style.top = grid.element.shadowBox.style.top;

    // Give time for previewbox to snap back to tile.
    setTimeout(function () {
        box.element.box.style.zIndex = 1003;
        grid.element.shadowBox.style.display = 'none';
        // grid.updateEnd();
    }, grid.state.grid.snapBackTime);

    // if (grid.state.grid.draggable.dragEnd) {grid.state.grid.draggable.dragEnd();} // user event.
}

/**
 * Attempt to move box.
 * @param {Object} box
 * @param {Object} e
 */
function moveBox({grid, box, e}) {
    if (grid.state.mouse.currentPosition.row !== grid.state.mouse.previousPosition.row ||
        grid.state.mouse.currentPosition.column !== grid.state.mouse.previousPosition.column) {

        let validMove = GridMethod.updateBox({grid, box,
            updateTo: grid.state.mouse.currentPosition
        });

        // updateGridDimension preview box.
        if (validMove) {
            let prevScrollHeight = grid.element.shadowBox.offsetHeight - window.innerHeight;
            let prevScrollWidth = grid.element.shadowBox.offsetWidth - window.innerWidth

            grid.element.shadowBox.style.top = Render.getBoxElementYPosition({
                    row: grid.state.mouse.currentPosition.row,
                    rowHeight: grid.state.render.rowHeight,
                    yMargin: grid.state.grid.yMargin
                });

            grid.element.shadowBox.style.left = Render.getBoxElementXPosition({
                    column: grid.state.mouse.currentPosition.column,
                    columnWidth: grid.state.render.columnWidth,
                    xMargin: grid.state.grid.xMargin
                });

            let postScrollHeight = grid.element.shadowBox.offsetHeight - window.innerHeight;
            let postScrollWidth = grid.element.shadowBox.offsetWidth - window.innerWidth;

            // Account for minimizing scroll height when moving box upwards.
            // Otherwise bug happens where the dragged box is changed but directly
            // afterwards the dashgrid element dimension is changed.
            if (Math.abs(grid.element.shadowBox.offsetHeight - window.innerHeight - window.scrollY) < 30 &&
                window.scrollY > 0 &&
                prevScrollHeight !== postScrollHeight) {
                box.element.box.style.top = box.element.box.offsetTop - 100  + 'px';
            }

            if (Math.abs(grid.element.shadowBox.offsetWidth - window.innerWidth - window.scrollX) < 30 &&
                window.scrollX > 0 &&
                prevScrollWidth !== postScrollWidth) {

                box.element.box.style.left = box.element.box.offsetLeft - 100  + 'px';
            }
        }
    }

    // No point in attempting move if not switched to new cell.
    grid.state.mouse.previousPosition = {row: grid.state.mouse.currentPosition.row, column: grid.state.mouse.currentPosition.column};
}

/**
 * Moves the moving box.
 * @param {Object} grid
 * @param {Object} box
 * @param {Object} e event
 */
function updateMovingElement({grid, box, e}) {
    Render.updateRenderBoundary(grid);

    // Get the current mouse position.
    grid.state.mouse.mouseX = e.pageX;
    grid.state.mouse.mouseY = e.pageY;

    // Get the deltas
    let diffX = grid.state.mouse.mouseX - grid.state.mouse.lastMouseX + grid.state.mouse.mOffX;
    let diffY = grid.state.mouse.mouseY - grid.state.mouse.lastMouseY + grid.state.mouse.mOffY;

    grid.state.mouse.mOffX = 0;
    grid.state.mouse.mOffY = 0;

    // Update last processed mouse positions.
    grid.state.mouse.lastMouseX = grid.state.mouse.mouseX;
    grid.state.mouse.lastMouseY = grid.state.mouse.mouseY;

    let dX = diffX;
    let dY = diffY;
    if (grid.state.mouse.eX + dX < grid.state.render.minLeft) {
        diffX = grid.state.render.minLeft - grid.state.mouse.eX;
        grid.state.mouse.mOffX = dX - diffX;
    } else if (grid.state.mouse.eX + grid.state.mouse.eW + dX > grid.state.render.maxLeft) {
        diffX = grid.state.render.maxLeft - grid.state.mouse.eX - grid.state.mouse.eW;
        grid.state.mouse.mOffX = dX - diffX;
    }

    if (grid.state.mouse.eY + dY < grid.state.render.minTop) {
        diffY = grid.state.render.minTop - grid.state.mouse.eY;
        grid.state.mouse.mOffY = dY - diffY;
    } else if (grid.state.mouse.eY + grid.state.mouse.eH + dY > grid.state.render.maxTop) {
        diffY = grid.state.render.maxTop - grid.state.mouse.eY - grid.state.mouse.eH;
        grid.state.mouse.mOffY = dY - diffY;
    }

    grid.state.mouse.eX += diffX;
    grid.state.mouse.eY += diffY;

    box.element.box.style.left = grid.state.mouse.eX + 'px';
    box.element.box.style.top = grid.state.mouse.eY + 'px';

    // Scrolling when close to bottom boundary.
    if (e.pageY - document.body.scrollTop < grid.state.grid.scrollSensitivity) {
        document.body.scrollTop = document.body.scrollTop - grid.state.grid.scrollSpeed;
    } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < grid.state.grid.scrollSensitivity) {
        document.body.scrollTop = document.body.scrollTop + grid.state.grid.scrollSpeed;
    }

    // Scrolling when close to right boundary.
    if (e.pageX - document.body.scrollLeft < grid.state.grid.scrollSensitivity) {
        document.body.scrollLeft = document.body.scrollLeft - grid.state.grid.scrollSpeed;
    } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < grid.state.grid.scrollSensitivity) {
        document.body.scrollLeft = document.body.scrollLeft + grid.state.grid.scrollSpeed;
    }
}
