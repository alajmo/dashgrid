import * as Event from '../lib/events.js';
import {BoxState} from '../state/boxState.js';
import {BoxElement} from '../element/boxElement.js';
import {resizeHandle} from '../element/resizeHandleElement.js';

export {Box};

function Box({boxOption, gridState}) {
    const box = {
        component: {},
        state: {
            box: BoxState({boxOption})
        },
        element: {
            box: BoxElement(boxOption.content)
        },
        events: {
            boxEvents: new WeakMap()
        }
    };

    Event.click.set(box.element.box, box);

    return Object.seal(box);
}
