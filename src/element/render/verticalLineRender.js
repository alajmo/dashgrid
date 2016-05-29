export {VerticalLineRender};

function VerticalLineRender(gridDOM, gridState, renderState) {

    /**
     */
    let renderLines = function () {
        let htmlString = '';

        for (let i = 0; i <= gridState.numColumns; i += 1) {
            htmlString += `<div class='dashgrid-vertical-line'
                style='top: 0px;
                    left: ${i * (renderState.columnWidth + gridState.xMargin)}px;
                    height: 100%;
                    width: ${gridState.xMargin}px;
                    position: absolute;'>
                </div>`;
        }

        gridDOM.verticalLineContainer.element.innerHTML = htmlString;
    };

    return Object.freeze({
        renderLines
    });
}
