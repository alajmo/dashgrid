export {RenderState};

/**
 *
 */
function RenderState () {

    let renderState = {
        // Start row / column denotes the pixel at which each cell starts at.
        startColumn: [],
        startRow: [],
        columnWidth: undefined,
        rowHeight: undefined
    };

    return Object.seal(renderState);
}
