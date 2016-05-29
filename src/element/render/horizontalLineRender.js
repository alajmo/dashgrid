export {HorizontalLineRender};

function HorizontalLineRender(gridDOM, gridState, renderState) {

    /**
     */
    let renderLines = function () {
        let htmlString = '';

        for (let i = 0; i <= gridState.numRows; i += 1) {
            htmlString += `<div class='dashgrid-horizontal-line'
                style='top: ${i * (renderState.rowHeight + gridState.yMargin)}px;
                    left: 0px;
                    width: 100%;
                    height: ${gridState.yMargin}px;
                    position: absolute;'>
                </div>`;
        }

        gridDOM.horizontalLineContainer.element.innerHTML = htmlString;
    };

    return Object.freeze({
        renderLines
    });
}
