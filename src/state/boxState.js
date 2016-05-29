export {BoxState};

/**
 * Template function for box objects.
 *  @returns {Object} Box object.
 */
function BoxState(options) {

    function createBoxState() {
        let box = {
            row: row(),
            column: column(),
            rowspan: rowspan(),
            columnspan: columnspan(),
            draggable: draggable(),
            resizable: resizable(),
            pushable: pushable(),
            floating: floating(),
            stacking: stacking(),
            swapping: swapping()
        };

        return box;
    }

    // Property Functions.
    function row() {
        return options.row;
    };

    function column() {
        return options.column;
    }

    function rowspan() {
        return options.rowspan || 1;
    }

    function columnspan() {
        return options.columnspan || 1;
    }

    function draggable() {
        return (options.draggable === false) ? false : true;
    }

    function resizable() {
        return (options.resizable === false) ? false : true;
    }

    function pushable() {
        return (options.pushable === false) ? false : true;
    }

    function floating() {
        return (options.floating === true) ? true : false;
    }

    function stacking() {
        return (options.stacking === true) ? true : false;
    }

    function swapping() {
        return (options.swapping === true) ? true : false;
    }

    return Object.freeze({
       createBoxState
    });
}
