/**
 * gridDraw.js: High-level draw.
 */

import {removeNodes} from './utils.js';

export default function Drawer(comp) {
    let {grid, renderer} = comp;
    let drawElement;

    let initialize = function () {
        if (grid.displayGrid) {createGridDraw();}
        createShadowBoxElement();
    };

    /**
     * Creates the draw element which is used to show the vertical and
     *     horizontal lines.
     */
    let createGridDraw = function () {
        if (document.getElementById('draw-element') === null) {
            drawElement = document.createElement('div');
            drawElement.id = 'draw-element';
            grid.element.appendChild(drawElement);
        }
    };

    /**
     * Creates the shadow box element which is used when dragging / resizing
     *     a box. It gets attached to the dragging / resizing box, while
     *     box gets to move / resize freely and snaps back to its original
     *     or new position at drag / resize stop.
     */
    let createShadowBoxElement = function () {
        if (document.getElementById('shadow-box') === null) {
            grid.shadowBoxElement = document.createElement('div');
            grid.shadowBoxElement.id = 'shadow-box';
            grid.shadowBoxElement.className = 'grid-shadow-box';
            grid.shadowBoxElement.style.position = 'absolute';
            grid.shadowBoxElement.style.display = 'block';
            grid.shadowBoxElement.style.zIndex = '1001';
            grid.element.appendChild(grid.shadowBoxElement);
        }
    };

    /**
     *
     */
    let setGridDimensions = function () {
        renderer.setRowHeight();
        renderer.setColumnWidth();

        renderer.setGridHeight();
        renderer.setGridWidth();

        renderer.setCellCentroids();
    }

    let updateGrid = function () {
        renderer.setGridHeight();
        renderer.setGridWidth();
    };

    /**
     */
    let drawBox = function (box) {
        renderer.setBoxYPosition(box.element, box.row);
        renderer.setBoxXPosition(box.element, box.column);
        renderer.setBoxHeight(box.element, box.rowspan);
        renderer.setBoxWidth(box.element, box.columnspan);
    };

    /**
     * @desc Sets px per numRows.
     * @params {number} numRows.
     * @params {number} numColumns.
     */
    let drawGrid = function () {
        removeNodes(drawElement);

        let htmlString = '';
        // Horizontal lines
        for (let i = 0; i <= grid.numRows; i += 1) {
            htmlString += `<div class='horizontal-line'
                style='top: ${i * (grid.rowHeight + grid.yMargin)}px;
                    left: 0px;
                    width: 100%;
                    height: ${grid.yMargin}px;'>
                </div>`;
        }

        // Vertical lines
        for (let i = 0; i <= grid.numColumns; i += 1) {
            htmlString += `<div class='vertical-line'
                style='top: 0px;
                    left: ${i * (grid.columnWidth + grid.xMargin)}px;
                    height: 100%;
                    width: ${grid.xMargin}px;'>
                </div>`;
        }

        // Draw centroids
        for (let i = 0; i < grid.numRows; i += 1) {
            for (let j = 0; j < grid.numColumns; j += 1) {
                htmlString += `<div class='grid-centroid'
                    style='top: ${(i * (grid.rowHeight  + grid.yMargin) +
                            grid.rowHeight / 2 + grid.yMargin )}px;
                        left: ${(j * (grid.columnWidth  + grid.xMargin) +
                            grid.columnWidth / 2 + grid.xMargin)}px;'>
                    </div>`;
            }
        }

        drawElement.innerHTML = htmlString;
    };

    return Object.freeze({
        initialize,
        setGridDimensions,
        createGridDraw,
        drawBox,
        drawGrid,
        updateGrid
    })

};
