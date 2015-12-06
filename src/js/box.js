/**
 * box.js: Box constructor.
 */
"use string";

export function createBox (obj) {
    let {box, gridElement} = obj;

    /**
     * Create Box element.
     */
    let boxElement = document.createElement("div");
    boxElement.className = "grid-box";

    boxElement.style.position = "absolute";
    boxElement.style.display = "block";
    boxElement.style.zIndex = "1002";

    if (box.content) {
        boxElement.appendChild(box.content);
    }

    createBoxResizeHandlers({
        boxElement: boxElement,
        handlers: ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
    });

    Object.assign(box, {element: boxElement});
    Object.assign(box, boxParams(box));

    gridElement.appendChild(box.element);
}

/**
 * Box properties and events.
 */
function boxParams(obj) {
    return {
        row: obj.row,
        column: obj.column,
        rowspan: obj.rowspan || 1,
        columnspan: obj.columnspan || 1,
        draggable: (obj.draggable === false) ? false : true,
        resizable: (obj.resizable === false) ? false : true,
        pushable: (obj.pushable === false) ? false : true,
        floating: (obj.floating === true) ? true : false,
        stacking: (obj.stacking === true) ? true : false,
        swapping: (obj.swapping === true) ? true : false,
        inherit: (obj.inherit === true) ? true : false,
    };
}

/**
 * Creates box resize handlers and appends them to box.
 */
function createBoxResizeHandlers(obj) {
    let {boxElement, handlers} = obj;

    /**
     * TOP Handler.
     */
    if (handlers.indexOf("n") !== -1) {
        let handle = document.createElement("div");
        handle.style.left = 0 + "px";
        handle.style.top = 0 + "px";
        handle.style.width = "100%";
        handle.style.height = 20 + "px";
        handle.style.cursor = "n-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-n";
        boxElement.appendChild(handle);
    }

    /**
     * BOTTOM Handler.
     */
    if (handlers.indexOf("s") !== -1) {
        let handle = document.createElement("div");
        handle.style.left = 0 + "px";
        handle.style.bottom = 0 + "px";
        handle.style.width = "100%";
        handle.style.height = 20 + "px";
        handle.style.cursor = "s-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-s";
        boxElement.appendChild(handle);
    }

    /**
     * WEST Handler.
     */
    if (handlers.indexOf("w") !== -1) {
        let handle = document.createElement("div");
        handle.style.left = 0 + "px";
        handle.style.top = 0 + "px";
        handle.style.width = 20 + "px";
        handle.style.height = "100%";
        handle.style.cursor = "w-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-w";
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (handlers.indexOf("e") !== -1) {
        let handle = document.createElement("div");
        handle.style.right = 0 + "px";
        handle.style.top = 0 + "px";
        handle.style.width = 20 + "px";
        handle.style.height = "100%";
        handle.style.cursor = "e-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-e";
        boxElement.appendChild(handle);
    }

    /**
     * NORTH-EAST Handler.
     */
    if (handlers.indexOf("ne") !== -1) {
        let handle = document.createElement("div");
        handle.style.right = 0 + "px";
        handle.style.top = 0 + "px";
        handle.style.width = 20 + "px";
        handle.style.height = 20 + "px";
        handle.style.cursor = "ne-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-ne";
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-EAST Handler.
     */
    if (handlers.indexOf("se") !== -1) {
        let handle = document.createElement("div");
        handle.style.right = 0 + "px";
        handle.style.bottom = 0 + "px";
        handle.style.width = 20 + "px";
        handle.style.height = 20 + "px";
        handle.style.cursor = "se-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-se";
        boxElement.appendChild(handle);
    }

    /**
     * SOUTH-WEST Handler.
     */
    if (handlers.indexOf("sw") !== -1) {
        let handle = document.createElement("div");
        handle.style.left = 0 + "px";
        handle.style.bottom = 0 + "px";
        handle.style.width = 20 + "px";
        handle.style.height = 20 + "px";
        handle.style.cursor = "sw-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-sw";
        boxElement.appendChild(handle);
    }

    /**
     * EAST Handler.
     */
    if (handlers.indexOf("nw") !== -1) {
        let handle = document.createElement("div");
        handle.style.left = 0 + "px";
        handle.style.top = 0 + "px";
        handle.style.width = 20 + "px";
        handle.style.height = 20 + "px";
        handle.style.cursor = "nw-resize";
        handle.style.position = "absolute";
        handle.style.display = "block";
        handle.className = "grid-box-handle grid-box-handle-nw";
        boxElement.appendChild(handle);
    }
}
