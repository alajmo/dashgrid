/**
 * resizeHandler.js: Handles all resize actions.
 */

export default function ResizeHandler(obj) {
    let {grid, renderer, updateBox, getNumRows, getNumColumns,
        updateNumRows, getBox, setActiveBox} = obj;

    let boxElement;

    let minWidth;
    let minHeight;

    let elementLeft;
    let elementTop;
    let elementWidth;
    let elementHeight;

    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let mOffX = 0;
    let mOffY = 0;
    let minTop;
    let maxTop;
    let minLeft;
    let maxLeft;

    let className;

    // update / Resize.
    let updateTo = {
        column: undefined,
        row: undefined,
        columnspan: undefined,
        rowspan: undefined
    };

    // Used to prevent attempting a update when box not snapped to new cell.
    let lastUpdateTo = {
        column: undefined,
        row: undefined,
        columnspan: undefined,
        rowspan: undefined
    };

    let activeBox;

    /**
     *
     */
    let resizeStart = function (e) {
        boxElement = e.target.parentNode;
        className = e.target.className;
        activeBox = getBox(boxElement);
        setActiveBox(activeBox);

        if (!grid.resizable.enabled || !activeBox.resizable) {return;}

        minWidth = renderer.getWidthPerCell();
        minHeight = renderer.getHeightPerCell();

        // Removes transitions.
        boxElement.className += " grid-box-moving";

        // Display and initialize positions for preview box.
        grid.shadowBoxElement.style.left = boxElement.style.left;
        grid.shadowBoxElement.style.top = boxElement.style.top;
        grid.shadowBoxElement.style.width = boxElement.style.width;
        grid.shadowBoxElement.style.height = boxElement.style.height;
        grid.shadowBoxElement.style.display = "block";

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
        updateNumRows({isDragging: true});
    };

    /**
     *
     */
    let resizing = function (e) {
        if (!grid.resizable.enabled || !activeBox.resizable) {return;}

        let calibratedX = e.pageX + window.scrollX;
        let calibratedY = e.pageY + window.scrollY;

        updateResizingElement(e, calibratedX, calibratedY);

        let boxPosition = {
            left: boxElement.offsetLeft,
            right: boxElement.offsetLeft + boxElement.offsetWidth,
            top: boxElement.offsetTop,
            bottom: boxElement.offsetTop + boxElement.offsetHeight
        }

        // Which cell to snap shadowbox to.
        let {boxLeft, boxRight,
            boxTop, boxBottom} = renderer.findIntersectedCells({
                boxPosition: boxPosition,
                numRows: getNumRows(),
                numColumns: getNumColumns()
            });

        updateTo.row = boxTop;
        updateTo.column = boxLeft;
        updateTo.rowspan = boxBottom - boxTop + 1;
        updateTo.columnspan = boxRight - boxLeft + 1;

        if (grid.liveChanges) { resize(e); }
    };

    /**
     *
     */
    let resizeStop = function (e) {
        if (!grid.resizable.enabled || !activeBox.resizable) { return; }

        if (!grid.liveChanges) {
            resize(e);
        }

        boxElement.classList.remove("grid-box-moving"); // no ie support.
        boxElement.style.left = grid.shadowBoxElement.style.left;
        boxElement.style.top = grid.shadowBoxElement.style.top;
        boxElement.style.width = grid.shadowBoxElement.style.width;
        boxElement.style.height = grid.shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = "none";
        }, 300);

        lastUpdateTo = {
                row: undefined,
                column: undefined,
                rowspan: undefined,
                columnspan: undefined
            };

        updateNumRows({isDragging: false});

        setActiveBox({});
    };

    /**
     *
     */
    let resize = function (e) {
        if (updateTo.row !== lastUpdateTo.row  ||
            updateTo.column !== lastUpdateTo.column  ||
            updateTo.rowspan !== lastUpdateTo.rowspan  ||
            updateTo.columnspan !== lastUpdateTo.columnspan ) {

            let update = updateBox(activeBox, updateTo);

            // // UpdateGrid preview box.
            if (update) {
                renderer.setBoxYPosition({
                    element: grid.shadowBoxElement,
                    row: update.row
                });
                renderer.setBoxXPosition({
                    element: grid.shadowBoxElement,
                    column: update.column
                });
                renderer.setBoxWidth({
                    element: grid.shadowBoxElement,
                    columnspan: update.columnspan
                });
                renderer.setBoxHeight({
                    element: grid.shadowBoxElement,
                    rowspan: update.rowspan
                });
            }
        }

        // No point in attempting update if not switched to new cell.
        lastUpdateTo.row = updateTo.row;
        lastUpdateTo.column = updateTo.column;
        lastUpdateTo.rowspan = updateTo.rowspan;
        lastUpdateTo.columnspan = updateTo.columnspan;
    };

    /**
     *
     */
    let updateResizingElement = function (e, x, y) {
        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        let diffX = mouseX - lastMouseX + mOffX;
        let diffY = mouseY - lastMouseY + mOffY;
        mOffX = mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        let dY = diffY;
        let dX = diffX;

        minTop = grid.yMargin;
        maxTop = grid.element.offsetHeight - grid.yMargin;
        minLeft = grid.xMargin;
        maxLeft = grid.element.offsetWidth - grid.xMargin;

        if (className.indexOf("grid-box-handle-w") > -1 ||
            className.indexOf("grid-box-handle-nw") > -1 ||
            className.indexOf("grid-box-handle-sw") > -1) {
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

        if (className.indexOf("grid-box-handle-e") > -1 ||
            className.indexOf("grid-box-handle-ne") > -1 ||
            className.indexOf("grid-box-handle-se") > -1) {
            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxLeft) {
                diffX = maxLeft - elementLeft - elementWidth;
                mOffX = dX - diffX;
            }
            elementWidth += diffX;
        }

        if (className.indexOf("grid-box-handle-n") > -1 ||
            className.indexOf("grid-box-handle-nw") > -1 ||
            className.indexOf("grid-box-handle-ne") > -1) {
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

        if (className.indexOf("grid-box-handle-s") > -1 ||
            className.indexOf("grid-box-handle-sw") > -1 ||
            className.indexOf("grid-box-handle-se") > -1) {
            if (elementHeight + dY < minHeight) {
                diffY = minHeight - elementHeight;
                mOffY = dY - diffY;
            } else if (elementTop + elementHeight + dY > maxTop) {
                diffY = maxTop - elementTop - elementHeight;
                mOffY = dY - diffY;
            }
            elementHeight += diffY;
        }

        boxElement.style.top = elementTop + "px";
        boxElement.style.left = elementLeft + "px";
        boxElement.style.width = elementWidth + "px";
        boxElement.style.height = elementHeight + "px";
    };

    return Object.freeze({
        resizeStart,
        resizing,
        resizeStop
    });

}
