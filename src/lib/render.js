import * as GridVisual from '../element/gridVisual.js';

export {
    renderGrid,
    renderBox,
    updateRenderBoundary,
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
 * [getGridElementWidth description]
 * @param  {[type]} {columnWidth [description]
 * @param  {[type]} parentWidth  [description]
 * @param  {[type]} numColumns   [description]
 * @param  {[type]} xMargin}     [description]
 * @return {[type]}              [description]
 */
function getGridElementWidth({columnWidth, parentWidth, numColumns, xMargin}) {
    return (columnWidth) ?
        columnWidth * numColumns + (numColumns + 1) * xMargin + 'px' : parentWidth + 'px';
}

/**
 * [getGridElementHeight description]
 * @param  {[type]} {rowHeight    [description]
 * @param  {[type]} numRows       [description]
 * @param  {[type]} yMargin       [description]
 * @param  {[type]} parentHeight} [description]
 * @return {[type]}               [description]
 */
function getGridElementHeight({rowHeight, numRows, yMargin, parentHeight}) {
    return (rowHeight) ?
        rowHeight * numRows + (numRows + 1) * yMargin + 'px' : parentHeight + 'px';
}

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
 * @returns {Object.<Array, Array>} startRow, startColumn.
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
    // TODO: boxLeft returns undefined, because left is -20.
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

function renderGrid(grid) {
    grid.state.render.columnWidth = getColumnWidth({
        columnWidth: grid.state.grid.columnWidth,
        parentWidth: grid.element.grid.parentNode.offsetWidth,
        numColumns: grid.state.grid.numColumns,
        xMargin: grid.state.grid.xMargin
    });

    grid.state.render.rowHeight = getRowHeight({
        rowHeight: grid.state.grid.rowHeight,
        parentHeight: grid.element.grid.parentNode.offsetHeight,
        numRows: grid.state.grid.numRows,
        yMargin: grid.state.grid.yMargin
    });

    grid.element.grid.style.height = getGridElementHeight({
        rowHeight: grid.state.render.rowHeight,
        parentHeight: grid.element.grid.parentNode.offsetHeight,
        numRows: grid.state.grid.numRows,
        yMargin: grid.state.grid.yMargin
    });

    grid.element.grid.style.width = getGridElementWidth({
        columnWidth: grid.state.render.columnWidth,
        parentWidth: grid.element.grid.parentNode.offsetWidth,
        numColumns: grid.state.grid.numColumns,
        xMargin: grid.state.grid.xMargin
    });

    if (grid.state.grid.showVerticalLine) {
        grid.element.vertical.innerHTML = "";
        grid.element.vertical.appendChild(GridVisual.VerticalLines(grid));
    }

    if (grid.state.grid.showHorizontalLine) {
        grid.element.horizontal.innerHTML = "";
        grid.element.horizontal.appendChild(GridVisual.HorizontalLines(grid));
    }

    if (grid.state.grid.showCentroid) {
        grid.element.centroid.innerHTML = "";
        grid.element.centroid.appendChild(GridVisual.Centroids(grid));
    }
}


function renderBox({grid, boxes, excludeBox}) {
    if (!Array.isArray(boxes)) { boxes = [boxes]; }

    boxes.forEach(function (box) {
        if (excludeBox !== box) {
            box.element.box.style.top = getBoxElementYPosition({
                row: box.state.box.row,
                rowHeight: grid.state.render.rowHeight,
                yMargin: grid.state.grid.yMargin
            });
            box.element.box.style.left = getBoxElementXPosition({
                column: box.state.box.column,
                columnWidth: grid.state.render.columnWidth,
                xMargin: grid.state.grid.xMargin
            });
            box.element.box.style.height = getBoxElementHeight({
                rowspan: box.state.box.rowspan,
                rowHeight: grid.state.render.rowHeight,
                yMargin: grid.state.grid.yMargin
            });
            box.element.box.style.width = getBoxElementWidth({
                columnspan: box.state.box.columnspan,
                columnWidth: grid.state.render.columnWidth,
                xMargin: grid.state.grid.xMargin
            });
        }
      }
  );
}

/**
 * [updateRenderBoundary description]
 * @param  {[type]} grid [description]
 * @return {[type]}      [description]
 */
function updateRenderBoundary(grid) {
    // Left.
    grid.state.render.minLeft = grid.state.grid.xMargin;
    grid.state.render.maxLeft = grid.element.grid.offsetWidth - grid.state.grid.xMargin;

    // Top.
    grid.state.render.minTop = grid.state.grid.yMargin;
    grid.state.render.maxTop = grid.element.grid.offsetHeight - grid.state.grid.yMargin;
}
