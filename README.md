# Dashgrid

A highly customizable drag-and-drop grid built on pure es6 with no
external dependencies. Inspired by gridster and angular-gridster and other excellent grid
systems.

Don't use in production just yet! Check out [demo](http://samiralajmovic.github.io/dashgrid) in the meantime!

## Motivation

As far as I know there isn't a grid system that is dependency free, maintained actively,
and customizable to the core.

# Installation

Either via npm:
```shell
npm install dashgrid
```

or download the dist/dashgrid.js (dashgrid.min.js).

## Quick Start

Include the dashgrid.js file either via html, commonjs or es6 syntax.

```javascript
// Wrapped in DOMContentLoaded to make sure DOM is loaded before Grid.
document.addEventListener('DOMContentLoaded', function() {
    var boxes = [
        {'row': 1, 'column': 1, 'rowspan': 1, 'columnspan': 1}
    ];

    var options = {
        boxes: boxes,
        floating: true
    };

    var element = document.getElementById('grid');
    var grid = Grid(element, options);

});
```

# API

## Methods

* updateBox
* insertBox
* removeBox
* refreshGrid

## Events

* dragStart
* dragging
* dragEnd
* resizeStart
* resizing
* resizeEnd

## Properties

*

## Default Configuration

```javascript
var gridOptions = {
    rowHeight: 'auto',
    numRows: 6,
    minRows: 6,
    maxRows: 10,
    columnWidth: 'auto',
    numColumns: 6,
    minColumns: 6,
    maxColumns: 10,
    xMargin: 20,
    yMargin: 20,
    defaultBoxRowspan: 2,
    defaultBoxColumnspan: 1,
    minRowspan: 1,
    maxRowspan: 9999,
    minColumnspan: 1,
    maxColumnspan: 9999,
    liveChanges: true,
    draggable: {
            enabled: true,
            handles: 'auto',

            dragStart: function () {},
            dragging: function () {},
            dragEnd: function () {}
    },
    resizable: {
        enabled: true,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        handleWidth: 10,

        resizeStart: function () {},
        resizing: function () {},
        resizeEnd: function () {}
    },
    scrollSensitivity: 20,
    scrollSpeed: 10,
    snapbacktime: 300,
    displayGrid: true
};
```

# Miscellaneous

## Misc

## Grid Width and Height

If rowHeight / columnWidth is set to 'auto', then the grid
height / width is set to that of the parent element.
rowHeight then becomes gridHeight / numRows + yMargins and
columnWidth gridWidth / numColumns + xMargins.

If rowHeight / columnWidth is set to a number, then the grid
height is set to:

    gridHeight = numRows * rowHeight

and the grid width is set to:

    gridWidth = numColumns * columnWidth

## CSS Classes

If you want another design on the box, drag handlers, resize handlers, the placeholder
box (the shadow box shown when dragging / resizing a box) you can edit these to your liking.

The DOM structure of dashgrid is:

```
    <div class="dashgrid">
        <!-- Boxes -->
        <div class="dashgrid-boxes">
            <div class="dashgrid-box">
                <div class="content-element"></div>
                <div class="dashgrid-box-resize-handle-n"></div>
                <div class="dashgrid-box-resize-handle-ne"></div>
            </div>
        </div>

        <!-- Shadow Box -->
        <div class="dashgrid-shadow-box"></div>

        <!-- Grid Lines -->
        <div class="dashgrid-grid-lines"></div>

        <!-- Grid Centroids -->
        <div class="dashgrid-grid-centroids"></div>
    </div>
```

The way z-index works in this case is:
    * dashgrid: 1000,
    * dashgrid-box: 1003
    * moving dashgrid-box: 1004
    * dashgrid-shadow-box: 1002
    * dashgrid-box-resize-handle: 1003
    * dashgrid-grid-lines: 1001
    * dashgrid-grid-centroids: 1001

# Inspiration

* gridlist
* Packery
* angular gridster
* gridster
