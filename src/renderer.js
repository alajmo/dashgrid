/**
 * gridRender.js: Low-level draw.
 */

export default function Render(comp) {
    let {grid} = comp;

    // Start row / column denotes the pixel at which each cell starts at.
    let startColumn = [];
    let startRow = [];

    let setGridWidth = function () {
        grid.element.style.width = (grid.columnWidth) ? grid.columnWidth * grid.numColumns + (grid.numColumns + 1) * grid.xMargin + 'px' : grid.element.parentNode.offsetWidth + 'px';
    };

    let setColumnWidth = function () {
        grid.columnWidth = (grid.columnWidth) ? grid.columnWidth : (grid.element.parentNode.offsetWidth - (grid.numColumns + 1) * grid.xMargin) / grid.numColumns;
    };

    let setGridHeight = function () {
        grid.element.style.height = (grid.rowHeight) ? grid.rowHeight * grid.numRows + (grid.numRows + 1) * grid.yMargin + 'px' : grid.element.parentNode.offsetHeight + 'px';
    };

    let setRowHeight = function () {
        grid.rowHeight = (grid.rowHeight) ? grid.rowHeight : (grid.element.parentNode.offsetHeight - (grid.numRows + 1) * grid.yMargin) / grid.numRows;
    };

    let setBoxXPosition = function (element, column) {
        element.style.left = column * grid.columnWidth + grid.xMargin * (column + 1) + 'px';
    };

    let setBoxYPosition = function (element, row) {
        element.style.top = row * grid.rowHeight + grid.yMargin * (row + 1) + 'px';
    };

    let setBoxWidth = function (element, columnspan) {
        element.style.width = columnspan * grid.columnWidth + grid.xMargin * (columnspan - 1) + 'px';
    };

    let setBoxHeight = function (element, rowspan) {
        element.style.height = rowspan * grid.rowHeight + grid.yMargin * (rowspan - 1) + 'px';
    };

    /**
     * Initializes cell centroids which are used to compute closest cell
     *     when dragging a box.
     * @param {Number} numRows The total number of rows.
     * @param {Number} numColumns The total number of rows.
     */
    let setCellCentroids = function () {
        startRow = [];
        startColumn = [];
        let start;
        let stop;

        for (let i = 0; i < grid.numRows; i += 1) {
            start = i * (grid.rowHeight + grid.yMargin) + grid.yMargin / 2;
            stop = start + grid.rowHeight + grid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (let i = 0; i < grid.numColumns; i += 1) {
            start = i * (grid.columnWidth + grid.xMargin) + grid.xMargin / 2;
            stop = start + grid.columnWidth + grid.xMargin;
            startColumn.push([Math.floor(start), Math.ceil(stop)]);
        }
    };

    /**
     * Finds which cells box intersects with.
     * @desc Checks the sides of the box to see which cell it is in.
     * @param {object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows How many rows the box spans.
     * @param {Number} numColumns How many rows the box spans.
     * @return {object} The row or column which each side is found in.
     *     For instance, boxLeft: column = 0, boxRight: column = 1,
     *     BoxTop: row = 0, BoxBottom: row = 3.
     */
    let findIntersectedCells = function (comp) {
        let {top, right, bottom, left} = comp;
        let boxLeft, boxRight, boxTop, boxBottom;

        // Find top and bottom intersection cell row.
        for (let i = 0; i < grid.numRows; i += 1) {
            if (top >= startRow[i][0] && top <= startRow[i][1]) {boxTop = i;}
            if (bottom >= startRow[i][0] && bottom <= startRow[i][1]) {boxBottom = i;}
        }

        // Find left and right intersection cell column.
        for (let j = 0; j < grid.numColumns; j += 1) {
            if (left >= startColumn[j][0] && left <= startColumn[j][1]) {boxLeft = j;}
            if (right >= startColumn[j][0] && right <= startColumn[j][1]) {boxRight = j;}
        }

        return {boxLeft, boxRight, boxTop, boxBottom};
    };

    /**
     * Get closest cell given (row, column) position in px.
     * @param {object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows
     * @param {Number} numColumns
     * @returns {object}
     */
    let getClosestCells = function (comp) {
        let {top, right, bottom, left} = comp;
        let {boxLeft, boxRight, boxTop, boxBottom} = findIntersectedCells(comp);

        let column;
        let leftOverlap;
        let rightOverlap;
        // Determine if enough overlap for horizontal move.
        if (boxLeft !== undefined && boxRight !== undefined) {
            leftOverlap = Math.abs(left - startColumn[boxLeft][0]);
            rightOverlap = Math.abs(right - startColumn[boxRight][1] - grid.xMargin);
            if (leftOverlap <= rightOverlap) {column = boxLeft;}
            else {column = boxLeft + 1;}
        }

        let row;
        let topOverlap;
        let bottomOverlap;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - grid.yMargin);
            if (topOverlap <= bottomOverlap) {row = boxTop;}
            else {row = boxTop + 1;}
        }

        return {row, column};
    }

    return Object.freeze({
        setCellCentroids,
        setColumnWidth,
        setRowHeight,
        setGridHeight,
        setGridWidth,
        setBoxXPosition,
        setBoxYPosition,
        setBoxWidth,
        setBoxHeight,
        findIntersectedCells,
        getClosestCells
   });
}
