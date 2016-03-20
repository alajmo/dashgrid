# Dashgrid

A highly customizable drag-and-drop grid built on pure javascript with no
dependencies. Inspired by gridster and angular-gridster and other excellent grid
systems.

* Feature rich.
* No external dependencies and framework agnostic.
* High performance.

Currently alpha status, no set API.
Check out [demo](http://samiralajmovic.github.io/dashgrid) in the meantime!

## Motivation

As far as I know there isn't a grid system that is dependency free, maintained actively,
and customizable to the core.

# Installation

Either via npm:
```shell
npm install dashgrid
```

or download the dist/dashgrid.js file.

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
    // Inserts the grid to the DOM and decorates the object grid with its API.
    var grid = Grid(element, options);

});
```

# API

# Parameters

## Grid size

The grid assumes two ways to set the width and height.

* Case 1:
    rowHeight = undefined
    numRows = number

    * grid element height set to parent element height
    * cellHeight set to parent height / numRows

* Case 2:
    rowHeight = number
    numRows = number

    * grid element height set to rowHeight times numRows
    * cellHeight set to rowHeight

* Case 3:
    rowHeight = number
    numRows = undefined

    * grid element height set to rowHeight times minNumRows
    * cellHeight set to rowHeight

* Case 4:
    rowHeight = undefined
    numRows = undefined

    * grid element height set to that of the parent element
    * cellHeight set to parent element height divided by minNumRows

rowHeight: gs.rowHeight,
numRows: (gs.numRows !== undefined) ? gs.numRows : 6,
minRows: (gs.minRows !== undefined) ? gs.minRows : 6,
maxRows: (gs.maxRows !== undefined) ? gs.maxRows : 10,

columnWidth: gs.columnWidth,
numColumns: (gs.numColumns !== undefined) ? gs.numColumns : 6,
minColumns: (gs.minColumns !== undefined) ? gs.minColumns : 6,
maxColumns: (gs.maxColumns !== undefined) ? gs.maxColumns : 10,

xMargin: (gs.xMargin !== undefined) ? gs.xMargin : 20,
yMargin: (gs.yMargin !== undefined) ? gs.yMargin : 20,

defaultBoxRowspan: 2,
defaultBoxColumnspan: 1,

minRowspan: (gs.minRowspan !== undefined) ? gs.minRowspan : 1,
maxRowspan: (gs.maxRowspan !== undefined) ? gs.maxRowspan : 9999,

minColumnspan: (gs.minColumnspan !== undefined) ? gs.minColumnspan : 1,
maxColumnspan: (gs.maxColumnspan !== undefined) ? gs.maxColumnspan : 9999,

pushable: (gs.pushable === false) ? false : true,
floating: (gs.floating === true) ? true : false,
stacking: (gs.stacking === true) ? true : false,
swapping: (gs.swapping === true) ? true : false,
animate: (gs.animate === true) ? true : false,

liveChanges: (gs.liveChanges === false) ? false : true,

mobileBreakPoint: 600,
mobileBreakPointEnabled: false,

draggable: {
        enabled: (gs.draggable && gs.draggable.enabled === false) ? false : true,
        handles: (gs.draggable && gs.draggable.handles) || undefined,

        // user cb's.
        dragStart: gs.draggable && gs.draggable.dragStart,
        dragging: gs.draggable && gs.draggable.dragging,
        dragEnd: gs.draggable && gs.draggable.dragEnd
},

resizable: {
    enabled: (gs.draggable && gs.resizable.enabled === false) ? false : true,
    handles: (gs.draggable && gs.resizable.handles) || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
    handleWidth: (gs.draggable &&  gs.draggable.handleWidth !== undefined) ? gs.draggable.handleWidth : 10,

    // user cb's.
    resizeStart: gs.draggable && gs.resizable.resizeStart,
    resizing: gs.draggable && gs.resizable.resizing,
    resizeEnd: gs.draggable && gs.resizable.resizeEnd
},

scrollSensitivity: 20,
scrollSpeed: 10,
snapbacktime: (gs.snapbacktime === undefined) ? 300 : gs.snapbacktime,
displayGrid: (gs.displayGrid === false) ? false : true

# Demos

### Other excellent solutions

* gridlist
* Packery
* angular gridster
* gridster
