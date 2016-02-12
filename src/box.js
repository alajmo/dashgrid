export default function Box(comp) {
    let {grid} = comp;
    /**
     * Create Box element.
     * @param {Object} box box.
     */
     let createBox = function (box) {
        Object.assign(box, boxSettings(box, grid));
        if (box.content) {box.element.appendChild(box.content);}
        grid.element.appendChild(box.element);
     };

    return {createBox};
}

/**
 * Box properties and events.
 */
function boxSettings(bel, grid) {
    return {
        element: (function () {
            let el = document.createElement('div');
            el.className = 'dashgridBox';
            el.style.position = 'absolute';
            el.style.cursor = 'move';
            el.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
            el.style.zIndex = '1002';

            createBoxResizeHandlers(el, grid);

            return el;
        }()),

        row: bel.row,
        column: bel.column,
        rowspan: bel.rowspan || 1,
        columnspan: bel.columnspan || 1,
        draggable: (bel.draggable === false) ? false : true,
        resizable: (bel.resizable === false) ? false : true,
        pushable: (bel.pushable === false) ? false : true,
        floating: (bel.floating === true) ? true : false,
        stacking: (bel.stacking === true) ? true : false,
        swapping: (bel.swapping === true) ? true : false,
        inherit: (bel.inherit === true) ? true : false,
    };
}

/**
 * Creates box resize handlers and appends them to box.
 */
function createBoxResizeHandlers(bel, grid) {
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
        handle.className = 'grid-box-handle grid-box-handle-n';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-s';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-w';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-e';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-ne';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-se';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-sw';
        bel.appendChild(handle);
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
        handle.className = 'grid-box-handle grid-box-handle-nw';
        bel.appendChild(handle);
    }
}
