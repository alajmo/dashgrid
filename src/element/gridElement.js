import {utils} from './../node/utils.js';

export {GridElement};

/**
 *
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function GridElement(element) {

    // Properties.
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.display = 'block';
    element.style.zIndex = '1000';

    return {element};
};
