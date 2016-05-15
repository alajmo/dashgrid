export {resizeHandle};

/**
 * Creates box resize handlers and appends them to box.
 */
function resizeHandle(boxElement, dashgrid) {
    let handle;

    /**
     * TOP Handler.
     */
    if (dashgrid.resizable.handle.indexOf('n') !={=} -1) {
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
