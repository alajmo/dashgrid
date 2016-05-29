export {GridEngineState};

function GridEngineState() {
    let gridEngineState = {
        boxes: [],
        movingBox: undefined,
        movedBoxes: []
    };

    return Object.seal(gridEngineState);
}
