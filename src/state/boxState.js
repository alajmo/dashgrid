export {BoxState};

/**
 * Template function for box objects.
 *  @returns {Object} Box object.
 */
function BoxState({boxOptions}) {
    let state = {
        row: boxOptions,
        column: boxOptions.column,
        rowspan: boxOptions.rowspan,
        columnspan: boxOptions.columnspan,
        draggable: boxOptions.draggable,
        resizable: boxOptions.resizable,
        pushable: boxOptions.pushable,
        floating: boxOptions.floating,
        stacking: boxOptions.stacking,
        swapping: boxOptions.swapping,
        transition: boxOptions.transition
    };

    return Object.seal(state);
}
