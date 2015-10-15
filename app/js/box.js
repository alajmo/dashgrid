export function boxSpec(spec) {
    let member = {
        element: spec.element,
        id: spec.id,
        oldRow: spec.row,
        oldColumn: spec.column,
        row: spec.row,
        column: spec.column,
        rowspan: spec.rowspan || 1,
        columnspan: spec.columnspan || 1,
        pushable: (spec.pushable === false) ? false : true,
        floating: (spec.floating === true) ? true : false,
        stacking: (spec.stacking === true) ? true : false,
        swapping: (spec.swapping === true) ? true : false,
        inherit: spec.inherit
    };

    return Object.seal({member});
}
