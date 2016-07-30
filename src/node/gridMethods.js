/**
 * Add box(es) to Grid.
 * @param {Object} grid
 * @param {Array.<Object>} boxes
 */
function addBox({grid, boxes}) {
    // Create box container.
    if (boxes.length > 0 && grid.gridElement.boxes === undefined) {
        grid.gridElement.boxes = {element: document.createElement('div')};
        grid.gridElement.element.appendChild(grid.gridElement.boxes.element);
    }

    // Add boxes.
    boxes.forEach(function (boxOptions) {
        let box = Box({boxOptions: boxOptions, gridState: grid.gridState});

        if (box !== undefined) {
            grid.boxes.push(box);

            // let boxElement = BoxElement(box);
            let boxElement = {element: BoxElement({box, boxOptions.content})};
            grid.boxElements.set(box, boxElement);

            grid.gridElement.boxes.element.appendChild(box.boxElement.element);
            grid.events.set(box.boxElement.element, {box: box, event: 'drag'});
        }
    });
}

/**
 *
 * @param {Object} box
 * @param {Object} updateTo
 * @param {Object} excludeBox Optional parameter, if updateBox is triggered
 *                            by drag / resize event, then don't update
 *                            the element.
 * @returns {boolean} If update succeeded.
 */
function updateGridBox({grid, box, updateTo, excludeBox}) {
    let movedBoxes = updateBox({grid, box, updateTo});

    if (movedBoxes.length > 0) {
        // gridView.renderBox(movedBoxes, excludeBox);
        // gridView.renderGrid();

        return true;
    }

    return false;
};

/**
 * Removes a box.
 * @param {Object} box
 */
function removeBox(box) {
    gridEngine.removeBox(box);
    // gridView.renderGrid();
};

/**
 * Resizes a box.
 * @param {Object} box
 */
function resizeBox(box) {
    // In case box is not updated by dragging / resizing.
    // gridView.renderBox(movedBoxes);
    // gridView.renderGrid();
};

/**
 * Called when either resize or drag starts.
 * @param {Object} box
 */
function updateStart(box) {
    gridEngine.increaseNumRows(box, 1);
    gridEngine.increaseNumColumns(box, 1);
    // gridView.renderGrid();
};

/**
 * When dragging / resizing is dropped.
 */
function updateEnd() {
    gridEngine.decreaseNumRows();
    gridEngine.decreaseNumColumns();
    // gridView.renderGrid();
};

/**
 *
 * @param {}
 * @returns
 */
function refreshGrid() {
    // gridView.renderBox(dashgrid.boxes);
    // gridView.renderGrid();
};

function updateRenderState() {
    Object.assign(grid.renderState, getCellCentroidPosition({
        numRows: grid.gridState.numRows,
        numColumns: grid.gridState.numColumns,
        yMargin: grid.gridState.yMargin,
        xMargin: grid.gridState.xMargin,
        rowHeight: grid.renderState.rowHeight,
        columnWidth: grid.renderState.columnWidth
    }));
}
