import {removeNodes} from './utils.js';

export default GridView;

/**
 * Handles the rendering from javascript to DOM.
 *
 * @param {Object} dashgrid.
 * @param {renderer} renderer.
 */
function GridView(obj) {
    let {dashgrid, renderer} = obj;
    let gridLinesElement;
    let gridCentroidsElement;

    let init = function () {
        if (dashgrid.showGridLines) {createGridLinesElement();}
        if (dashgrid.showGridCentroids) {createGridCentroidsElement();}

        renderer.setColumnWidth();
        renderer.setRowHeight();

        renderGrid();
        renderBox(dashgrid.boxes);
    };

    /**
     * Create vertical and horizontal line elements.
     */
    let createGridLinesElement = function () {
        let lineElementID = 'dashgrid-grid-lines';
        if (document.getElementById(lineElementID) === null) {
            gridLinesElement = document.createElement('div');
            gridLinesElement.id = lineElementID;
            dashgrid._element.appendChild(gridLinesElement);
        }
    };

    /**
     * Create vertical and horizontal line elements.
     */
    let createGridCentroidsElement = function () {
        let centroidElementID = 'dashgrid-grid-centroids';
        if (document.getElementById(centroidElementID) === null) {
            gridCentroidsElement = document.createElement('div');
            gridCentroidsElement.id = centroidElementID;
            dashgrid._element.appendChild(gridCentroidsElement);
        }
    };

    /**
     * Draw horizontal and vertical grid lines with the thickness of xMargin
     * yMargin.
     */
    let renderGridLines = function () {
        if (gridLinesElement === null) {return;}

        removeNodes(gridLinesElement);
        let columnWidth = renderer.getColumnWidth();
        let rowHeight = renderer.getRowHeight();

        let htmlString = '';
        // Horizontal lines
        for (let i = 0; i <= dashgrid.numRows; i += 1) {
            htmlString += `<div class='dashgrid-horizontal-line'
                style='top: ${i * (rowHeight + dashgrid.yMargin)}px;
                    left: 0px;
                    width: 100%;
                    height: ${dashgrid.yMargin}px;
                    position: absolute;'>
                </div>`;
        }

        // Vertical lines
        for (let i = 0; i <= dashgrid.numColumns; i += 1) {
            htmlString += `<div class='dashgrid-vertical-line'
                style='top: 0px;
                    left: ${i * (columnWidth + dashgrid.xMargin)}px;
                    height: 100%;
                    width: ${dashgrid.xMargin}px;
                    position: absolute;'>
                </div>`;
        }

        gridLinesElement.innerHTML = htmlString;
    };

    /**
     * Draw horizontal and vertical grid lines with the thickness of xMargin
     * yMargin.
     */
    let renderGridCentroids = function () {
        if (gridCentroidsElement === null) {return};

        removeNodes(gridCentroidsElement);
        let columnWidth = renderer.getColumnWidth();
        let rowHeight = renderer.getRowHeight();

        let htmlString = '';
        // Draw centroids
        for (let i = 0; i < dashgrid.numRows; i += 1) {
            for (let j = 0; j < dashgrid.numColumns; j += 1) {
                htmlString += `<div class='dashgrid-grid-centroid'
                    style='top: ${(i * (rowHeight  + dashgrid.yMargin) +
                            rowHeight / 2 + dashgrid.yMargin )}px;
                        left: ${(j * (columnWidth  + dashgrid.xMargin) +
                            columnWidth / 2 + dashgrid.xMargin)}px;
                            position: absolute;'>
                    </div>`;
            }
        }

        gridCentroidsElement.innerHTML = htmlString;
    };

    /**
     * Render the dashgrid:
     *    1. Setting grid and cell height / width
     *    2. Painting.
     */
    let renderGrid = function () {
        renderer.setGridElementHeight();
        renderer.setGridElementWidth();
        renderer.setCellCentroids();

        if (dashgrid.showGridLines) {renderGridLines();}
        if (dashgrid.showGridCentroids) {renderGridCentroids();}
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


    return Object.freeze({
        init,
        renderGrid,
        renderBox,
        createGridLinesElement,
        createGridCentroidsElement
    });
}
