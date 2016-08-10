export {BoxElement};

/**
 *
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function BoxElement(contentElement) {
    const element = document.createElement('div');

    // Properties.
    element.className = 'dashgrid-box';
    element.style.position = 'absolute';
    element.style.cursor = 'move';
    // TODOD change transition to grid setting.
    element.style.transition = 'opacity .3s, left .3s, top .3s, width .3s, height .3s';
    element.style.zIndex = 1003;
    element.appendChild(contentElement);

    return element;
}
