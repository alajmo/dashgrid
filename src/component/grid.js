// Grid.
import {GridElement} from '../element/gridElement.js';
import {GridEngine} from './gridEngine.js';

// Box.
import {Box} from '../box.js';

// DOM.
import {DOM} from '../gridDOM.js';

export {Grid};

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
function Grid(gridOptions) {

    /**
     * creates the necessary box elements and checks that the boxes input is
     * correct.
     * 1. Create box elements.
     * 2. Update the dashgrid since newly created boxes may lie outside the
     *    initial dashgrid state.
     * 3. Render the dashgrid.
     */
    function createGrid() {
        let gridState = Object.assign({}, GridState(gridOptions));
        let renderState = Object.assign({}, RenderState());

        let gridElement = gridElement(gridState);
        let gridEngine = GridEngine(gridState);

        let boxes = new WeakMap();
        // gridEngine.init();
    };

    /**
     *
     * @param {}
     * @returns
     */
    function addBoxes(options) {
        let boxState, boxElement;
        options.boxes.forEach(function (b) {
            boxState = BoxState(options);
            boxElement = BoxElement(options, b);

            if (boxState !== undefined) {
                gridState.boxes.push(boxState);
                gridDOM.addBox(boxState, boxElement.element);
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
    function updateBox(box, updateTo, excludeBox) {
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
    function removeBox(box) {
        gridEngine.removeBox(box);
        gridView.renderGrid();
    };

    /**
     * Resizes a box.
     * @param {Object} box
     */
    function resizeBox(box) {
        // In case box is not updated by dragging / resizing.
        gridView.renderBox(movedBoxes);
        gridView.renderGrid();
    };

    /**
     * Called when either resize or drag starts.
     * @param {Object} box
     */
    function updateStart(box) {
        gridEngine.increaseNumRows(box, 1);
        gridEngine.increaseNumColumns(box, 1);
        gridView.renderGrid();
    };

    /**
     * When dragging / resizing is dropped.
     * @param {Object} box
     */
    function update(box) {
    };

    /**
     * When dragging / resizing is dropped.
     */
    function updateEnd() {
        gridEngine.decreaseNumRows();
        gridEngine.decreaseNumColumns();
        gridView.renderGrid();
    };

    function refreshGrid() {
        gridView.renderBox(dashgrid.boxes);
        gridView.renderGrid();
    };

    return Object.freeze({
        createGrid: createGrid,
        addBoxes: addBoxes,
        updateBox: updateBox,
        updateStart: updateStart,
        update: update,
        updateEnd: updateEnd,
        refreshGrid: refreshGrid
    });
}
