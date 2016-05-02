export default Box;

/**
 *
 * @param {}
 * @returns
 */
function Box(comp) {
    let {dashgrid} = comp;

    /**
     * Create Box element.
     * @param {Object} box box.
     */
    let createBox = function (box) {
        Object.assign(box, boxSettings(box, dashgrid));
        if (box.content) {
            box._element.appendChild(box.content);
        }

        dashgrid._boxesElement.appendChild(box._element);
     };

    return Object.freeze({createBox, createShadowBox});
}

/**
 * Box properties and events.
 */
function boxSettings(boxElement, dashgrid) {
    return {
        _element: (function () {
            let el = document.createElement('div');
            el.className = 'dashgrid-box';
            el.style.position = 'absolute';
            el.style.cursor = 'move';
            el.style.transition = dashgrid.transition;
            el.style.zIndex = 1003;
            createBoxResizeHandlers(el, dashgrid);

            return el;
        }()),

        row: boxElement.row,
        column: boxElement.column,
        rowspan: boxElement.rowspan || 1,
        columnspan: boxElement.columnspan || 1,
        draggable: (boxElement.draggable === false) ? false : true,
        resizable: (boxElement.resizable === false) ? false : true,
        pushable: (boxElement.pushable === false) ? false : true,
        floating: (boxElement.floating === true) ? true : false,
        stacking: (boxElement.stacking === true) ? true : false,
        swapping: (boxElement.swapping === true) ? true : false,
        inherit: (boxElement.inherit === true) ? true : false,
    };
}

/**
 * Creates box resize handlers and appends them to box.
 */
function createBoxResizeHandlers(boxElement, dashgrid) {
    let handle;

    /**
     * TOP Handler.
     */
    if (dashgrid.resizable.handle.indexOf('n') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-n';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'n-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * BOTTOM Handler.
     */
    if (dashgrid.resizable.handle.indexOf('s') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-s';
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 's-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('w') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-w';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'w-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('e') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-e';
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'e-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('ne') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-ne';
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'ne-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-EAST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('se') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-se';
        handle.style.right = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'se-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('sw') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-sw';
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'sw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-WEST Handler.
     */
    if (dashgrid.resizable.handle.indexOf('nw') !== -1) {
        handle = document.createElement('div');
        handle.className = 'dashgrid-box-resize-handle-nw';
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = dashgrid.resizable.handleWidth + 'px';
        handle.style.height = dashgrid.resizable.handleWidth + 'px';
        handle.style.cursor = 'nw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        handle.style.zIndex = 1003;
        boxElement.appendChild(handle);
    }
}
