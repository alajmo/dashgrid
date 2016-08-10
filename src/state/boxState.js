export {BoxState};

/**
 * Template function for box objects.
 *  @returns {Object} Box object.
 */
function BoxState({boxOption}) {
    let state = {
        row: boxOption.row,
        column: boxOption.column,
        rowspan: boxOption.rowspan,
        columnspan: boxOption.columnspan,
        draggable: boxOption.draggable,
        resizable: boxOption.resizable,
        pushable: boxOption.pushable,
        floating: boxOption.floating,
        stacking: boxOption.stacking,
        swapping: boxOption.swapping,
        transition: boxOption.transition
    };

    return Object.seal(state);
}
