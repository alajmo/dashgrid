export {HorizontalLineElement};

function HorizontalLineElement() {

    function createHorizontalLineElement(gridState, renderState) {
        let horizontalLineElement = document.createElement('div');
        horizontalLineElement.className = 'dashgrid-grid-lines;'
        let element;
        for (let i = 0; i <= gridState.numColumns; i += 1) {
            element = document.createElement('div');
            element.className = 'dashgrid-horizontal-line';
            element.style.position = 'absolute';
            element.style.top = i * (renderState.rowHeight + gridState.yMargin) + 'px';
            element.style.left = '0';
            element.style.width = '100%';
            element.style.height = gridState.yMargin + 'px';
            horizontalLineElement.appendChild(element);
        }

        return horizontalLineElement;
    }

    return Object.freeze({
        createHorizontalLineElement
    });
}
