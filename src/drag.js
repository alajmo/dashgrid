export default function DragHandler(comp) {
    let {grid, renderer, engine} = comp;

    let elmX, elmY, elmW, elmH,
        mouseX = 0,
        mouseY = 0,
        lastMouseX = 0,
        lastMouseY = 0,
        mOffX = 0,
        mOffY = 0,
        minTop = grid.yMargin,
        minLeft = grid.xMargin,
        maxRight = 0,
        currState = {},
        prevState = {};

    /**
    * Create shadowbox, remove smooth transitions for box,
    * and initialize mouse variables. Finally, make call to api to check if,
    * any box is close to bottom / right
    * @param {}
    * @returns
    */
    let dragStart = function (box, e) {

        box.element.style.transition = 'None';
        grid.shadowBoxElement.style.left = box.element.style.left;
        grid.shadowBoxElement.style.top = box.element.style.top;
        grid.shadowBoxElement.style.width = box.element.style.width;
        grid.shadowBoxElement.style.height = box.element.style.height;
        grid.shadowBoxElement.style.display = '';

        // Mouse values.
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
        elmX = parseInt(box.element.offsetLeft, 10);
        elmY = parseInt(box.element.offsetTop, 10);
        elmW = parseInt(box.element.offsetWidth, 10);
        elmH = parseInt(box.element.offsetHeight, 10);

        engine.dragResizeStart(box);

        if (grid.draggable.dragStart) {grid.draggable.dragStart();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let drag = function (box, e) {
        updateMovingElement(box, e);
        engine.draggingResizing(box);
        if (grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box.element.offsetLeft,
                right: box.element.offsetLeft + box.element.offsetWidth,
                top: box.element.offsetTop,
                bottom: box.element.offsetTop + box.element.offsetHeight
            });
            moveBox(box, e);
        }

        if (grid.draggable.dragging) {grid.draggable.dragging();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let dragEnd = function (box, e) {
        if (!grid.liveChanges) {
            // Which cell to snap preview box to.
            currState = renderer.getClosestCells({
                left: box.element.offsetLeft,
                right: box.element.offsetLeft + box.element.offsetWidth,
                top: box.element.offsetTop,
                bottom: box.element.offsetTop + box.element.offsetHeight
            });
            moveBox(box, e);
        }

        box.element.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
        box.element.style.left = grid.shadowBoxElement.style.left;
        box.element.style.top = grid.shadowBoxElement.style.top;

        // Give time for previewbox to snap back to tile.
        setTimeout(function () {
            grid.shadowBoxElement.style.display = 'none';
            engine.dragResizeEnd();
        }, grid.snapbacktime);

        if (grid.draggable.dragEnd) {grid.draggable.dragEnd();} // user cb.
    };

    /**
    *
    * @param {}
    * @returns
    */
    let moveBox = function (box, e) {
        let validMove;
        if (currState.row !== prevState.row ||
            currState.column !== prevState.column) {

            validMove = engine.updateBox(box, currState, box);
            // UpdateGrid preview box.
            if (validMove) {
                renderer.setBoxYPosition(grid.shadowBoxElement, currState.row);
                renderer.setBoxXPosition(grid.shadowBoxElement, currState.column);
            }
        }

        // No point in attempting move if not switched to new cell.
        prevState = {row: currState.row, column: currState.column};
    };

    /**
    *
    * @param {}
    * @returns
    */
    let updateMovingElement = function (box, e) {
        let maxLeft = grid.element.offsetWidth - grid.xMargin;
        let maxTop = grid.element.offsetHeight - grid.yMargin;

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
        if (elmX + dX < minLeft) {
            diffX = minLeft - elmX;
            mOffX = dX - diffX;
        } else if (elmX + elmW + dX > maxLeft) {
            diffX = maxLeft - elmX - elmW;
            mOffX = dX - diffX;
        }

        if (elmY + dY < minTop) {
            diffY = minTop - elmY;
            mOffY = dY - diffY;
        } else if (elmY + elmH + dY > maxTop) {
            diffY = maxTop - elmY - elmH;
            mOffY = dY - diffY;
        }
        elmX += diffX;
        elmY += diffY;

        box.element.style.top = elmY + 'px';
        box.element.style.left = elmX + 'px';
    
        // Scrolling when close to edge.
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
