export {GridEngineState};

function GridEngineState() {
    let gridEngineState = {
        movingBox: undefined,
        movedBoxes: []
    };

    return Object.seal(gridEngineState);
}
