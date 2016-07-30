export {BoxElement};

/**
 *
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function BoxElement({box}) {
    let element = document.createElement('div');

    // Properties.
    element.className = 'dashgrid-box';
    element.style.position = 'absolute';
    element.style.cursor = 'move';
    element.style.transition = box.transition;
    element.style.zIndex = 1003;

    return {element};
}
