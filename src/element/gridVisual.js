// Contains grid decoration elements, lines / centroids / shadowBox.

export {
  ShadowBoxElement,
  VerticalLineElement,
  VerticalLines,
  HorizontalLineElement,
  HorizontalLines,
  CentroidElement,
  Centroids
};

/**
 * [ShadowBoxElement description]
 */
function ShadowBoxElement() {
    let element = document.createElement('div');

    element.className = 'dashgrid-shadow-box';
    element.style.position = 'absolute';
    element.style.display = '';
    element.style.zIndex = 1002;

    return element;
}

/**
 * [VerticalLineElement description]
 * @param {[type]} grid [description]
 */
function VerticalLineElement(grid) {
  const element = document.createElement('div');
  element.className = 'dashgrid-grid-lines;'
  return element;
}

/**
 * [VerticalLines description]
 * @param {[type]} grid [description]
 */
function VerticalLines(grid) {
  let fragment = document.createDocumentFragment();
  let element = document.createElement('div');
  for (let i = 0; i <= grid.state.grid.numColumns; i += 1) {
      element = document.createElement('div');
      element.className = 'dashgrid-vertical-line';
      element.style.position = 'absolute';
      element.style.top = '0px';
      element.style.left = i * (grid.state.render.columnWidth + grid.state.grid.xMargin) + 'px';
      element.style.width = grid.state.grid.xMargin + 'px';
      element.style.height = '100%';
      fragment.appendChild(element);
  }

  return fragment;
}

/**
 * [HorizontalLineElement description]
 * @param {[type]} grid [description]
 */
function HorizontalLineElement(grid) {
    const horizontalElement = document.createElement('div');
    horizontalElement.className = 'dashgrid-grid-lines;'

    return horizontalElement;
}

/**
 * [HorizontalLines description]
 * @param {[type]} grid [description]
 */
function HorizontalLines(grid) {
    let fragment = document.createDocumentFragment();
    let element = document.createElement('div');
    for (let i = 0; i <= grid.state.grid.numColumns; i += 1) {
        element = document.createElement('div');
        element.className = 'dashgrid-horizontal-line';
        element.style.position = 'absolute';
        element.style.top = i * (grid.state.render.rowHeight + grid.state.grid.yMargin) + 'px';
        element.style.left = '0';
        element.style.width = '100%';
        element.style.height = grid.state.grid.yMargin + 'px';
        fragment.appendChild(element);
    }

  return fragment;
}

/**
 * [CentroidElement description]
 * @param {[type]} grid [description]
 */
function CentroidElement(grid) {
    const centroidElement = document.createElement('div');
    centroidElement.className = 'dashgrid-centroids';

    return centroidElement;
}

/**
 * [Centroids description]
 * @param {[type]} grid [description]
 */
function Centroids(grid) {
    let fragment = document.createDocumentFragment();
    let element = document.createElement('div');
    for (let i = 0; i < grid.state.grid.numRows; i += 1) {
        for (let j = 0; j < grid.state.grid.numColumns; j += 1) {
            element = document.createElement('div');
            element.className = 'dashgrid-grid-centroid';
            element.style.position = 'absolute';
            element.style.top = (i * (grid.state.render.rowHeight  + grid.state.grid.yMargin) +
                grid.state.render.rowHeight / 2 + grid.state.grid.yMargin) + 'px';
            element.style.left = (j * (grid.state.render.columnWidth  + grid.state.grid.xMargin) +
                        grid.state.render.columnWidth / 2 + grid.state.grid.xMargin) + 'px';
            fragment.appendChild(element);
        }
    }

    return fragment;
}
