/**
 *
 * @param {Object} dashgrid
 * @param {Object} renderer
 * @param {Object} boxHandler
 * @returns {Function} init Initialize Grid.
 * @returns {Function} updateBox API for updating box, moving / resizing.
 * @returns {Function} insertBox Insert a new box.
 * @returns {Function} removeBox Remove a box.
 * @returns {Function} getBox Return box object given DOM element.
 * @returns {Function} updateStart When drag / resize starts.
 * @returns {Function} update During dragging / resizing.
 * @returns {Function} updateEnd After drag / resize ends.
 * @returns {Function} renderGrid Update grid element.
 */
function grid() {
    /**
     * creates the necessary box elements and checks that the boxes input is
     * correct.
     * 1. Create box elements.
     * 2. Update the dashgrid since newly created boxes may lie outside the
     *    initial dashgrid state.
     * 3. Render the dashgrid.
     */
    let init = function (state) {
        gridEngine().init({
            gridState: state.gridState,
            gridEngineState: state.gridEngineState
        });
        // gridView(state.gridViewState);
    };

    /**
    *
    * @param {}
    * @returns
    */
    let addBoxes = function (state) {
        // let boxes = [];

        // for (let i = 0, len = state.boxes.length; i < len; i++) {
        //     boxes.push(box({box: state.boxes[i], gridState: gridState}));
        // }

        // gridState.boxes = boxes;
    };

    /**
     *
     * @param {Object} box
     * @param {Object} updateTo
     * @param {Object} excludeBox Optional parameter, if updateBox is triggered
     *                            by drag / resize event, then don't update
     *                            the element.
     * @returns {boolean} If update succeeded.
     */
    let updateBox = function (box, updateTo, excludeBox) {
        let movedBoxes = gridEngine.updateBox(box, updateTo);

        if (movedBoxes.length > 0) {
            gridView.renderBox(movedBoxes, excludeBox);
            gridView.renderGrid();

            return true;
        }

        return false;
    };

    /**
     * Removes a box.
     * @param {Object} box
     */
    let removeBox = function (box) {
        gridEngine.removeBox(box);
        gridView.renderGrid();
    };

    /**
     * Resizes a box.
     * @param {Object} box
     */
    let resizeBox = function (box) {
        // In case box is not updated by dragging / resizing.
        gridView.renderBox(movedBoxes);
        gridView.renderGrid();
    };

    /**
     * Called when either resize or drag starts.
     * @param {Object} box
     */
    let updateStart = function (box) {
        gridEngine.increaseNumRows(box, 1);
        gridEngine.increaseNumColumns(box, 1);
        gridView.renderGrid();
    };

    /**
     * When dragging / resizing is dropped.
     * @param {Object} box
     */
    let update = function (box) {
    };

    /**
     * When dragging / resizing is dropped.
     */
    let updateEnd = function () {
        gridEngine.decreaseNumRows();
        gridEngine.decreaseNumColumns();
        gridView.renderGrid();
    };

    let refreshGrid = function () {
        gridView.renderBox(dashgrid.boxes);
        gridView.renderGrid();
    };

    return Object.freeze({
        init: init,
        updateBox: updateBox,
        updateStart: updateStart,
        update: update,
        updateEnd: updateEnd,
        refreshGrid: refreshGrid
    });
}
