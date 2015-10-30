/**
 * Intermediate between grid and DOM, handles only mapping between the two,
 * no state is kept in Render.
 *
 */

export default function Render(grid) {
    let startCol = [];
    let startRow = [];
    let widthPerCell;
    let heightPerCell;

    /**
     *
     */
    let getWidthPerCell = function () {
        return widthPerCell;
    };

    /**
     *
     */
    let getHeightPerCell = function () {
        return heightPerCell;
    };

    /**
     *
     */
    let initCellCentroids = function (obj) {
        let {numRows, numColumns} = obj;
        let start;
        let stop;
        startRow = [];
        startCol = [];

        for (let i = 0; i < numRows; i += 1) {
            start = i * (heightPerCell + grid.yMargin) + grid.yMargin / 2;
            stop = start + heightPerCell + grid.yMargin;
            startRow.push([Math.floor(start), Math.ceil(stop)]);
        }

        for (let i = 0; i < numColumns; i += 1) {
            start = i * (widthPerCell + grid.xMargin) + grid.xMargin / 2;
            stop = start + widthPerCell + grid.xMargin;
            startCol.push([Math.floor(start), Math.ceil(stop)]);
        }
    };

    /**
     *  @desc Set grid member.width in pixels and adjust column width, which
     * depends on grid member.width and number of numColumns.
     *  @params pxParentWidth number
     */
    let setWidth = function (obj) {
        let {element, width} = obj;
        if (width === 'inherit') {
            element.style.width = element.parentNode.offsetWidth + 'px';
        } else {
            element.style.width = width + 'px';
        }
    };

    /**
     *  @desc Set grid member.width in pixels and adjust column width, which
     * depends on grid member.width and number of numColumns.
     *  @params pxParentWidth number
     */
    let updateWidth = function (obj) {
        let {element, numColumns} = obj;
        element.style.width = widthPerCell * numColumns +
            (numColumns + 1) * grid.xMargin + 'px';
    };

    /**
     *  @desc Set grid member.height in pixels and adjust row height, which
     *       depends on grid member.height and column member.width or user-input.
     *  @params pxParentHeight number
     */
    let setHeight = function (obj) {
        let {element, height} = obj;
        if (height === 'inherit') {
            element.style.height = element.parentNode.offsetHeight + 'px';
        } else {
            element.style.height = height + 'px';
        }
    };

    let updateHeight = function (obj) {
        let {element, numRows} = obj;
        element.style.height = heightPerCell * numRows +
            (numRows + 1) * grid.yMargin + 'px';
    };

    /**
     *  @desc Sets px per numColumns.
     */
    let setWidthPerCell = function (obj) {
        let {element, numColumns, width} = obj;
        let gridWidth;
        if (width === 'inherit') {
            gridWidth = element.parentNode.offsetWidth;
        } else {
            gridWidth = width;
        }
        widthPerCell = (gridWidth - (numColumns + 1) * grid.xMargin) /
            numColumns;
    };

    /**
     *  @desc Sets px per numRows.
     */
    let setHeightPerCell = function (obj) {
        let {element, numRows, height} = obj;
        let gridHeight;
        if (height === 'inherit') {
            gridHeight = element.parentNode.offsetHeight;
        } else {
            gridHeight = height;
        }
        heightPerCell = (gridHeight - (numRows + 1) *
            grid.yMargin) / numRows;
    };

    /** @desc Set x box position given row number.
     *  @params element object element in question.
     *  @params x number column (integer)
     */
    let setBoxXPosition = function (obj) {
        let {element, column} = obj;
        element.style.left = column * widthPerCell + grid.xMargin *
            (column + 1) + 'px';
    };

    /* obj.element  @params element object element in question.
     *  @params y number row (integer)
     */
    let setBoxYPosition = function (obj) {
        let {element, row} = obj;
        element.style.top = row * heightPerCell + grid.yMargin *
            (row + 1) + 'px';
    };

    /** @desc Set box width
     *  @params numRows object number of numRows.
     */
    let setBoxWidth = function (obj) {
        let {element, columnspan} = obj;
        element.style.width = columnspan * widthPerCell +
            grid.xMargin * (columnspan - 1) + 'px';
    };

    /**
     *  @params numRows object number of numRows.
     */
    let setBoxHeight = function (obj) {
        let {element, rowspan} = obj;
        element.style.height = rowspan * heightPerCell +
            grid.yMargin * (obj.rowspan - 1) + 'px';
    };

    let findIntersectedCells = function (obj) {
        let {relPos, numRows, numColumns} = obj;
        let boxLeft;
        let boxRight;
        let boxTop;
        let boxBottom;

        // Find top and bottom intersection cell row.
        for (let i = 0; i < obj.numRows; i += 1) {
            if (relPos.top >= startRow[i][0] &&
                relPos.top <= startRow[i][1]) {
                boxTop = i;
            }
            if (relPos.bottom >= startRow[i][0] &&
                relPos.bottom <= startRow[i][1]) {
                boxBottom = i;
            }
        }

        // Find left and right intersection cell column.
        for (let j = 0; j < obj.numColumns; j += 1) {
            if (obj.relPos.left >= startCol[j][0] &&
                obj.relPos.left <= startCol[j][1]) {
                boxLeft = j;
            }
            if (obj.relPos.right >= startCol[j][0] &&
                obj.relPos.right <= startCol[j][1]) {
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
     *  @desc get closest cell given x, y position in pixels.
     *  @params {number} column position in pixels from left.
     *  @params {number} row position in pixels from left.
     *  @returns {object}
     */
    let getClosestCells = function (obj) {
        let {relPos, numRows, numColumns} = obj;
        let {boxLeft, boxRight, boxTop, boxBottom} = findIntersectedCells(obj);

        let pos = {
            column: undefined,
            row: undefined,
            columnspan: undefined,
            rowspan: undefined
        };

        let leftOverlap;
        let rightOverlap;
        // Determine if enough overlap for horizontal move.
        if (boxLeft !== undefined && boxRight !== undefined) {
            leftOverlap = Math.abs(obj.relPos.left - startCol[boxLeft][0]);
            rightOverlap = Math.abs(obj.relPos.right - startCol[boxRight][1] -
                grid.xMargin);
            if (leftOverlap <= rightOverlap) {
                pos.column = boxLeft;
            } else {
                pos.column = boxLeft + 1;
            }
        }

        let topOverlap;
        let bottomOverlap;
        // Determine if enough overlap for vertical move.
        if (boxTop !== undefined && boxBottom !== undefined) {
            topOverlap = Math.abs(obj.relPos.top - startRow[boxTop][0]);
            bottomOverlap = Math.abs(obj.relPos.bottom -
                startRow[boxBottom][1] - grid.yMargin);
            if (topOverlap <= bottomOverlap) {
                pos.row = boxTop;
            } else {
                pos.row = boxTop + 1;
            }
        }

        return pos;
    }

    return Object.freeze({
        initCellCentroids,
        setWidth,
        setHeight,
        setWidthPerCell,
        setHeightPerCell,
        updateHeight,
        updateWidth,
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
