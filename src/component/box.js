import {render} from '../node/utils.js';

import {BoxState} from '../state/boxState.js';
import {BoxElement} from '../element/boxElement.js';
import {
    createNorthResizeHandleElement,
    southResizeHandleElement,
    createEastResizeHandleElement,
    createWestResizeHandleElement,
    createNorthEastResizeHandleElement,
    createNorthWestResizeHandleElement,
    createSouthEastResizeHandleElement,
    createSouthWestResizeHandleElement
} from '../element/resizeHandleElement.js';

export {Box};

function Box({boxOptions, gridState}) {
    let boxState = BoxState({boxOptions});
    let box = Object.assign({}, boxState);

    return Object.seal(box);
}

    // // Content.
    // if (boxOptions.content) {
    //      Object.assign(boxElement, {content: boxOptions.content});
    // }

    // // Resize Handles.
    // if (gridState.resizable.handle.indexOf('n') !== -1) {
    //     render(boxElement, {northResizeHandle: createNorthResizeHandleElement()});
    // }

    // if (gridState.resizable.handle.indexOf('s') !== -1) {
    //     render(boxElement, {southResizeHandle: southResizeHandleElement()});
    // }

    // if (gridState.resizable.handle.indexOf('e') !== -1) {
    //     render(boxElement, {eastResizeHandle: createEastResizeHandleElement()});
    // }

    // if (gridState.resizable.handle.indexOf('w') !== -1) {
    //     render(boxElement, {westResizeHandle: createWestResizeHandleElement()});
    // }
