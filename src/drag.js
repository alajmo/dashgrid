export default Dragger;

function Dragger(comp) {
    let {grid, renderer, engine} = comp;

    let eX, eY, eW, eH,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        minTop = grid.yMargin,
        minLeft = grid.xMargin,
        currState = {},
        prevState = {};

    let scrollHeight = grid._element.scrollHeight;

    /**
     * Create shadowbox, remove smooth transitions for box,
     * and initialize mouse variables. Finally, make call to api to check if,
     * any box is close to bottom / right
     * @param {Object} box
     * @param {Object} e
     */
    let dragStart = function (box, e) {
        box._element.style.transition = 'None';
        grid._shadowBoxElement.style.left = box._element.style.left;
        grid._shadowBoxElement.style.top = box._element.style.top;
        grid._shadowBoxElement.style.width = box._element.style.width;
        grid._shadowBoxElement.style.height = box._element.style.height;
        grid._shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        eX = parseInt(box._element.offsetLeft, 10);
        eY = parseInt(box._element.offsetTop, 10);
        eW = parseInt(box._element.offsetWidth, 10);
        eH = parseInt(box._element.offsetHeight, 10);

        scrollHeight = grid._element.scrollHeight;

        engine.dragResizeStart(box);

        if (grid.draggable.dragStart) {grid.draggable.dragStart();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let drag = function (box, e) {
        updateMovingElement(box, e);
        engine.draggingResizing(box);

        if (grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });

            moveBox(box, e);
        }

        if (grid.draggable.dragging) {grid.draggable.dragging();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let dragEnd = function (box, e) {
        if (!grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        box._element.style.transition = grid.transition;
        box._element.style.left = grid._shadowBoxElement.style.left;
        box._element.style.top = grid._shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid._shadowBoxElement.style.display = 'none';
            engine.dragResizeEnd();
        }, grid.snapbacktime);

        if (grid.draggable.dragEnd) {grid.draggable.dragEnd();} // user cb.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let moveBox = function (box, e) {
        if (currState.row !== prevState.row ||
            currState.column !== prevState.column) {

            let prevScrollHeight = grid._element.offsetHeight - window.innerHeight;
            let prevScrollWidth = grid._element.offsetWidth - window.innerWidth
            let validMove = engine.updateBox(box, currState, box);

            // updateGridDimension preview box.
            if (validMove) {
                renderer.setBoxYPosition(grid._shadowBoxElement, currState.row);
                renderer.setBoxXPosition(grid._shadowBoxElement, currState.column);

                let postScrollHeight = grid._element.offsetHeight - window.innerHeight;
                let postScrollWidth = grid._element.offsetWidth - window.innerWidth;

                // Account for minimizing scroll height when moving box upwards.
                // Otherwise bug happens where the dragged box is changed but directly
                // afterwards the grid element dimension is changed.

                if (Math.abs(grid._element.offsetHeight - window.innerHeight - window.scrollY) < 30 &&
                    window.scrollY > 0 &&
                    prevScrollHeight !== postScrollHeight) {
                    box._element.style.top = box._element.offsetTop - 100  + 'px';
                }

                if (Math.abs(grid._element.offsetWidth - window.innerWidth - window.scrollX) < 30 &&
                    window.scrollX > 0 &&
                    prevScrollWidth !== postScrollWidth) {

                    box._element.style.left = box._element.offsetLeft - 100  + 'px';
                }
            }
        }

        // No point in attempting move if not switched to new cell.
        prevState = {row: currState.row, column: currState.column};
    };

    /**
     * The moving element,
     * @param {Object} box
     * @param {Object} e
     */
    let updateMovingElement = function (box, e) {
        let maxLeft = grid._element.offsetWidth - grid.xMargin;
        let maxTop = grid._element.offsetHeight - grid.yMargin;

        // Get the current mouse position.
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Get the deltas
        let diffX = mouseX - lastMouseX + mOffX;
        let diffY = mouseY - lastMouseY + mOffY;

        mOffX = 0;
        mOffY = 0;

        // Update last processed mouse positions.
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        let dX = diffX;
        let dY = diffY;
        if (eX + dX < minLeft) {
            diffX = minLeft - eX;
            mOffX = dX - diffX;
        } else if (eX + eW + dX > maxLeft) {
            diffX = maxLeft - eX - eW;
            mOffX = dX - diffX;
        }

        if (eY + dY < minTop) {
            diffY = minTop - eY;
            mOffY = dY - diffY;
        } else if (eY + eH + dY > maxTop) {
            diffY = maxTop - eY - eH;
            mOffY = dY - diffY;
        }
        eX += diffX;
        eY += diffY;

        box._element.style.top = eY + 'px';
        box._element.style.left = eX + 'px';

        scrollHeight = grid._element.scrollHeight;

        // Scrolling when close to bottom edge.
        if (e.pageY - document.body.scrollTop < grid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop - grid.scrollSpeed;
        } else if (window.innerHeight - (e.pageY - document.body.scrollTop) < grid.scrollSensitivity) {
            document.body.scrollTop = document.body.scrollTop + grid.scrollSpeed;
        }

        if (e.pageX - document.body.scrollLeft < grid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft - grid.scrollSpeed;
        } else if (window.innerWidth - (e.pageX - document.body.scrollLeft) < grid.scrollSensitivity) {
            document.body.scrollLeft = document.body.scrollLeft + grid.scrollSpeed;
        }

    };

    return Object.freeze({
        dragStart,
        drag,
        dragEnd
    });
}
