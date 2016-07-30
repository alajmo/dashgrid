import {render} from '../node/utils.js';

import {BoxState} from '../state/boxState.js';
import {BoxElement} from '../element/boxElement.js';
import {resizeHandle} from '../element/resizeHandleElement.js';

export {Box};

/*
    {
        state: {},
        element: {},
        boxEvents: new WeakMap()
    }

    In another file (boxMethods.js), methods which change the Box Component
    are located.
*/

// High Order Component.
function Box({boxOptions, gridState}) {
    let box = {
        state: {
            boxState: BoxState({boxOptions})
        },
        element: {
            boxElement: BoxElement()
        },
        events: {
            boxEvents: new WeakMap()
        }
    };

    return Object.seal(box);
}
