import {removeNodes} from './utils.js';
export default Render;

function Render(comp) {
    let {dashgrid} = comp;

    // Start row / column denotes the pixel at which each cell starts at.
    let startColumn = [];
    let startRow = [];
    let columnWidth, rowHeight;

    /**
    * @returns 
    */
    let getColumnWidth = function () {
        return columnWidth;
    };

    /**
    * @returns 
    */
    let getRowHeight = function () {
        return rowHeight;
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setGridElementWidth = function () {
        dashgrid._element.style.width = (columnWidth) ?
            columnWidth * dashgrid.numColumns + (dashgrid.numColumns + 1) * dashgrid.xMargin + 'px' :
            dashgrid._element.parentNode.offsetWidth + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setColumnWidth = function () {            
        columnWidth = (dashgrid.columnWidth !== 'auto') ?
            dashgrid.columnWidth :
            (dashgrid._element.parentNode.offsetWidth - (dashgrid.numColumns + 1) * dashgrid.xMargin) / dashgrid.numColumns;
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setGridElementHeight = function () {
        dashgrid._element.style.height = (rowHeight) ?
            rowHeight * dashgrid.numRows + (dashgrid.numRows + 1) * dashgrid.yMargin + 'px' :
            dashgrid._element.parentNode.offsetHeight + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setRowHeight = function () {
        rowHeight = (dashgrid.rowHeight !== 'auto') ?
            dashgrid.rowHeight :
            (dashgrid._element.parentNode.offsetHeight - (dashgrid.numRows + 1) * dashgrid.yMargin) / dashgrid.numRows;
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setBoxElementXPosition = function (element, column) {
        element.style.left = column * columnWidth + dashgrid.xMargin * (column + 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setBoxElementYPosition = function (element, row) {
        element.style.top = row * rowHeight + dashgrid.yMargin * (row + 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setBoxElementWidth = function (element, columnspan) {
        element.style.width = columnspan * columnWidth + dashgrid.xMargin * (columnspan - 1) + 'px';
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setBoxElementHeight = function (element, rowspan) {
        element.style.height = rowspan * rowHeight + dashgrid.yMargin * (rowspan - 1) + 'px';
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

        for (let i = 0; i < dashgrid.numRows; i += 1) {
            start = i * (rowHeight + dashgrid.yMargin) + dashgrid.yMargin / 2;
            stop = start + rowHeight + dashgrid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (let i = 0; i < dashgrid.numColumns; i += 1) {
            start = i * (columnWidth + dashgrid.xMargin) + dashgrid.xMargin / 2;
            stop = start + columnWidth + dashgrid.xMargin;
            startColumn.push([Math.floor(start), Math.ceil(stop)]);
        }
    };

    /**
     * Finds which cells box intersects with.
     * @param {Object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows How many rows the box spans.
     * @param {Number} numColumns How many rows the box spans.
     * @return {Object} The row or column which each side is found in.
     *     For instance, boxLeft: column = 0, boxRight: column = 1,
     *     BoxTop: row = 0, BoxBottom: row = 3.
     */
    let findIntersectedCells = function (comp) {
        let {top, right, bottom, left} = comp;
        let boxLeft, boxRight, boxTop, boxBottom;

        // Find top and bottom intersection cell row.
        for (let i = 0; i < dashgrid.numRows; i += 1) {
            if (top >= startRow[i][0] && top <= startRow[i][1]) {boxTop = i;}
            if (bottom >= startRow[i][0] && bottom <= startRow[i][1]) {boxBottom = i;}
        }

        // Find left and right intersection cell column.
        for (let j = 0; j < dashgrid.numColumns; j += 1) {
            if (left >= startColumn[j][0] && left <= startColumn[j][1]) {boxLeft = j;}
            if (right >= startColumn[j][0] && right <= startColumn[j][1]) {boxRight = j;}
        }

        return {boxLeft, boxRight, boxTop, boxBottom};
    };

    /**
     * Get closest cell given (row, column) position in px.
     * @param {Object} boxPosition Contains top/bottom/left/right box position
     *     in px.
     * @param {Number} numRows
     * @param {Number} numColumns
     * @returns {Object}
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
            rightOverlap = Math.abs(right - startColumn[boxRight][1] - dashgrid.xMargin);
            if (leftOverlap <= rightOverlap) {column = boxLeft;}
            else {column = boxLeft + 1;}
        }

        let row;
        let topOverlap;
        let bottomOverlap;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - dashgrid.yMargin);
            if (topOverlap <= bottomOverlap) {row = boxTop;}
            else {row = boxTop + 1;}
        }

        return {row, column};
    }

    return Object.freeze({
        getColumnWidth,
        getRowHeight,
        setColumnWidth,
        setRowHeight,
        setGridElementHeight,
        setGridElementWidth,
        setBoxElementXPosition,
        setBoxElementYPosition,
        setBoxElementWidth,
        setBoxElementHeight,
        findIntersectedCells,
        setCellCentroids,
        getClosestCells
   });
}
