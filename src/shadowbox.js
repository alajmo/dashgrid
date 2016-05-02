export default ShadowBox;

/**
 * Creates the shadow box element which is used when dragging / resizing
 *     a box. It gets attached to the dragging / resizing box, while
 *     box gets to move / resize freely and snaps back to its original
 *     or new position at drag / resize stop. Append it to the grid.
 */
function ShadowBox() {
    let shadowBox = {};

    // State.
    shadowBox.element = document.createElement('div');
    dashgrid._shadowBoxElement = document.createElement('div');

    // HTML.

    // CSS.
    dashgrid._shadowBoxElement.className = 'dashgrid-shadow-box';
    dashgrid._shadowBoxElement.style.position = 'absolute';
    dashgrid._shadowBoxElement.style.display = '';
    dashgrid._shadowBoxElement.style.zIndex = 1002;

    // Methods.

    return shadowBox;
}
