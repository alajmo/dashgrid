/**
 * gridRender.js: Low-level draw.
 */

export default function Render(grid) {
    // Start row / column denotes the pixel at which each cell starts at.
    let startColumn = [];
    let startRow = [];
    let widthPerCell;
    let heightPerCell;

    /**
     * Returns width in px per cell.
     * @return {number} widthPerCell.
     */
    let getWidthPerCell = function () {
        return widthPerCell;
    };

    /**
     * Returns height in px per cell.
     * @return {number} heightPerCell.
     */
    let getHeightPerCell = function () {
        return heightPerCell;
    };

    /**
     * Initializes cell centroids which are used to compute closest cell
     *     when dragging a box.
     * @param {number} numRows The total number of rows.
     * @param {number} numColumns The total number of rows.
     */
    let setCellCentroids = function (obj) {
        let {numRows, numColumns} = obj;
        startRow = [];
        startColumn = [];
        let start;
        let stop;

        for (let i = 0; i < numRows; i += 1) {
            start = i * (heightPerCell + grid.yMargin) + grid.yMargin / 2;
            stop = start + heightPerCell + grid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (let i = 0; i < numColumns; i += 1) {
            start = i * (widthPerCell + grid.xMargin) + grid.xMargin / 2;
            stop = start + widthPerCell + grid.xMargin;
            startColumn.push([Math.floor(start), Math.ceil(stop)]);
        }
    };

    /**
     * Update grid width in pixels.
     * @param {object} element The grid element.
     * @param {number} numColumns Number of columns.
     */
    let updateGridWidth = function (obj) {
        let {element, numColumns} = obj;

        element.style.width = widthPerCell * numColumns +
            (numColumns + 1) * grid.xMargin + "px";
    };

    /**
     * Update grid height in pixels.
     * @param {object} element The grid element.
     * @param {number} numRows Number of columns.
     */
    let updateGridHeight = function (obj) {
        let {element, numRows} = obj;

        element.style.height = heightPerCell * numRows +
            (numRows + 1) * grid.yMargin + "px";
    };

    /**
     * Sets px per cell width and the total grid width.
     * @param {object} element The grid element.
     * @param {number} numColumns Number of columns.
     * @param {number} width Grid width in px.
     */
    let setWidthPerCell = function (obj) {
        let {element, numColumns, width} = obj;

        if (width === "inherit") {
            // gridWidth
            element.style.width = element.parentNode.offsetWidth + "px";

            // columnWidth
            widthPerCell = (element.parentNode.offsetWidth -
                (numColumns + 1) * grid.xMargin) / numColumns;
        } else {
            // columnWidth
            widthPerCell = grid.columnWidth;

            // gridWidth
            element.style.width = widthPerCell * numColumns +
                (numColumns + 1) * grid.xMargin + "px";
        }

    };

    /**
     * Sets px per cell height.
     * @param {object} element The grid element.
     * @param {number} numRows Number of rows.
     * @param {height} Grid height in px.
     */
    let setHeightPerCell = function (obj) {
        let {element, numRows, height} = obj;

        if (height === "inherit") {
            // gridHeight
            element.style.height = element.parentNode.offsetHeight + "px";

            // rowHeight
            heightPerCell = (element.parentNode.offsetHeight -
                (numRows + 1) * grid.yMargin) / numRows;
        } else {
            // rowHeight
            heightPerCell = grid.rowHeight;

            // gridHeight
            element.style.width = heightPerCell * numRows +
                (numRows + 1) * grid.yMargin + "px";
        }

    };

    /**
     * Sets box x position in px.
     * @param {object} element The box element.
     * @param {number} column Column position of left side of box.
     */
    let setBoxXPosition = function (obj) {
        let {element, column} = obj;
        element.style.left = column * widthPerCell + grid.xMargin *
            (column + 1) + "px";
    };

    /**
     * Sets box y position in px.
     * @param {object} element The box element.
     * @param {number} row Row position of upper side of box.
     */
    let setBoxYPosition = function (obj) {
        let {element, row} = obj;
        element.style.top = row * heightPerCell + grid.yMargin *
            (row + 1) + "px";
    };

    /**
     * Set box width in px.
     * @param {object} element The box element.
     * @param {number} columnspan How many columns the box spans.
     */
    let setBoxWidth = function (obj) {
        let {element, columnspan} = obj;
        element.style.width = columnspan * widthPerCell +
            grid.xMargin * (columnspan - 1) + "px";
    };

    /**
     * Set box height in px.
     * @param {object} element The box element.
     * @param {number} rowspan How many rows the box spans.
     */
    let setBoxHeight = function (obj) {
        let {element, rowspan} = obj;
        element.style.height = rowspan * heightPerCell +
            grid.yMargin * (obj.rowspan - 1) + "px";
    };

    /**
     * Finds which cells box intersects with.
     * @desc Checks the sides of the box to see which cell it is in.
     * @param {object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {number} numRows How many rows the box spans.
     * @param {number} numColumns How many rows the box spans.
     * @return {object} The row or column which each side is found in.
     *     For instance, boxLeft: column = 0, boxRight: column = 1,
     *     BoxTop: row = 0, BoxBottom: row = 3.
     */
    let findIntersectedCells = function (obj) {
        let {boxPosition, numRows, numColumns} = obj;
        let boxLeft;
        let boxRight;
        let boxTop;
        let boxBottom;

        // Find top and bottom intersection cell row.
        for (let i = 0; i < obj.numRows; i += 1) {
            if (boxPosition.top >= startRow[i][0] &&
                boxPosition.top <= startRow[i][1]) {
                boxTop = i;
            }
            if (boxPosition.bottom >= startRow[i][0] &&
                boxPosition.bottom <= startRow[i][1]) {
                boxBottom = i;
            }
        }

        // Find left and right intersection cell column.
        for (let j = 0; j < obj.numColumns; j += 1) {
            if (obj.boxPosition.left >= startColumn[j][0] &&
                obj.boxPosition.left <= startColumn[j][1]) {
                boxLeft = j;
            }
            if (obj.boxPosition.right >= startColumn[j][0] &&
                obj.boxPosition.right <= startColumn[j][1]) {
                boxRight = j;
            }
        }

        return {
            boxLeft: boxLeft,
            boxRight: boxRight,
            boxTop: boxTop,
            boxBottom: boxBottom
        };
    };

    /**
     * Get closest cell given (row, column) position in px.
     * @param {object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {number} numRows
     * @param {number} numColumns
     * @returns {object}
     */
    let getClosestCells = function (obj) {
        let {boxPosition, numRows, numColumns} = obj;
        let {boxLeft, boxRight, boxTop, boxBottom} = findIntersectedCells(obj);

        let position = {
            column: undefined,
            row: undefined,
            columnspan: undefined,
            rowspan: undefined
        };

        let leftOverlap;
        let rightOverlap;
        // Determine if enough overlap for horizontal move.
        if (boxLeft !== undefined && boxRight !== undefined) {
            leftOverlap = Math.abs(obj.boxPosition.left -
                startColumn[boxLeft][0]);

            rightOverlap = Math.abs(obj.boxPosition.right -
                startColumn[boxRight][1] - grid.xMargin);
            if (leftOverlap <= rightOverlap) {
                position.column = boxLeft;
            } else {
                position.column = boxLeft + 1;
            }
        }

        let topOverlap;
        let bottomOverlap;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(obj.boxPosition.top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(obj.boxPosition.bottom -
                startRow[boxBottom][1] - grid.yMargin);
            if (topOverlap <= bottomOverlap) {
                position.row = boxTop;
            } else {
                position.row = boxTop + 1;
            }
        }

        return position;
    }

    return Object.freeze({
        setCellCentroids,
        setWidthPerCell,
        setHeightPerCell,
        updateGridHeight,
        updateGridWidth,
        setBoxXPosition,
        setBoxYPosition,
        setBoxWidth,
        setBoxHeight,
        findIntersectedCells,
        getClosestCells,
        getWidthPerCell,
        getHeightPerCell
   });
}
