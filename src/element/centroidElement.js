export {CentroidElement};

function CentroidElement() {

    function createCentroidElement(gridState, renderState) {
        let centroidElement = document.createElement('div');
        centroidElement.className = 'dashgrid-centroids';
        let element;
        for (let i = 0; i < gridState.numRows; i += 1) {
            for (let j = 0; j < gridState.numColumns; j += 1) {
                element = document.createElement('div');
                element.className = 'dashgrid-grid-centroid';
                element.style.position = 'absolute';
                element.style.top = (i * (renderState.rowHeight  + gridState.yMargin) +
                    renderState.rowHeight / 2 + gridState.yMargin) + 'px';
                element.style.left = (j * (renderState.columnWidth  + gridState.xMargin) +
                            renderState.columnWidth / 2 + gridState.xMargin) + 'px';
                centroidElement.appendChild(element);
            }
        }

        return centroidElement;
    }

    return Object.freeze({
        createCentroidElement
    });
}
