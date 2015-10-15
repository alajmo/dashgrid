export default function MouseHandler(spec) {
    let member = {
        inputTags: ['select', 'input', 'textarea', 'button'],
        dragHandleClass: 2,
    };

    let dragger = spec.dragger;
    let resizer = spec.resizer;

    let addEvent = function (obj) {
        let {element} = obj;
        element.addEventListener('mousedown', function (e) {
            mouseDown(e, element);
        }, false);
    };

    let mouseDown = function (e, element) {
        if (member.inputTags.indexOf(e.target.nodeName.toLowerCase()) !==
            -1) {
            return false;
        }

        // exit, if a resize handle was hit
        if (e.target.classList.contains("gridster-item-resizable-handler")) {
            return false;
        }

        // exit, if the target has it's own click event
        if (e.target.hasAttribute('onclick')) {
            return false;
        }

        switch (e.which) {
            case 1:
                // left mouse button
                break;
            case 2:
            case 3:
                // right or middle mouse button
                return;
        }

        if ( (' '  + e.target.className +  ' ').replace(/[\n\t]/g,  ' ')
            .indexOf(' grid-box ') > -1 ){
            if (true) {
                dragger.dragStart(e);
            } else if (false) {
                resizer.resizeStart(e);
            }

            document.addEventListener('mousemove',
                    mouseMove, false);
            document.addEventListener('mouseup', function (e) {
                mouseUp(e, element);
            }, false);
        }

    };

    let mouseMove = function (e) {
        if (true) {
            dragger.drag(e);
        } else if (false) {
            resizer.resize(e);
        }
    };

    let mouseUp = function (e, element) {
        document.removeEventListener('mousemove', mouseMove, false);
        if (true) {
            dragger.dragStop(e);
        } else if (false) {
            resizer.resizeStop(e);
        }
    };

    return Object.freeze({
        addEvent,
        mouseUp,
        mouseMove,
        mouseDown
    });

}
