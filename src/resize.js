export default Resizer;

function Resizer(comp) {
    let {grid, renderer, engine} = comp;

    let minWidth, minHeight, elementLeft, elementTop, elementWidth, elementHeight, minTop, maxTop, minLeft, maxLeft, className,
    mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0,
    mOffX = 0,
    mOffY = 0,
    newState = {},
    prevState = {};

    /**
    * Set active box, create shadowbox, remove smooth transitions for box,
    * and initialize mouse variables. Finally, make call to api to check if,
    * any box is close to bottom / right edge.
    * @param {}
    * @returns
    */
    let resizeStart = function (box, e) {
        className = e.target.className;

        // Removes transitions, displays and initializes positions for preview box.
        box.element.style.transition = 'None';
        grid.shadowBoxElement.style.left = box.element.style.left;
        grid.shadowBoxElement.style.top = box.element.style.top;
        grid.shadowBoxElement.style.width = box.element.style.width;
        grid.shadowBoxElement.style.height = box.element.style.height;
        grid.shadowBoxElement.style.display = 'block';

        // Mouse values.
        minWidth = grid.columnWidth;
        minHeight = grid.rowHeight;
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        elementLeft = parseInt(box.element.style.left, 10);
        elementTop = parseInt(box.element.style.top, 10);
        elementWidth = box.element.offsetWidth;
        elementHeight = box.element.offsetHeight;

        engine.updateNumRows(true);
        engine.updateNumColumns(true);
        engine.updateDimensionState();

        if (grid.resizable.resizeStart) {grid.resizable.resizeStart();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let resize = function (box, e) {
        updateResizingElement(box, e);

        if (grid.liveChanges) {
            // Which cell to snap shadowbox to.
            let {boxLeft, boxRight, boxTop, boxBottom} = renderer.
                findIntersectedCells({
                    left: box.element.offsetLeft,
                    right: box.element.offsetLeft + box.element.offsetWidth,
                    top: box.element.offsetTop,
                    bottom: box.element.offsetTop + box.element.offsetHeight,
                });

            newState = {row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1};
            resizeBox(box, e);
        }

        if (grid.resizable.resizing) {grid.resizable.resizing();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let resizeEnd = function (box, e) {
        if (!grid.liveChanges) {
            let {boxLeft, boxRight, boxTop, boxBottom} = renderer.
                findIntersectedCells({
                    left: box.element.offsetLeft,
                    right: box.element.offsetLeft + box.element.offsetWidth,
                    top: box.element.offsetTop,
                    bottom: box.element.offsetTop + box.element.offsetHeight,
                    numRows: engine.getNumRows(),
                    numColumns: engine.getNumColumns()
                });
            newState = {row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1};
            resizeBox(box, e);
        }

        box.element.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
        box.element.style.left = grid.shadowBoxElement.style.left;
        box.element.style.top = grid.shadowBoxElement.style.top;
        box.element.style.width = grid.shadowBoxElement.style.width;
        box.element.style.height = grid.shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = 'none';

            engine.updateNumRows(false);
            engine.updateNumColumns(false);
            engine.updateDimensionState();

        }, grid.snapback);

        if (grid.resizable.resizeEnd) {grid.resizable.resizeEnd();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let resizeBox = function (box, e) {
        if (newState.row !== prevState.row  ||
            newState.column !== prevState.column  ||
            newState.rowspan !== prevState.rowspan  ||
            newState.columnspan !== prevState.columnspan ) {

            let update = engine.updateBox(box, newState);

            // updateGridDimension preview box.
            if (update) {
                renderer.setBoxXPosition(grid.shadowBoxElement, update.column);
                renderer.setBoxYPosition(grid.shadowBoxElement, update.row);
                renderer.setBoxWidth(grid.shadowBoxElement, update.columnspan);
                renderer.setBoxHeight(grid.shadowBoxElement, update.rowspan);
            }
        }

        // No point in attempting update if not switched to new cell.
        prevState.row = newState.row;
        prevState.column = newState.column;
        prevState.rowspan = newState.rowspan;
        prevState.columnspan = newState.columnspan;

        if (grid.resizable.resizing) {grid.resizable.resizing();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let updateResizingElement = function (box, e) {
        // Get the current mouse position.
        mouseX = e.pageX + window.scrollX;
        mouseY = e.pageY + window.scrollY;

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
        maxTop = grid._element.offsetHeight - grid.yMargin;
        minLeft = grid.xMargin;
        maxLeft = grid._element.offsetWidth - grid.xMargin;

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

        if (className.indexOf('grid-box-handle-e') > -1 ||
            className.indexOf('grid-box-handle-ne') > -1 ||
            className.indexOf('grid-box-handle-se') > -1) {
            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxLeft) {
                diffX = maxLeft - elementLeft - elementWidth;
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

        box.element.style.top = elementTop + 'px';
        box.element.style.left = elementLeft + 'px';
        box.element.style.width = elementWidth + 'px';
        box.element.style.height = elementHeight + 'px';
    };

    return Object.freeze({
        resizeStart,
        resize,
        resizeEnd
    });

}
