export {ShadowBoxElement};

function ShadowBoxElement() {
    let element = document.createElement('div');

    element.className = 'dashgrid-shadow-box';
    element.style.position = 'absolute';
    element.style.display = '';
    element.style.zIndex = 1002;

    // Initialize.
    return element;
}
