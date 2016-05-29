export {
    createNorthResizeHandleElement,
    createSouthResizeHandleElement,
    createEastResizeHandleElement,
    createWestResizeHandleElement,
    createNorthEastResizeHandleElement,
    createNorthWestResizeHandleElement,
    createSouthEastResizeHandleElement,
    createSouthWestResizeHandleElement
};

/**
 * North Handler.
 */
function createNorthResizeHandleElement(northHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-n';
    handleElement.style.left = 0 + 'px';
    handleElement.style.top = 0 + 'px';
    handleElement.style.width = '100%';
    handleElement.style.height = northHandleThickness + 'px';
    handleElement.style.cursor = 'n-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}

/**
 * South Handler.
 */
function createSouthResizeHandleElement(southHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-s';
    handleElement.style.left = 0 + 'px';
    handleElement.style.bottom = 0 + 'px';
    handleElement.style.width = '100%';
    handleElement.style.height = southHandleThickness + 'px';
    handleElement.style.cursor = 's-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}

/**
 * WEST Handler.
 */
function createWestResizeHandleElement(westHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-w';
    handleElement.style.left = 0 + 'px';
    handleElement.style.top = 0 + 'px';
    handleElement.style.width = westHandleThickness + 'px';
    handleElement.style.height = '100%';
    handleElement.style.cursor = 'w-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}

/**
 * EAST Handler.
 */
function createEastResizeHandleElement(eastHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-e';
    handleElement.style.right = 0 + 'px';
    handleElement.style.top = 0 + 'px';
    handleElement.style.width = eastHandleThickness + 'px';
    handleElement.style.height = '100%';
    handleElement.style.cursor = 'e-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;
    return handleElement;
}

/**
 * NORTH-EAST Handler.
 */
function createNorthEastResizeHandleElement(northHandleThickness, eastHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-ne';
    handleElement.style.right = 0 + 'px';
    handleElement.style.top = 0 + 'px';
    handleElement.style.width = eastHandleThickness + 'px';
    handleElement.style.height = northHandleThickness + 'px';
    handleElement.style.cursor = 'ne-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}

/**
 * NORTH-WEST Handler.
 */
function createNorthWestResizeHandleElement(northHandleThickness, westHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-nw';
    handleElement.style.left = 0 + 'px';
    handleElement.style.top = 0 + 'px';
    handleElement.style.width = westHandleThickness + 'px';
    handleElement.style.height = northHandleThickness + 'px';
    handleElement.style.cursor = 'nw-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}

/**
 * SOUTH-EAST Handler.
 */
function createSouthEastResizeHandleElement(southHandleThickness, eastHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-se';
    handleElement.style.right = 0 + 'px';
    handleElement.style.bottom = 0 + 'px';
    handleElement.style.width = eastHandleThickness + 'px';
    handleElement.style.height = southHandleThickness + 'px';
    handleElement.style.cursor = 'se-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}

/**
 * SOUTH-WEST Handler.
 */
function createSouthWestResizeHandleElement(southHandleThickness, westHandleThickness) {
    let handleElement = document.createElement('div');
    handleElement.className = 'dashgrid-box-resize-handleElement-sw';
    handleElement.style.left = 0 + 'px';
    handleElement.style.bottom = 0 + 'px';
    handleElement.style.width = southHandleThickness + 'px';
    handleElement.style.height = westHandleThickness + 'px';
    handleElement.style.cursor = 'sw-resize';
    handleElement.style.position = 'absolute';
    handleElement.style.display = 'block';
    handleElement.style.zIndex = 1003;

    return handleElement;
}
