export {VerticalLineElement};

function VerticalLineElement() {
    let verticalLineElement = document.createElement('div');
    verticalLineElement.className = 'dashgrid-grid-lines;'

    return Object.seal(verticalLineElement);
}
