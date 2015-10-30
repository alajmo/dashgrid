/**
 *  @desc resize handler.
 */
export default function ResizeHandler(obj) {
    let {grid, renderer, resizeBox, getNumRows, getNumColumns,
        updateNumRows, setActiveBox} = obj;

    /**
     *  Locals.
     */
    let timer;
    let boxElement;

    let minWidth;
    let minHeight;

    // Move / Resize.
    let changeTo = {
        column: undefined,
        row: undefined,
        columnspan: undefined,
        rowspan: undefined
    };
    // Used to prevent attempting a move when box not snapped to new cell.
    let lastChangeTo = {
        column: undefined,
        row: undefined,
        columnspan: undefined,
        rowspan: undefined
    };

    let elementLeft, elementTop, elementWidth, elementHeight,
    mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0,
    mOffX = 0,
    mOffY = 0,

    minTop = 0,
    maxTop = 9999,
    minLeft = 20;

    let handlers = {w: false, e: false, n: false, s: false};

    let className;
    /**
     *
     */
    let resizeStart = function (e) {
        boxElement = e.target.parentNode;
        className = e.target.className;

        minWidth = renderer.getWidthPerCell();
        minHeight = renderer.getHeightPerCell();

        // Removes transitions.
        boxElement.className += ' grid-box-moving';

        // Display and initialize positions for preview box.
        grid.shadowBoxElement.style.left = boxElement.style.left;
        grid.shadowBoxElement.style.top = boxElement.style.top;
        grid.shadowBoxElement.style.width = boxElement.style.width;
        grid.shadowBoxElement.style.height = boxElement.style.height;
        grid.shadowBoxElement.style.display = 'block';

        // Get the current mouse position.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;

        // Record current widget dimensions
        elementLeft = parseInt(boxElement.style.left, 10);
        elementTop = parseInt(boxElement.style.top, 10);
        elementWidth = boxElement.offsetWidth;
        elementHeight = boxElement.offsetHeight;

        // TODO: Add custom drag start function.
        // Engine calls.
        setActiveBox({boxId: boxElement.id});
        updateNumRows({isDragging: true});
    };

    /**
     *
     */
    let resizing = function (e) {
        let calibratedX = e.pageX + window.scrollX;
        let calibratedY = e.pageY + window.scrollY;

        updateResizingElement(e, calibratedX, calibratedY);

        let relPos = {
            left: boxElement.offsetLeft,
            right: boxElement.offsetLeft + boxElement.offsetWidth,
            top: boxElement.offsetTop,
            bottom: boxElement.offsetTop + boxElement.offsetHeight
        }

        // Which cell to snap shadowbox to.
        let {boxLeft, boxRight, boxTop, boxBottom} = renderer.findIntersectedCells({
            relPos: relPos,
            numRows: getNumRows(),
            numColumns: getNumColumns()
        });

        changeTo.row = boxTop;
        changeTo.column = boxLeft;
        changeTo.rowspan = boxBottom - boxTop + 1;
        changeTo.columnspan = boxRight - boxLeft + 1;

        if (grid.liveChanges !== 'drop') {
            resize(e);
        }
    };

    /**
     *
     */
    let resize = function (e) {
        if (changeTo.row !== lastChangeTo.row  ||
            changeTo.column !== lastChangeTo.column  ||
            changeTo.rowspan !== lastChangeTo.rowspan  ||
            changeTo.columnspan !== lastChangeTo.columnspan ) {

            // Attempt the move.
            let resizeAccepted = resizeBox({
                boxId: boxElement.id,
                changeTo: changeTo
            });

            // // UpdateGrid preview box.
            if (resizeAccepted) {
                renderer.setBoxYPosition({
                    element: grid.shadowBoxElement,
                    row: resizeAccepted.row
                });
                renderer.setBoxXPosition({
                    element: grid.shadowBoxElement,
                    column: resizeAccepted.column
                });
                renderer.setBoxWidth({
                    element: grid.shadowBoxElement,
                    columnspan: changeTo.columnspan
                });
                renderer.setBoxHeight({
                    element: grid.shadowBoxElement,
                    rowspan: changeTo.rowspan
                });
            }
        }

        // No point in attempting move if not switched to new cell.
        lastChangeTo.row = changeTo.row;
        lastChangeTo.column = changeTo.column;
        lastChangeTo.rowspan = changeTo.rowspan;
        lastChangeTo.columnspan = changeTo.columnspan;
    };

    /**
     *
     */
    let resizeStop = function (e) {
        if (grid.liveChanges === 'drop') {
            resize(e);
        }

        boxElement.classList.remove('grid-box-moving'); // no ie support.
        boxElement.style.left = grid.shadowBoxElement.style.left;
        boxElement.style.top = grid.shadowBoxElement.style.top;
        boxElement.style.width = grid.shadowBoxElement.style.width;
        boxElement.style.height = grid.shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = 'none';
        }, 300);

        lastChangeTo = {
                column: undefined,
                row: undefined,
                columnspan: undefined,
                rowspan: undefined
            };

        handlers = {w: false, e: false, n: false, s: false};

        updateNumRows({isDragging: false});
    };

    /**
     *
     */
    let updateResizingElement = function (e, x, y) {
        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        var diffX = mouseX - lastMouseX + mOffX;
        var diffY = mouseY - lastMouseY + mOffY;
        mOffX = mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        var dY = diffY,
            dX = diffX;

        if (className.indexOf('grid-box-handle-w') > -1 ||
            className.indexOf('grid-box-handle-nw') > -1 ||
            className.indexOf('grid-box-handle-sw') > -1) {
            if (elementWidth - dX < minWidth) {
                diffX = elementWidth - minWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + dX < minLeft) {
                diffX = minLeft - elementLeft;
                mOffX = dX - diffX;
            }
            elementLeft += diffX;
            elementWidth -= diffX;
        }
        let maxX = grid.element.offsetWidth - grid.xMargin;
        if (className.indexOf('grid-box-handle-e') > -1 ||
            className.indexOf('grid-box-handle-ne') > -1 ||
            className.indexOf('grid-box-handle-se') > -1) {
            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxX) {
                diffX = maxX - elementLeft - elementWidth;
                mOffX = dX - diffX;
            }
            elementWidth += diffX;
        }
        if (className.indexOf('grid-box-handle-n') > -1 ||
            className.indexOf('grid-box-handle-nw') > -1 ||
            className.indexOf('grid-box-handle-ne') > -1) {
            if (elementHeight - dY < minHeight) {
                diffY = elementHeight - minHeight;
                mOffY = dY - diffY;
            } else if (elementTop + dY < minTop) {
                diffY = minTop - elementTop;
                mOffY = dY - diffY;
            }
            elementTop += diffY;
            elementHeight -= diffY;
        }
        if (className.indexOf('grid-box-handle-s') > -1 ||
            className.indexOf('grid-box-handle-sw') > -1 ||
            className.indexOf('grid-box-handle-se') > -1) {
            if (elementHeight + dY < minHeight) {
                diffY = minHeight - elementHeight;
                mOffY = dY - diffY;
            } else if (elementTop + elementHeight + dY > maxTop) {
                diffY = maxTop - elementTop - elementHeight;
                mOffY = dY - diffY;
            }
            elementHeight += diffY;
        }

        boxElement.style.top = elementTop + 'px';
        boxElement.style.left = elementLeft + 'px';
        boxElement.style.width = elementWidth + 'px';
        boxElement.style.height = elementHeight + 'px';
    };

    return Object.freeze({
        resizeStart,
        resizing,
        resizeStop
    });

}
