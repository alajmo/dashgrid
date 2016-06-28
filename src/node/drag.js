import {
    setColumnWidth,
    setRowHeight,
    findIntersectedCells,
    setCellCentroids,
    getClosestCells,
    getGridElementWidth,
    getGridElementHeight,
    getBoxElementXPosition,
    getBoxElementYPosition,
    getBoxElementWidth,
    getBoxElementHeight
} from '../element/render/render.js';

import {updateGridBox} from '../component/grid.js';

export {DragState, dragStart, dragging, dragEnd};

function DragState({gridState}) {
    let dragState = {
        eX: undefined,
        eY: undefined,
        eW: undefined,
        eH: undefined,
        mouseX: 0,
        mouseY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        mOffX: 0,
        mOffY: 0,
        get minTop () {return gridState.yMargin},
        get minLeft () {return gridState.xMargin},
        currentPosition: Object.seal({row: undefined, column: undefined}),
        previousPosition: Object.seal({row: undefined, column: undefined})
    };

    return Object.seal(dragState);
}

/**
 * Create shadowbox, remove smooth transitions for box,
 * and init mouse variables. Finally, make call to api to check if,
 * any box is close to bottom / right
 * @param {Object} box
 * @param {Object} e
 */
function dragStart({grid, box, e}) {
    box.boxElement.element.style.zIndex = 1004;
    box.boxElement.element.style.transition = '';

    grid.gridElement.shadowBox.element.style.left = box.boxElement.element.style.left;
    grid.gridElement.shadowBox.element.style.top = box.boxElement.element.style.top;
    grid.gridElement.shadowBox.element.style.width = box.boxElement.element.style.width;
    grid.gridElement.shadowBox.element.style.height = box.boxElement.element.style.height;
    grid.gridElement.shadowBox.element.style.display = '';

    // Mouse values.
    grid.dragState.lastMouseX = e.pageX;
    grid.dragState.lastMouseY = e.pageY;
    grid.dragState.eX = parseInt(box.boxElement.element.offsetLeft, 10);
    grid.dragState.eY = parseInt(box.boxElement.element.offsetTop, 10);
    grid.dragState.eW = parseInt(box.boxElement.element.offsetWidth, 10);
    grid.dragState.eH = parseInt(box.boxElement.element.offsetHeight, 10);

    grid.gridState.yMargin = 30;

    // grid.updateStart(box);
    // if (dashgrid.draggable.dragStart) {dashgrid.draggable.dragStart();} // user event.
}

/**
 *
 * @param {Object} box
 * @param {Object} e
 */
function dragging({grid, box, e}) {
    updateMovingElement({grid, box, e});

    if (grid.gridState.liveChanges) {
        // Which cell to snap preview box to.
        let left = box.boxElement.element.offsetLeft;
        let right = box.boxElement.element.offsetLeft + box.boxElement.element.offsetWidth;
        let top = box.boxElement.element.offsetTop;
        let bottom = box.boxElement.element.offsetTop + box.boxElement.element.offsetHeight;
        let {boxLeft, boxRight, boxTop, boxBottom} = findIntersectedCells({
            numRows: grid.gridState.numRows,
            numColumns: grid.gridState.numColumns,
            startRow: grid.renderState.startRow,
            startColumn: grid.renderState.startColumn,
            left, right, top, bottom});

        grid.dragState.currentPosition = getClosestCells({
            xMargin: grid.gridState.xMargin,
            yMargin: grid.gridState.yMargin,
            startRow: grid.renderState.startRow,
            startColumn: grid.renderState.startColumn,
            boxLeft, boxRight, boxTop, boxBottom, left, right, top, bottom});

        moveBox({grid, box, e});
    }

    // if (dashgrid.draggable.dragging) {dashgrid.draggable.dragging();} // user event.
}

/**
 *
 * @param {Object} box
 * @param {Object} e
 */
function dragEnd({grid, box, e}) {
    if (!grid.gridState.liveChanges) {

        // Which cell to snap preview box to.
        grid.dragState.currentPosition = getClosestCells({
            left: box.boxElement.element.offsetLeft,
            right: box.boxElement.element.offsetLeft + box.boxElement.element.offsetWidth,
            top: box.boxElement.element.offsetTop,
            bottom: box.boxElement.element.offsetTop + box.boxElement.element.offsetHeight
        });

        moveBox(box, e);
    }

    // Set box style.
    box.boxElement.element.style.transition = grid.gridState.transition;
    box.boxElement.element.style.left = grid.gridElement.shadowBox.element.style.left;
    box.boxElement.element.style.top = grid.gridElement.shadowBox.element.style.top;

    // Give time for previewbox to snap back to tile.
    setTimeout(function () {
        box.boxElement.element.style.zIndex = 1003;
        grid.gridElement.shadowBox.element.style.display = 'none';
        // grid.updateEnd();
    }, grid.gridState.snapBackTime);

    // if (grid.gridState.draggable.dragEnd) {grid.gridState.draggable.dragEnd();} // user event.
}

/**
 *
 * @param {Object} box
 * @param {Object} e
 */
