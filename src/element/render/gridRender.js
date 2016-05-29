export {GridRender};

/**
 * Mutates the renderState
 * @param {Object} renderState
 * @param {Object} gridState
 * @returns {Function} setColumnWidth,
 * @returns {Function} setRowHeight,
 * @returns {Function} findIntersectedCells,
 * @returns {Function} setCellCentroids,
 * @returns {Function} getClosestCells
 */
function GridRender(gridDOM, gridState, renderState) {

    /**
    *
    * @param {}
    * @returns
    */
    let setColumnWidth = function () {
        renderState.columnWidth = (gridState.columnWidth !== 'auto') ?
            gridState.columnWidth :
            (gridDOM.element.parentNode.offsetWidth - (gridState.numColumns + 1) * gridState.xMargin) / gridState.numColumns;
    };

    /**
    *
    * @param {}
    * @returns
    */
    let setRowHeight = function () {
        renderState.rowHeight = (gridState.rowHeight !== 'auto') ?
            gridState.rowHeight :
            (gridDOM.element.parentNode.offsetHeight - (gridState.numRows + 1) * gridState.yMargin) / gridState.numRows;
    };

    /**
     * Initializes cell centroids which are used to compute closest cell
     *     when dragging a box.
     * @param {Number} numRows The total number of rows.
     * @param {Number} numColumns The total number of rows.
     */
    let setCellCentroids = function () {
        let startRow = [];
        let startColumn = [];
        let start;
        let stop;

        for (let i = 0; i < gridState.numRows; i += 1) {
            start = i * (renderState.rowHeight + gridState.yMargin) + gridState.yMargin / 2;
            stop = start + renderState.rowHeight + gridState.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (let i = 0; i < gridState.numColumns; i += 1) {
            start = i * (renderState.columnWidth + gridState.xMargin) + gridState.xMargin / 2;
            stop = start + renderState.columnWidth + gridState.xMargin;
            startColumn.push([Math.floor(start), Math.ceil(stop)]);
        }

        gridState.startRow = startRow;
        gridState.startColumn = startColumn;
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
        for (let i = 0; i < gridState.numRows; i += 1) {
            if (top >= renderState.startRow[i][0] && top <= renderState.startRow[i][1]) {boxTop = i;}
            if (bottom >= renderState.startRow[i][0] && bottom <= renderState.startRow[i][1]) {boxBottom = i;}
        }

        // Find left and right intersection cell column.
        for (let j = 0; j < gridState.numColumns; j += 1) {
            if (left >= renderState.startColumn[j][0] && left <= renderState.startColumn[j][1]) {boxLeft = j;}
            if (right >= renderState.startColumn[j][0] && right <= renderState.startColumn[j][1]) {boxRight = j;}
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
            rightOverlap = Math.abs(right - startColumn[boxRight][1] - gridState.xMargin);
            if (leftOverlap <= rightOverlap) {column = boxLeft;}
            else {column = boxLeft + 1;}
        }

        let row;
        let topOverlap;
        let bottomOverlap;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(bottom - startRow[boxBottom][1] - gridState.yMargin);
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
    let setGridElementWidth = function () {
        gridDOM.element.style.width = (renderState.columnWidth) ?
            renderState.columnWidth * gridState.numColumns + (gridState.numColumns + 1) * gridState.xMargin + 'px' :
            gridDOM.element.parentNode.offsetWidth + 'px';
    };

    /**
     *
     * @param {}
     * @returns
     */
    let setGridElementHeight = function () {
        gridDOM.element.style.height = (renderState.rowHeight) ?
            renderState.rowHeight * gridState.numRows + (gridState.numRows + 1) * gridState.yMargin + 'px' :
            gridDOM.element.parentNode.offsetHeight + 'px';
    };

    return Object.freeze({
        setColumnWidth,
        setRowHeight,
        findIntersectedCells,
        setCellCentroids,
        getClosestCells,
        setGridElementWidth,
        setGridElementHeight
    });
}
