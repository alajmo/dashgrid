export {Resizer};

function Resizer(comp) {
    let {dashgrid, renderer, grid} = comp;

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
     * @param {Object} box
     * @param {Object} e
     */
    let resizeStart = function (box, e) {
        className = e.target.className;

        // Removes transitions, displays and inits positions for preview box.
        box._element.style.zIndex = 1004;
        box._element.style.transition = '';
        dashgrid._shadowBoxElement.style.left = box._element.style.left;
        dashgrid._shadowBoxElement.style.top = box._element.style.top;
        dashgrid._shadowBoxElement.style.width = box._element.style.width;
        dashgrid._shadowBoxElement.style.height = box._element.style.height;
        dashgrid._shadowBoxElement.style.display = '';

        // Mouse values.
        minWidth = renderer.getColumnWidth();
        minHeight = renderer.getRowHeight();
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        elementLeft = parseInt(box._element.style.left, 10);
        elementTop = parseInt(box._element.style.top, 10);
        elementWidth = box._element.offsetWidth;
        elementHeight = box._element.offsetHeight;

        grid.updateStart(box);

        if (dashgrid.resizable.resizeStart) {dashgrid.resizable.resizeStart();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let resize = function (box, e) {
        updateResizingElement(box, e);
        grid.updating(box);

        if (dashgrid.liveChanges) {
            // Which cell to snap shadowbox to.
            let {boxLeft, boxRight, boxTop, boxBottom} = renderer.
                findIntersectedCells({
                    left: box._element.offsetLeft,
                    right: box._element.offsetLeft + box._element.offsetWidth,
                    top: box._element.offsetTop,
                    bottom: box._element.offsetTop + box._element.offsetHeight,
                });
            newState = {row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1};

            resizeBox(box, e);
        }

        if (dashgrid.resizable.resizing) {dashgrid.resizable.resizing();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let resizeEnd = function (box, e) {
        if (!dashgrid.liveChanges) {
            let {boxLeft, boxRight, boxTop, boxBottom} = renderer.
                findIntersectedCells({
                    left: box._element.offsetLeft,
                    right: box._element.offsetLeft + box._element.offsetWidth,
                    top: box._element.offsetTop,
                    bottom: box._element.offsetTop + box._element.offsetHeight,
                    numRows: grid.getNumRows(),
                    numColumns: grid.getNumColumns()
                });
            newState = {row: boxTop, column: boxLeft, rowspan: boxBottom - boxTop + 1, columnspan: boxRight - boxLeft + 1};
            resizeBox(box, e);
        }

        // Set box style.
        box._element.style.transition = dashgrid.transition;
        box._element.style.left = dashgrid._shadowBoxElement.style.left;
        box._element.style.top = dashgrid._shadowBoxElement.style.top;
        box._element.style.width = dashgrid._shadowBoxElement.style.width;
        box._element.style.height = dashgrid._shadowBoxElement.style.height;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            box._element.style.zIndex = 1003;
            dashgrid._shadowBoxElement.style.display = '';
            grid.updateEnd();
        }, dashgrid.snapBackTime);

        if (dashgrid.resizable.resizeEnd) {dashgrid.resizable.resizeEnd();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let resizeBox = function (box, e) {
        if (newState.row !== prevState.row  ||
            newState.column !== prevState.column  ||
            newState.rowspan !== prevState.rowspan  ||
            newState.columnspan !== prevState.columnspan ) {

            let update = grid.updateBox(box, newState, box);

            // updateGridDimension preview box.
            if (update) {
                renderer.setBoxElementXPosition(dashgrid._shadowBoxElement, newState.column);
                renderer.setBoxElementYPosition(dashgrid._shadowBoxElement, newState.row);
                renderer.setBoxElementWidth(dashgrid._shadowBoxElement, newState.columnspan);
                renderer.setBoxElementHeight(dashgrid._shadowBoxElement, newState.rowspan);
            }
        }

        // No point in attempting update if not switched to new cell.
        prevState.row = newState.row;
        prevState.column = newState.column;
        prevState.rowspan = newState.rowspan;
        prevState.columnspan = newState.columnspan;

        if (dashgrid.resizable.resizing) {dashgrid.resizable.resizing();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let updateResizingElement = function (box, e) {
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

        minTop = dashgrid.yMargin;
        maxTop = dashgrid._element.offsetHeight - dashgrid.yMargin;
        minLeft = dashgrid.xMargin;
        maxLeft = dashgrid._element.offsetWidth - dashgrid.xMargin;

        if (className.indexOf('dashgrid-box-resize-handle-w') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-nw') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-sw') > -1) {
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

        if (className.indexOf('dashgrid-box-resize-handle-e') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-ne') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-se') > -1) {

            if (elementWidth + dX < minWidth) {
                diffX = minWidth - elementWidth;
                mOffX = dX - diffX;
            } else if (elementLeft + elementWidth + dX > maxLeft) {
                diffX = maxLeft - elementLeft - elementWidth;
                mOffX = dX - diffX;
            }
            elementWidth += diffX;
        }

        if (className.indexOf('dashgrid-box-resize-handle-n') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-nw') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-ne') > -1) {
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

        if (className.indexOf('dashgrid-box-resize-handle-s') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-sw') > -1 ||
            className.indexOf('dashgrid-box-resize-handle-se') > -1) {
            if (elementHeight + dY < minHeight) {
                diffY = minHeight - elementHeight;
                mOffY = dY - diffY;
            } else if (elementTop + elementHeight + dY > maxTop) {
                diffY = maxTop - elementTop - elementHeight;
                mOffY = dY - diffY;
            }
            elementHeight += diffY;
        }

        box._element.style.top = elementTop + 'px';
        box._element.style.left = elementLeft + 'px';
        box._element.style.width = elementWidth + 'px';
        box._element.style.height = elementHeight + 'px';

        // Scrolling when close to bottom boundary.
        if (e.pageY - document.body.scrollTop < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - dashgrid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < dashgrid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + dashgrid.scrollSpeed;
        }

        // Scrolling when close to right boundary.
        if (e.pageX - document.body.scrollLeft < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - dashgrid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < dashgrid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + dashgrid.scrollSpeed;
        }
    };

    return Object.freeze({
        resizeStart,
        resize,
        resizeEnd
    });
}
