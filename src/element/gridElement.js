import {removeNodes, addEvent} from './../node/utils.js';

import {BoxElement} from './boxElement.js';
import {BoxContainerElement} from './boxContainerElement.js';
import {HorizontalLineElement} from './horizontalLineElement.js';
import {VerticalLineElement} from './verticalLineElement.js';
import {CentroidElement} from './centroidElement.js';

import {removeNodes} from './utils.js';
import {GridRender} from './../element/render/gridRender.js';
import {BoxRender} from './../element/render/boxRender.js';
import {VerticalLineRender} from './../element/render/verticalLineRender.js';
import {HorizontalLineRender} from './../element/render/horizontalLineRender.js';
export {GridView}

export {GridElement};

/**
 *
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function GridElement(element, gridState) {
    let gridElement = new Map();
    let gridRender = GridRender(gridDOM, gridState, renderState);
    let verticalLineRender = VerticalLineRender(gridDOM, gridState, renderState);
    let horizontalLineRender = HorizontalLineRender(gridDOM, gridState, renderState);
    // let boxRender = BoxRender(renderState, gridState, gridDOM);

    function createGridElement() {
        gridElement.element = element;

        // Properties.
        element.style.position = 'absolute';
        element.style.top = '0px';
        element.style.left = '0px';
        element.style.display = 'block';
        element.style.zIndex = '1000';
    }

    /**
     *
     */
    let init = function () {
        gridRender.setColumnWidth();
        gridRender.setRowHeight();

        renderGrid();
        // renderBox(gridState.boxes);
    };

    /**
     * Render the dashgrid:
     *    1. Setting grid and cell height / width
     *    2. Painting.
     */
    let renderGrid = function () {
        gridRender.setGridElementHeight();
        gridRender.setGridElementWidth();
        gridRender.setCellCentroids();

        if (gridState.showVerticalLine) {verticalLineRender.renderLines();}
        if (gridState.showHorizontalLine) {horizontalLineRender.renderLines();}
        // if (gridState.showGridCentroids) {renderGridCentroids();}
    };

    /**
     * @param {Array.<Object>} boxes List of boxes to redraw.
     * @param {Object} excludeBox Don't redraw this box.
     */
    let renderBox = function (boxes, excludeBox) {
        window.requestAnimFrame(() => {
            // updateGridDimension moved boxes css.
            boxes.forEach(function (box) {
                if (excludeBox !== box) {
                    renderer.setBoxElementYPosition(box._element, box.row);
                    renderer.setBoxElementXPosition(box._element, box.column);
                    renderer.setBoxElementHeight(box._element, box.rowspan);
                    renderer.setBoxElementWidth(box._element, box.columnspan);
                }
            });
        });
    };

    function createBox(boxState, boxElement) {
        let boxes = {element: BoxContainerElement()};
        gridElement.boxes = boxes;
        gridElement.element.appendChild(boxes.element);

        gridElement.boxes.element.appendChild(boxElement);
    }

    function addVerticalLines() {
        // Vertical Line Container.
        if (gridState.showVerticalLine === true) {
            let verticalLineContainer = {element: document.createElement('div')};
            gridElement.verticalLineContainer = verticalLineContainer;
            gridElement.element.appendChild(verticalLineContainer.element);
        }
    }

    function addHorizontalLines() {
        // Horizontal Line Container.
        if (gridState.showHorizontalLine === true) {
            let horizontalLineContainer = {element: document.createElement('div')};
            gridElement.horizontalLineContainer = horizontalLineContainer;
            gridElement.element.appendChild(horizontalLineContainer.element);
        }
    }

    function addCentroids() {
        // Centroids Container.
        if (gridState.showCentroid === true) {
            let centroidContainer = {element: document.createElement('div')};
            gridElement.centroidContainer = centroidContainer;
            gridElement.element.appendChild(centroidContainer.element);
        }
    }

    function addEvents() {
        // Event listeners.
        addEvent(window, 'resize', () => {
            renderer.setColumnWidth();
            renderer.setRowHeight();
            grid.refreshGrid();
        });
    }

    return Object.freeze({
        createGridElement,
        renderGrid,
        renderBox,
        createBox,
        addHorizontalLines,
        addVerticalLines,
        addCentroids,
        addEvent
    });
};
