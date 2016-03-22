# Dashgrid

A highly customizable drag-and-drop grid built on pure es6 with no
external dependencies. Inspired by gridster and angular-gridster and other excellent grid
systems.

Currently beta status, no set API. Feel free to use it in development!
Check out [demo](http://samiralajmovic.github.io/dashgrid) in the meantime!

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

# Inspiration

* gridlist
* Packery
* angular gridster
* gridster
