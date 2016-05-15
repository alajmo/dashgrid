export {boxStateModel};

/**
 * Template function for box objects.
 *  @returns {Object} Box object.
 */
function boxStateModel(state) {
    let box = {
        row: state.box.row,
        column: state.box.column,
        rowspan: state.box.rowspan || 1,
        columnspan: state.box.columnspan || 1,
        draggable: (state.box.draggable === false) ? false : true,
        resizable: (state.box.resizable === false) ? false : true,
        pushable: (state.box.pushable === false) ? false : true,
        floating: (state.box.floating === true) ? true : false,
        stacking: (state.box.stacking === true) ? true : false,
        swapping: (state.box.swapping === true) ? true : false,
        inherit: (state.box.inherit === true) ? true : false,
    };

    return box;
}
