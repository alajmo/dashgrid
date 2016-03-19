/**
 * mouseHandler.js: Initializes and sets up the events for dragging / resizing.
 */

import {findParent} from './utils';

export default function MouseHandler(comp) {
    let {dragger, resizer, grid, engine} = comp;

    let inputTags = ['select', 'input', 'textarea', 'button'];

    function initialize() {grid.element.addEventListener('mousedown', function (e) {mouseDown(e, grid.element); e.preventDefault();}, false);}

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
        if (node.className.indexOf('handle') > -1) {handleEvent(e, resizeEvent);}
        else if (node.className.indexOf('dashgridBox') > -1) {handleEvent(e, dragEvent);}
        else if (node.className.indexOf(grid.draggable.handle) > -1) {handleEvent(e, dragEvent);}
    }

    function handleEvent(e, cb) {
        let boxElement = findParent(e.target, 'dashgridBox');
        let box = engine.getBox(boxElement);
        if (box) {
            // engine.setActiveBox(box);
            cb(box, e);
        }
    }

    function dragEvent(box, e) {
        if (!grid.draggable.enabled || !box.draggable) {return;}

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
            // engine.setActiveBox({});
        }
    }

    function resizeEvent(box, e) {
        if (!grid.resizable.enabled || !box.resizable) {return;}

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
        initialize
    });

}
