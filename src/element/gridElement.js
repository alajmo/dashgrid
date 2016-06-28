import {removeNodes, addEvent} from './../node/utils.js';

import {BoxElement} from './boxElement.js';
import {BoxContainerElement} from './boxContainerElement.js';
import {CentroidElement} from './centroidElement.js';

import {Render} from './../element/render/render.js';

export {GridElement};

/**
 *
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function GridElement(element, gridState) {
    let gridElement = new Map();
    gridElement.element = element;

    // Properties.
    gridElement.element.style.position = 'absolute';
    gridElement.element.style.top = '0px';
    gridElement.element.style.left = '0px';
    gridElement.element.style.display = 'block';
    gridElement.element.style.zIndex = '1000';

    return gridElement;
};