function moveBox({grid, box, e}) {
    if (grid.dragState.currentPosition.row !== grid.dragState.previousPosition.row ||
        grid.dragState.currentPosition.column !== grid.dragState.previousPosition.column) {

        let validMove = updateGridBox({
            grid: grid,
            box: box,
            updateTo: grid.dragState.currentPosition,
            excludeBox: box
        });

        // updateGridDimension preview box.
        if (validMove) {
            let prevScrollHeight = grid.gridElement.element.offsetHeight - window.innerHeight;
            let prevScrollWidth = grid.gridElement.element.offsetWidth - window.innerWidth

            grid.gridElement.shadowBox.element.style.top = getBoxElementYPosition({
                    row: grid.dragState.currentPosition.row,
                    rowHeight: grid.renderState.rowHeight,
                    yMargin: grid.gridState.yMargin
                });

            grid.gridElement.shadowBox.element.style.left = getBoxElementXPosition({
                    column: grid.dragState.currentPosition.column,
                    columnWidth: grid.renderState.columnWidth,
                    xMargin: grid.gridState.xMargin
                });

            let postScrollHeight = grid.gridElement.element.offsetHeight - window.innerHeight;
            let postScrollWidth = grid.gridElement.element.offsetWidth - window.innerWidth;

            // Account for minimizing scroll height when moving box upwards.
            // Otherwise bug happens where the dragged box is changed but directly
            // afterwards the dashgrid element dimension is changed.
            if (Math.abs(grid.gridElement.element.offsetHeight - window.innerHeight - window.scrollY) < 30 &&
                window.scrollY > 0 &&
                prevScrollHeight !== postScrollHeight) {
                box.boxElement.element.style.top = box.boxElement.element.offsetTop - 100  + 'px';
            }

            if (Math.abs(grid.gridElement.element.offsetWidth - window.innerWidth - window.scrollX) < 30 &&
                window.scrollX > 0 &&
                prevScrollWidth !== postScrollWidth) {

                box.boxElement.element.style.left = box.boxElement.element.offsetLeft - 100  + 'px';
            }
        }
    }

    // No point in attempting move if not switched to new cell.
    grid.dragState.previousPosition = {row: grid.dragState.currentPosition.row, column: grid.dragState.currentPosition.column};
}

/**
 * The moving element,
 * @param {Object} box
 * @param {Object} e
 */
function updateMovingElement({grid, box, e}) {
    let maxLeft = grid.gridElement.element.offsetWidth - grid.gridState.xMargin;
    let maxTop = grid.gridElement.element.offsetHeight - grid.gridState.yMargin;

    // Get the current mouse position.
    grid.dragState.mouseX = e.pageX;
    grid.dragState.mouseY = e.pageY;

    // Get the deltas
    let diffX = grid.dragState.mouseX - grid.dragState.lastMouseX + grid.dragState.mOffX;
    let diffY = grid.dragState.mouseY - grid.dragState.lastMouseY + grid.dragState.mOffY;

    grid.dragState.mOffX = 0;
    grid.dragState.mOffY = 0;

    // Update last processed mouse positions.
    grid.dragState.lastMouseX = grid.dragState.mouseX;
    grid.dragState.lastMouseY = grid.dragState.mouseY;

    let dX = diffX;
    let dY = diffY;
    if (grid.dragState.eX + dX < grid.dragState.minLeft) {
        diffX = grid.dragState.minLeft - grid.dragState.eX;
        grid.dragState.mOffX = dX - diffX;
    } else if (grid.dragState.eX + grid.dragState.eW + dX > maxLeft) {
        diffX = maxLeft - grid.dragState.eX - grid.dragState.eW;
        grid.dragState.mOffX = dX - diffX;
    }

    if (grid.gridState.eY + dY < grid.dragState.minTop) {
        diffY = grid.dragState.minTop - grid.gridState.eY;
        grid.dragState.mOffY = dY - diffY;
    } else if (grid.gridState.eY + grid.dragState.eH + dY > maxTop) {
        diffY = maxTop - grid.gridState.eY - grid.dragState.eH;
        grid.dragState.mOffY = dY - diffY;
    }
    grid.dragState.eX += diffX;
    grid.dragState.eY += diffY;

    box.boxElement.element.style.top = grid.dragState.eY + 'px';
    box.boxElement.element.style.left = grid.dragState.eX + 'px';

    // Scrolling when close to bottom boundary.
    if (e.pageY - document.body.scrollTop < grid.gridState.scrollSensitivity) {
        document.body.scrollTop = document.body.scrollTop - grid.gridState.scrollSpeed;
    } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < grid.gridState.scrollSensitivity) {
        document.body.scrollTop = document.body.scrollTop + grid.gridState.scrollSpeed;
    }

    // Scrolling when close to right boundary.
    if (e.pageX - document.body.scrollLeft < grid.gridState.scrollSensitivity) {
        document.body.scrollLeft = document.body.scrollLeft - grid.gridState.scrollSpeed;
    } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < grid.gridState.scrollSensitivity) {
        document.body.scrollLeft = document.body.scrollLeft + grid.gridState.scrollSpeed;
    }
}
