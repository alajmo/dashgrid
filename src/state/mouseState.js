export {MouseState};

function MouseState() {
    let state = {
        eX: undefined,
        eY: undefined,
        eW: undefined,
        eH: undefined,
        mouseX: 0,
        mouseY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        mOffX: 0,
        mOffY: 0,
        previousPosition: Object.seal({row: undefined, column: undefined}),
        currentPosition: Object.seal({row: undefined, column: undefined})
    };

    return Object.seal(state);
}
