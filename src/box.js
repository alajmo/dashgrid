export default Box;

function Box(comp) {
    let {grid} = comp;

    /**
     * Create Box element.
     * @param {Object} box box.
     */
    let createBox = function (box) {
        Object.assign(box, boxSettings(box, grid));
        if (box.content) {
            box.element.appendChild(box.content);
        }
        grid.element.appendChild(box.element);
     };

    return Object.freeze({createBox});
}

/**
 * Box properties and events.
 */
function boxSettings(boxElement, grid) {
    return {
        _element: (function () {
            let el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.cursor = 'move';
            el.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
            el.style.zIndex = '1002';

            createBoxResizeHandlers(el, grid);

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
function createBoxResizeHandlers(boxElement, grid) {
    /**
     * TOP Handler.
     */
    if (grid.resizable.handles.indexOf('n') !== -1) {
        let handle = document.createElement('div');
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 'n-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * BOTTOM Handler.
     */
    if (grid.resizable.handles.indexOf('s') !== -1) {
        let handle = document.createElement('div');
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = '100%';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 's-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * WEST Handler.
     */
    if (grid.resizable.handles.indexOf('w') !== -1) {
        let handle = document.createElement('div');
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = grid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'w-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (grid.resizable.handles.indexOf('e') !== -1) {
        let handle = document.createElement('div');
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = grid.resizable.handleWidth + 'px';
        handle.style.height = '100%';
        handle.style.cursor = 'e-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-EAST Handler.
     */
    if (grid.resizable.handles.indexOf('ne') !== -1) {
        let handle = document.createElement('div');
        handle.style.right = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = grid.resizable.handleWidth + 'px';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 'ne-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-EAST Handler.
     */
    if (grid.resizable.handles.indexOf('se') !== -1) {
        let handle = document.createElement('div');
        handle.style.right = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = grid.resizable.handleWidth + 'px';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 'se-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-WEST Handler.
     */
    if (grid.resizable.handles.indexOf('sw') !== -1) {
        let handle = document.createElement('div');
        handle.style.left = 0 + 'px';
        handle.style.bottom = 0 + 'px';
        handle.style.width = grid.resizable.handleWidth + 'px';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 'sw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (grid.resizable.handles.indexOf('nw') !== -1) {
        let handle = document.createElement('div');
        handle.style.left = 0 + 'px';
        handle.style.top = 0 + 'px';
        handle.style.width = grid.resizable.handleWidth + 'px';
        handle.style.height = grid.resizable.handleWidth + 'px';
        handle.style.cursor = 'nw-resize';
        handle.style.position = 'absolute';
        handle.style.display = 'block';
        boxElement.appendChild(handle);
    }
}
