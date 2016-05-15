import {removeNodes, addEvent} from './utils.js';

import {boxContainerElementModel} from './boxContainerElementModel.js';
import {horizontalLineElementModel} from './horizontalLineElementModel.js';
import {verticalLineElementModel} from './verticalLineElementModel.js';
import {centroidElementModel} from './centroidElementModel.js';

export {gridElementModel};

/**
 * 
 * @param {Object} element The DOM element to which to attach the grid element content.  
 * @param {Object} gridState The grid state. 
 * @returns {Object} The dom element.
 */
function gridElementModel(element, gridState) {
    let gridElement = {};

    gridElement.element = element;

    // Properties.
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.display = 'block';
    element.style.zIndex = '1000';  

    // Children.
    let boxes = {element: boxContainerElementModel()};
    gridElement.boxes = boxes.element;
    gridElement.element.appendChild(boxes.element);

    if (gridState.showHorizontalLine) {
        let horizontalLine = {element: horizontalLineElementModel()};
        gridElement.horizontalLine = horizontalLine.element;
        gridElement.element.appendChild(horizontalLine.element);
    }

    if (gridState.showVerticalLine) {
        let verticalLine = {element: verticalLineElementModel()};
        gridElement.verticalLine = verticalLine.element;
        gridElement.element.appendChild(verticalLine.element);
    }

    if (gridState.showCentroid) {
        let centroid = {element: centroidElementModel()};
        gridElement.centroid = centroid.element;
        gridElement.element.appendChild(centroid.element);
    }

    // Event listeners.
    addEvent(window, 'resize', () => {
        renderer.setColumnWidth();
        renderer.setRowHeight();
        grid.refreshGrid();
    });

    return gridElement;
};
