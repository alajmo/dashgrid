import {DOM} from '../gridDOM.js';

export {
    getColumnWidth,
    getRowHeight,
    findIntersectedCells,
    getCellCentroidPosition,
    getClosestCells,
    getGridElementWidth,
    getGridElementHeight,
    getBoxElementXPosition,
    getBoxElementYPosition,
    getBoxElementWidth,
    getBoxElementHeight
};

/**
 *
 * @param {number} columnWidth,
 * @param {number} parentWidth,
 * @param {number} numColumns,
 * @param {number} xMargin
 * @returns {number} Column Width in pixels.
 */
function getColumnWidth({columnWidth, parentWidth, numColumns, xMargin}) {
    return (columnWidth !== 'auto') ?
        columnWidth : (parentWidth - (numColumns + 1) * xMargin) / numColumns;
}

/**
 *
 * @param {number} columnWidth,
 * @param {number} parentWidth,
 * @param {number} numColumns,
 * @param {number} xMargin
 * @returns {number} Row Width in pixels.
 */
function getRowHeight({rowHeight, parentHeight, numRows, yMargin}) {
    return (rowHeight !== 'auto') ?
        rowHeight : (parentHeight - (numRows + 1) * yMargin) / numRows;
}

/**
 *
 * @param {Number} column Column number.
 * @returns
 */
function getBoxElementXPosition({column, columnWidth, xMargin}) {
    return column * columnWidth + xMargin * (column + 1) + 'px';
}

/**
 *
 * @param {Number} row Row number.
 * @returns
 */
function getBoxElementYPosition({row, rowHeight, yMargin}) {
    return row * rowHeight + yMargin * (row + 1) + 'px';
}

/**
 *
 * @param {Number} columnspan Columnspan number.
 * @returns
 */
function getBoxElementWidth({columnspan, columnWidth, xMargin}) {
    return columnspan * columnWidth + xMargin * (columnspan - 1) + 'px';
}

/**
 *
 * @param {Number} rowspan Rowspan number.
 * @returns
 */
function getBoxElementHeight({rowspan, rowHeight, yMargin}) {
    return rowspan * rowHeight + yMargin * (rowspan - 1) + 'px';
}

/**
 * Initializes cell centroids which are used to compute closest cell
 *     when dragging a box.
 * @param {Number} numRows The total number of rows.
 * @param {Number} numColumns The total number of rows.
 * @returns {Object.<Number, Numbe>} startRow, startColumn.
 */
function getCellCentroidPosition({numRows, numColumns, yMargin, xMargin,
    rowHeight, columnWidth}) {
    let startRow = [];
    let startColumn = [];
    let start;
    let stop;

    for (let i = 0; i < numRows; i += 1) {
        start = i * (rowHeight + yMargin) + yMargin / 2;
        stop = start + rowHeight + yMargin;
        startRow.push([Math.floor(start), Math.ceil(stop)]);
    }

    for (let i = 0; i < numColumns; i += 1) {
        start = i * (columnWidth + xMargin) + xMargin / 2;
        stop = start + columnWidth + xMargin;
        startColumn.push([Math.floor(start), Math.ceil(stop)]);
    }

    return {startRow, startColumn};
}

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
function findIntersectedCells({numRows, numColumns, startRow, startColumn,
    top, right, bottom, left, grid}) {
    let boxLeft, boxRight, boxTop, boxBottom;

    // Find top and bottom intersection cell row.
    for (let i = 0; i < numRows; i += 1) {
        if (top >= startRow[i][0] &&
            top <= startRow[i][1]) {
            boxTop = i;
        }
        if (bottom >= startRow[i][0] &&
            bottom <= startRow[i][1]) {
            boxBottom = i;
        }
    }

    // Find left and right intersection cell column.
    for (let j = 0; j < numColumns; j += 1) {
        if (left >= startColumn[j][0] &&
            left <= startColumn[j][1]) {
            boxLeft = j;
        }
        if (right >= startColumn[j][0] &&
            right <= startColumn[j][1]) {
            boxRight = j;
        }
    }

    return {boxLeft, boxRight, boxTop, boxBottom};
}

/**
 * Get closest cell given (row, column) position in px.
 * @param {Object} boxPosition Contains top/bottom/left/right box position
 *     in px.
 * @param {Number} numRows
 * @param {Number} numColumns
 * @returns {Object}
 */
function getClosestCells({xMargin, yMargin, startRow, startColumn, boxLeft,
    boxRight, boxTop, boxBottom, left, right, top, bottom}) {

    let column;
    let leftOverlap;
    let rightOverlap;
    // Determine if enough overlap for horizontal move.
    if (boxLeft !== undefined && boxRight !== undefined) {
        leftOverlap = Math.abs(left - startColumn[boxLeft][0]);
        rightOverlap = Math.abs(right - startColumn[boxRight][1] - xMargin);
        if (leftOverlap <= rightOverlap) {column = boxLeft;}
        else {column = boxLeft + 1;}
    }

    let row;
    let topOverlap;
    let bottomOverlap;
    // Determine if enough overlap for vertical move.
    if (boxTop !== undefined && boxBottom !== undefined) {
        topOverlap = Math.abs(top - startRow[boxTop][0]);
        bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - yMargin);
        if (topOverlap <= bottomOverlap) {row = boxTop;}
        else {row = boxTop + 1;}
    }

    return {row, column};
}

/**
 *
 * @param {}
 * @returns
 */
function getGridElementWidth({columnWidth, parentWidth, numColumns, xMargin}) {
    return (columnWidth) ?
        columnWidth * numColumns + (numColumns + 1) * xMargin + 'px' : parentWidth + 'px';
}

/**
 *
 * @param {}
 * @returns
 */
function getGridElementHeight({rowHeight, numRows, yMargin, parentHeight}) {
    return (rowHeight) ?
        rowHeight * numRows + (numRows + 1) * yMargin + 'px' : parentHeight + 'px';
}
