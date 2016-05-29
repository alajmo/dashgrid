import {BoxState} from '../state/boxState.js';
import {BoxElement} from '../element/boxElement.js';

export {Box};

function Box() {

    function createBox(gridOptions) {
        let box = {};
        box.boxState = BoxState(gridOptions).createBoxState();
        box.boxElement = BoxElement(gridOptions).createBoxElement();

        return box;
    }

    function updateBox(box) {

    }

    return Object.freeze({
        createBox,
        updateBox
    })

}
