/**
 * mouseHandler.js: Initializes and sets up the events for dragging / resizing.
 */

export default function MouseHandler(obj) {
    let {classHandle, dragger, resizer} = obj;

    let member = {
        inputTags: ['select', 'input', 'textarea', 'button'],
        dragHandleClass: 2,
    };

    let action = '';

    let addMouseEvents = function (element) {
        element.addEventListener('mousedown', function (e) {
            mouseDown(e, element);
        }, true);
    };

    let mouseDown = function (e, element) {

        // exit, if the target has it's own click event
        if (member.inputTags.indexOf(e.target.nodeName.toLowerCase()) > -1) {
            return false;
        }

        if (e.target.hasAttribute('onclick')) {
            return false;
        }

        if (e.which === 2 || e.which === 3) {
            return;
        }

        let className = e.target.className;
        if (className.indexOf('grid-box') > -1){
            if (className.indexOf('handle') > -1) {
                action = 'resize';
                resizer.resizeStart(e);
            } else if (classHandle === undefined || e.target.className.indexOf(classHandle) > -1) {
                action = 'drag';
                dragger.dragStart(e);
            }

            document.addEventListener('mousemove', mouseMove, false);
            document.addEventListener('mouseup', function (e) {
                mouseUp(e, element);
            }, false);
        }

    };

    let mouseMove = function (e) {
        if (action === 'drag') {
            dragger.drag(e);
        } else if (action === 'resize') {
            resizer.resizing(e);
        }
    };

    let mouseUp = function (e, element) {
        document.removeEventListener('mousemove', mouseMove, false);
        document.removeEventListener('mouseup', mouseUp, false);

        if (action === 'drag') {
            dragger.dragStop(e);
        } else if (action === 'resize') {
            resizer.resizeStop(e);
        }

        action = '';
    };

    return Object.freeze({
        addMouseEvents,
        mouseUp,
        mouseMove,
        mouseDown
    });

}
