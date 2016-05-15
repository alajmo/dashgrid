import {findParent} from './utils';

export {mouse};

function mouse(comp) {
    let {dragger, resizer, dashgrid, grid} = comp;

    let inputTags = ['select', 'input', 'textarea', 'button'];

    function init() {dashgrid._element.addEventListener('mousedown', function (e) {mouseDown(e, dashgrid._element); e.preventDefault();}, false);}

    function mouseDown(e, element) {
        let node = e.target;

        // Exit if:
        // 1. the target has it's own click event or
        // 2. target has onclick attribute or
        // 3. Right / middle button clicked instead of left.
        if (inputTags.indexOf(node.nodeName.toLowerCase()) > -1) {return;}
        if (node.hasAttribute('onclick')) {return;}
        if (e.which === 2 || e.which === 3) {return;}

        // Handle drag / resize event.
        if (node.className.search(/dashgrid-box-resize-handle/) > -1) {handleEvent(e, resizeEvent);}
        else if (node.className.search(dashgrid.draggable.handle) > -1) {handleEvent(e, dragEvent);}
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
    function dragEvent(box, e) {
        if (!dashgrid.draggable.enabled || !box.draggable) {return;}

        // console.log('dragstart');
        dragger.dragStart(box, e);

        document.addEventListener('mouseup', dragEnd, false);
        document.addEventListener('mousemove', drag, false);

        function drag(e) {
            // console.log('drag');
            dragger.drag(box, e);
            e.preventDefault();
        }

        function dragEnd(e) {
            // console.log('dragend');
            dragger.dragEnd(box, e);
            e.preventDefault();
            document.removeEventListener('mouseup', dragEnd, false);
            document.removeEventListener('mousemove', drag, false);
        }
    }

    /**
     * Resize event, sets off start resize, during resize and end resize.
     * @param {Object} box
     * @param {Object} e
     */
    function resizeEvent(box, e) {
        if (!dashgrid.resizable.enabled || !box.resizable) {return;}
        resizer.resizeStart(box, e);

        document.addEventListener('mouseup', resizeEnd, false);
        document.addEventListener('mousemove', resize, false);

        function resize(e) {resizer.resize(box, e);e.preventDefault();}

        function resizeEnd(e) {
            document.removeEventListener('mouseup', resizeEnd, false);
            document.removeEventListener('mousemove', resize, false);

            resizer.resizeEnd(box, e);
            e.preventDefault();
        }
    }

    return Object.freeze({
        init
    });

}
