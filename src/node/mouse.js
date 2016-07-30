import {findParent} from './utils.js';
import {DragState, dragStart, dragging, dragEnd} from './drag.js';

export {mouseDown, dragEvent};

function mouseDown(e, element) {

    let inputTags = ['select', 'input', 'textarea', 'button'];
    // Handle drag / resize event.
    if (node.className.search(/dashgrid-box-resize-handle/) > -1) {
        handleEvent(e, resizeEvent);
    }
    else if (node.className.search(grid.draggable.handle) > -1) {
        handleEvent(e, dragEvent);
    }
}

/**
 * Handle mouse event, click or resize.
 * @param {Object} e
 * @param {Function} cb
 */
function handleEvent(e, cb) {
    let boxElement = findParent(e.target, /^dashgrid-box$/);
    let box = grid.getBox(boxElement);
    if (box) { cb(box, e); }
}

/**
 * Drag event, sets off start drag, during drag and end drag.
 * @param {Object} box
 * @param {Object} e
 */
function dragEvent({grid, box, e}) {
    // if (!dashgrid.draggable.enabled || !box.draggable) {return;}
    dragStart({grid: grid, box, e});

    document.addEventListener('mouseup', dragEndEvent, false);
    document.addEventListener('mousemove', draggingEvent, false);

    function draggingEvent(e) {
        dragging({grid, box, e});
        e.preventDefault();
    }

    function dragEndEvent(e) {
        dragEnd({grid, box, e});
        e.preventDefault();
        document.removeEventListener('mouseup', dragEndEvent, false);
        document.removeEventListener('mousemove', draggingEvent, false);
    }
}

/**
 * Resize event, sets off start resize, during resize and end resize.
 * @param {Object} box
 * @param {Object} e
 */
function resizeEvent(box, e) {
    if (!dashgrid.resizable.enabled || !box.resizable) {return;}
    resize.resizeStart(box, e);

    document.addEventListener('mouseup', resizeEnd, false);
    document.addEventListener('mousemove', resize, false);

    function resize(e) {resize.resize(box, e);e.preventDefault();}

    function resizeEnd(e) {
        document.removeEventListener('mouseup', resizeEnd, false);
        document.removeEventListener('mousemove', resize, false);

        resize.resizeEnd(box, e);
        e.preventDefault();
    }
}
