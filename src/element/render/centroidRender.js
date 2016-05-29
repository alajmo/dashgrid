export {CentroidRender};

function CentroidRender(gridState, gridElement) {

    /**
     */
    let renderCentroid = function () {
        removeNodes(gridElement.centroidContainer.element);
        let columnWidth = renderer(gridState).getColumnWidth();
        let rowHeight = renderer(gridState).getRowHeight();

        let htmlString = '';
        // Draw centroids
        for (let i = 0; i < gridState.numRows; i += 1) {
            for (let j = 0; j < gridState.numColumns; j += 1) {
                htmlString += `<div class='dashgrid-grid-centroid'
                    style='top: ${(i * (rowHeight  + gridState.yMargin) +
                            rowHeight / 2 + gridState.yMargin )}px;
                        left: ${(j * (columnWidth  + gridState.xMargin) +
                            columnWidth / 2 + gridState.xMargin)}px;
                            position: absolute;'>
                    </div>`;
            }
        }

        gridCentroidsElement.innerHTML = htmlString;
    };

    return Object.freeze({
        renderCentroid
    });
}
