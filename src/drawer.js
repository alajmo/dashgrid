/**
 * gridDraw.js: High-level draw.
 */

import {removeNodes} from './utils.js';

export default Drawer;

function Drawer(comp) {
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
            grid._element.appendChild(drawElement);
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
            grid._shadowBoxElement = document.createElement('div');
            grid._shadowBoxElement.id = 'shadow-box';
            grid._shadowBoxElement
            // background-color: #E8E8E8;
            // transition: none;

            grid._shadowBoxElement.className = 'grid-shadow-box';
            grid._shadowBoxElement.style.position = 'absolute';
            grid._shadowBoxElement.style.display = 'block';
            grid._shadowBoxElement.style.zIndex = '1001';
            grid._element.appendChild(grid._shadowBoxElement);
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
    };

    /**
    *
    */
    let updateGridDimension = function () {
        renderer.setGridHeight();
        renderer.setGridWidth();
    };

    /**
    *
    * @param {Object} box
    */
    let drawBox = function (box) {
        renderer.setBoxYPosition(box._element, box.row);
        renderer.setBoxXPosition(box._element, box.column);
        renderer.setBoxHeight(box._element, box.rowspan);
        renderer.setBoxWidth(box._element, box.columnspan);
    };

    /**
     *
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
        updateGridDimension
    })

};
