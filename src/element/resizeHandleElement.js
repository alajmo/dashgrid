export {
    createNorthResizeHandleElement,
    southResizeHandleElement,
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
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-n';
    element.style.left = 0 + 'px';
    element.style.top = 0 + 'px';
    element.style.width = '100%';
    element.style.height = northHandleThickness + 'px';
    element.style.cursor = 'n-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}

/**
 * South Handler.
 */
function southResizeHandleElement(southHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-s';
    element.style.left = 0 + 'px';
    element.style.bottom = 0 + 'px';
    element.style.width = '100%';
    element.style.height = southHandleThickness + 'px';
    element.style.cursor = 's-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}

/**
 * WEST Handler.
 */
function createWestResizeHandleElement(westHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-w';
    element.style.left = 0 + 'px';
    element.style.top = 0 + 'px';
    element.style.width = westHandleThickness + 'px';
    element.style.height = '100%';
    element.style.cursor = 'w-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}

/**
 * EAST Handler.
 */
function createEastResizeHandleElement(eastHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-e';
    element.style.right = 0 + 'px';
    element.style.top = 0 + 'px';
    element.style.width = eastHandleThickness + 'px';
    element.style.height = '100%';
    element.style.cursor = 'e-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;
    return element;
}

/**
 * NORTH-EAST Handler.
 */
function createNorthEastResizeHandleElement(northHandleThickness, eastHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-ne';
    element.style.right = 0 + 'px';
    element.style.top = 0 + 'px';
    element.style.width = eastHandleThickness + 'px';
    element.style.height = northHandleThickness + 'px';
    element.style.cursor = 'ne-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}

/**
 * NORTH-WEST Handler.
 */
function createNorthWestResizeHandleElement(northHandleThickness, westHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-nw';
    element.style.left = 0 + 'px';
    element.style.top = 0 + 'px';
    element.style.width = westHandleThickness + 'px';
    element.style.height = northHandleThickness + 'px';
    element.style.cursor = 'nw-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}

/**
 * SOUTH-EAST Handler.
 */
function createSouthEastResizeHandleElement(southHandleThickness, eastHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-se';
    element.style.right = 0 + 'px';
    element.style.bottom = 0 + 'px';
    element.style.width = eastHandleThickness + 'px';
    element.style.height = southHandleThickness + 'px';
    element.style.cursor = 'se-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}

/**
 * SOUTH-WEST Handler.
 */
function createSouthWestResizeHandleElement(southHandleThickness, westHandleThickness) {
    let element = document.createElement('div');
    element.className = 'dashgrid-box-resize-element-sw';
    element.style.left = 0 + 'px';
    element.style.bottom = 0 + 'px';
    element.style.width = southHandleThickness + 'px';
    element.style.height = westHandleThickness + 'px';
    element.style.cursor = 'sw-resize';
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.style.zIndex = 1003;

    return element;
}
