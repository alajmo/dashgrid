export {VerticalLineElement};

function VerticalLineElement() {

    function createVerticalLineElement(gridState, renderState) {
        let verticalLineElement = document.createElement('div');
        verticalLineElement.className = 'dashgrid-grid-lines;'
        let element;
        for (let i = 0; i <= gridState.numColumns; i += 1) {
            element = document.createElement('div');
            element.className = 'dashgrid-vertical-line';
            element.style.position = 'absolute';
            element.style.top = '0px';
            element.style.left = i * (renderState.columnWidth + gridState.xMargin) + 'px';
            element.style.width = gridState.xMargin + 'px';
            element.style.height = '100%';
            verticalLineElement.appendChild(element);
        }

        return verticalLineElement;
    }

    return Object.freeze({
        createVerticalLineElement
    });
}
