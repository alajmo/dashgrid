export default Dragger;

function Dragger(comp) {
    let {dashgrid, renderer, grid} = comp;

    let eX, eY, eW, eH,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        minTop = dashgrid.yMargin,
        minLeft = dashgrid.xMargin,
        currState = {},
        prevState = {};

    /**
     * Create shadowbox, remove smooth transitions for box,
     * and init mouse variables. Finally, make call to api to check if,
     * any box is close to bottom / right
     * @param {Object} box
     * @param {Object} e
     */
    let dragStart = function (box, e) {
        box._element.style.zIndex = 1004;
        box._element.style.transition = '';
        dashgrid._shadowBoxElement.style.left = box._element.style.left;
        dashgrid._shadowBoxElement.style.top = box._element.style.top;
        dashgrid._shadowBoxElement.style.width = box._element.style.width;
        dashgrid._shadowBoxElement.style.height = box._element.style.height;
        dashgrid._shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        eX = parseInt(box._element.offsetLeft, 10);
        eY = parseInt(box._element.offsetTop, 10);
        eW = parseInt(box._element.offsetWidth, 10);
        eH = parseInt(box._element.offsetHeight, 10);

        grid.updateStart(box);

        if (dashgrid.draggable.dragStart) {dashgrid.draggable.dragStart();} // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let drag = function (box, e) {
        updateMovingElement(box, e);
        grid.updating(box);

        if (dashgrid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        if (dashgrid.draggable.dragging) {dashgrid.draggable.dragging();} // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let dragEnd = function (box, e) {
        if (!dashgrid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box._element.offsetLeft,
                right: box._element.offsetLeft + box._element.offsetWidth,
                top: box._element.offsetTop,
                bottom: box._element.offsetTop + box._element.offsetHeight
            });
            moveBox(box, e);
        }

        // Set box style.
        box._element.style.transition = dashgrid.transition;
        box._element.style.left = dashgrid._shadowBoxElement.style.left;
        box._element.style.top = dashgrid._shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            box._element.style.zIndex = 1003;
            dashgrid._shadowBoxElement.style.display = 'none';
            grid.updateEnd();
        }, dashgrid.snapBackTime);

        if (dashgrid.draggable.dragEnd) {dashgrid.draggable.dragEnd();} // user event.
    };

    /**
     *
     * @param {Object} box
     * @param {Object} e
     */
    let moveBox = function (box, e) {
        if (currState.row !== prevState.row ||
            currState.column !== prevState.column) {

            let prevScrollHeight = dashgrid._element.offsetHeight - window.innerHeight;
            let prevScrollWidth = dashgrid._element.offsetWidth - window.innerWidth
            let validMove = grid.updateBox(box, currState, box);

            // updateGridDimension preview box.
            if (validMove) {

                renderer.setBoxElementYPosition(dashgrid._shadowBoxElement, currState.row);
                renderer.setBoxElementXPosition(dashgrid._shadowBoxElement, currState.column);

                let postScrollHeight = dashgrid._element.offsetHeight - window.innerHeight;
                let postScrollWidth = dashgrid._element.offsetWidth - window.innerWidth;

                // Account for minimizing scroll height when moving box upwards.
                // Otherwise bug happens where the dragged box is changed but directly
                // afterwards the dashgrid element dimension is changed.
                if (Math.abs(dashgrid._element.offsetHeight - window.innerHeight - window.scrollY) < 30 &&
                    window.scrollY > 0 &&
                    prevScrollHeight !== postScrollHeight) {
                    box._element.style.top = box._element.offsetTop - 100  + 'px';
                }

                if (Math.abs(dashgrid._element.offsetWidth - window.innerWidth - window.scrollX) < 30 &&
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
        let maxLeft = dashgrid._element.offsetWidth - dashgrid.xMargin;
        let maxTop = dashgrid._element.offsetHeight - dashgrid.yMargin;

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
        dragStart,
        drag,
        dragEnd
    });
}
