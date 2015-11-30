/**
 * gridDraw.js: High-level draw.
 */

import {removeNodes} from "./utils.js";

export default function GridDraw(obj) {
    let {grid, renderer} = obj;
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
        if (document.getElementById("draw-element") === null) {
            drawElement = document.createElement("div");
            drawElement.id = "draw-element";
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
        if (document.getElementById("shadow-box") === null) {
            grid.shadowBoxElement = document.createElement("div");
            grid.shadowBoxElement.id = "shadow-box";
            grid.shadowBoxElement.className = "grid-shadow-box";
            grid.shadowBoxElement.style.position = "absolute";
            grid.shadowBoxElement.style.display = "block";
            grid.shadowBoxElement.style.zIndex = "1001";
            grid.element.appendChild(grid.shadowBoxElement);
        }
    };

    /**
     *
     */
    let updateGridSize = function (dim) {
        let {numRows, numColumns} = dim;

        renderer.updateGridHeight({
            element: grid.element,
            numRows: numRows
        });
        // renderer.updateGridWidth({
        //     element: grid.element,
        //     numColumns: numColumns
        // });
    }

    /**
     *
     */
    let renderGrid = function (dim) {
        let {numRows, numColumns} = dim;

        renderer.setWidthPerCell({
            element: grid.element,
            numColumns: grid.numColumns,
            width: grid.width
        });
        renderer.setHeightPerCell({
            element: grid.element,
            numRows: numRows,
            height: grid.height
        });
        renderer.setCellCentroids({
            numRows: numRows,
            numColumns: numColumns
        });
    }

    /**
     *
     */
    let drawBox = function (obj) {
        let {box} = obj;

        renderer.setBoxXPosition({
            element: box.element,
            column: box.column
        });
        renderer.setBoxYPosition({
            element: box.element,
            row: box.row
        });
        renderer.setBoxWidth({
            element: box.element,
            columnspan: box.columnspan
        });
        renderer.setBoxHeight({
            element: box.element,
            rowspan: box.rowspan
        });

    };

    /**
     * @desc Sets px per numRows.
     * @params {number} numRows.
     * @params {number} numColumns.
     */
    let drawGrid = function (dim) {
        let {numRows, numColumns} = dim;
        if (!grid.displayGrid) {return;}
        let widthPerCell = renderer.getWidthPerCell()
        let heightPerCell = renderer.getHeightPerCell()

        removeNodes(drawElement);

        let htmlString = "";
        // Horizontal lines
        for (let i = 0; i <= numRows; i += 1) {
            htmlString += `<div class="horizontal-line"
                style="
                    top: ${i * (heightPerCell + grid.yMargin)}px;
                    left: 0px;
                    width: 100%;
                    height: ${grid.yMargin}px;">
                </div>`;
        }

        // Vertical lines
        for (let i = 0; i <= numColumns; i += 1) {
            htmlString += `<div class="vertical-line"
                style="
                    top: 0px;
                    left: ${i * (widthPerCell + grid.xMargin)}px;
                    height: 100%;
                    width: ${grid.xMargin}px;">
                </div>`;
        }

        // Draw centroids
        for (let i = 0; i < numRows; i += 1) {
            for (let j = 0; j < numColumns; j += 1) {
                htmlString += `<div class="grid-centroid"
                    style="
                        top: ${(i * (heightPerCell  + grid.yMargin) +
                            heightPerCell / 2 + grid.yMargin )}px;
                        left: ${(j * (widthPerCell  + grid.xMargin) +
                            widthPerCell / 2 + grid.xMargin)}px;">
                    </div>`;
            }
        }

        drawElement.innerHTML = htmlString;
    };

    /** @desc Sets px per numRows.
     * @params numRows number number of numRows.
     * @params column number number of numColumns.
     */
    let drawHash = function (obj) {
        // let {numHor, numVer, cellWidth, cellHeight} = obj;

        // let drawElement = document.createElement("div");
        // let htmlString = "",
        //     i,
        //     j,
        //     lineThickness = "2px";

        // if (drawElement.children()) {
        //     drawElement.children().remove();
        // }

        // // Horizontal lines
        // for (i = 0; i <= numVer; i += 1) {
        //     htmlString += "<div class="horizontal-hash-line" style="" +
        //     "left:" + "0px;" +
        //     "top: " + (i * cellHeight) + "px;" +
        //     "width: 100%;" + "height:" + lineThickness + ";">" +
        //     "</div>";
        // }

        // // Vertical lines
        // for (i = 0; i <= numHor; i += 1) {
        //     htmlString += "<div class="vertical-hash-line" style="" +
        //     "top:" + "0px;" +
        //     "left:" + (i * cellWidth) + "px;" +
        //     "height:100%;" + "width:" + lineThickness + ";">" +
        //     "</div>";
        // }

        // drawElement.append(drawObj);
        // obj.element.append(drawElement);
    };

    return Object.freeze({
        initialize,
        renderGrid,
        createGridDraw,
        updateGridSize,
        drawBox,
        drawGrid,
        drawHash
    })
};
