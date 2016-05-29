import {
    createNorthResizeHandleElement,
    createSouthResizeHandleElement,
    createEastResizeHandleElement,
    createWestResizeHandleElement,
    createNorthEastResizeHandleElement,
    createNorthWestResizeHandleElement,
    createSouthEastResizeHandleElement,
    createSouthWestResizeHandleElement} from './resizeHandleElement.js';

export {BoxElement};

/**
 *
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function BoxElement(gridState) {

    function createBoxElement(boxContentElement) {
        boxElement.element = document.createElement('div');

        // Properties.
        boxElement.element.className = 'dashgrid-box';
        boxElement.element.style.position = 'absolute';
        boxElement.element.style.cursor = 'move';
        boxElement.element.style.transition = gridState.transition;
        boxElement.element.style.zIndex = 1003;

        // Resize Handle Container.
        // let resizeHandles = {element: document.createElement('div')};
        // boxElement.resizeHandles = resizeHandles.element;
        // boxElement.element.appendChild(resizeHandles.element);

        // Box Content.
        if (boxContentElement) {
            // boxElement.element.appendChild(boxContentElement);
        }

    }

    function createNorthResizeHandleElement() {
        // Resize Handles.
        if (gridState.resizable.handle.indexOf('n') !== -1) {
            boxElement.element.appendChild(createNorthResizeHandleElement());
        }
    }

    // if (gridState.resizable.handle.indexOf('s') !== -1) {
    //     boxElement.element.appendChild(createSouthResizeHandleElement());
    // }

    // if (gridState.resizable.handle.indexOf('e') !== -1) {
    //     boxElement.element.appendChild(createEastResizeHandleElement());
    // }

    // if (gridState.resizable.handle.indexOf('w') !== -1) {
    //     boxElement.element.appendChild(createWestResizeHandleElement());
    // }

    // if (gridState.resizable.handle.indexOf('ne') !== -1) {
    //     boxElement.element.appendChild(createNorthEastResizeHandleElement());
    // }

    // if (gridState.resizable.handle.indexOf('nw') !== -1) {
    //     boxElement.element.appendChild(createNorthWestResizeHandleElement());
    // }

    // if (gridState.resizable.handle.indexOf('se') !== -1) {
    //     boxElement.element.appendChild(createSouthEastResizeHandleElement());
    // }

    // if (gridState.resizable.handle.indexOf('sw') !== -1) {
    //     boxElement.element.appendChild(createSouthWestResizeHandleElement());
    // }


    /**
     *
     * @param {Object} boxElement DOM element.
     * @param {Number} column Column number.
     * @returns
     */
    let setBoxElementColumnPosition = function (boxElement, column) {
        boxElement.style.left = column * columnWidth + gridState.xMargin *
            (column + 1) + 'px';
    };

    /**
     *
     * @param {Object} boxElement DOM element.
     * @param {Number} row Row number.
     * @returns
     */
    let setBoxElementRowPosition = function (boxElement, row) {
        boxElement.style.top = row * rowHeight + gridState.yMargin *
            (row + 1) + 'px';
    };

    /**
     *
     * @param {Object} boxElement DOM element.
     * @param {Number} columnspan Columnspan number.
     * @returns
     */
    let setBoxElementWidth = function (boxElement, columnspan) {
        boxElement.style.width = columnspan * columnWidth +
            gridState.xMargin * (columnspan - 1) + 'px';
    };

    /**
     *
     * @param {Object} boxElement DOM element.
     * @param {Number} rowspan Rowspan number.
     * @returns
     */
    let setBoxElementHeight = function (boxElement, rowspan) {
        boxElement.style.height = rowspan * rowHeight + gridState.yMargin *
            (rowspan - 1) + 'px';
    };

    return Object.freeze({
        setBoxElementColumnPosition,
        setBoxElementRowPosition,
        setBoxElementWidth,
        setBoxElementHeight
    });
}
