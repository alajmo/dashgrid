export {BoxState};

/**
 * Template function for box objects.
 *  @returns {Object} Box object.
 */
function BoxState({boxOptions}) {

    let box = {
        row: row(boxOptions),
        column: column(boxOptions),
        rowspan: rowspan(boxOptions),
        columnspan: columnspan(boxOptions),
        draggable: draggable(boxOptions),
        resizable: resizable(boxOptions),
        pushable: pushable(boxOptions),
        floating: floating(boxOptions),
        stacking: stacking(boxOptions),
        swapping: swapping(boxOptions),
        transition: transition(boxOptions)
    };

    // Property Functions.
    function row(boxOptions) {
        return boxOptions.row;
    };

    function column(boxOptions) {
        return boxOptions.column;
    }

    function rowspan(boxOptions) {
        return boxOptions.rowspan || 1;
    }

    function columnspan(boxOptions) {
        return boxOptions.columnspan || 1;
    }

    function draggable(boxOptions) {
        return (boxOptions.draggable === false) ? false : true;
    }

    function resizable(boxOptions) {
        return (boxOptions.resizable === false) ? false : true;
    }

    function pushable(boxOptions) {
        return (boxOptions.pushable === false) ? false : true;
    }

    function floating(boxOptions) {
        return (boxOptions.floating === true) ? true : false;
    }

    function stacking(boxOptions) {
        return (boxOptions.stacking === true) ? true : false;
    }

    function swapping(boxOptions) {
        return (boxOptions.swapping === true) ? true : false;
    }

    function transition(boxOptions) {
        return boxOptions.transition;
    }

    return Object.seal(box);
}
