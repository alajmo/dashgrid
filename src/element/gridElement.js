// Contains core grid elements.

export {gridElement, boxesElement};

/**
 * Modifies element.
 * @param {Object} element The DOM element to which to attach the grid element content.
 * @param {Object} gridState The grid state.
 * @returns {Object} The dom element.
 */
function gridElement(element) {
    // Properties.
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.display = 'block';
    element.style.zIndex = '1000';

    return element;
};

function boxesElement() {
    const element = document.createElement('div');
    element.className = 'dg-boxes';
    element.style.position = 'absolute';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.block = 'block';
    element.style.zIndex = '1001';

    return element;
}
