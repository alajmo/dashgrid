### Dashgrid

A highly customizable drag-and-drop grid built on pure javascript with no
dependencies. Inspired by gridster and angular-gridster.

* Feature rich.
* No external dependencies.
* High performance.
* Framework agnostic.

Currently alpha status, no set API.
Check out [demo](http://samiralajmovic.github.io/dashgrid) in the meantime!

### Motivation

As far as I know there isn't a grid system that is dependency free, maintained actively,
has the necessary performance. Small performance boosts like using requestAnimationFrame,
using batch inserts etc. The focus of this grid system is heavily on performance.
I saw another good implementation, packery, but it was already too late, and even they,
had jquery as requisite. And gridlist.

### Installing

# npm
```shell
npm install dashgrid
```

### How to use it

```javascript
// Wrapped in DOMContentLoaded to make sure DOM is loaded before gridGlobalFunc
// attempts to find the corresponding div.
document.addEventListener("DOMContentLoaded", function() {
    // Boxes to start with.
    var boxes = [
        {'row': 1, 'column': 1, 'rowspan': 1, 'columnspan': 1}
    ];

    // The grid object.
    var grid = {
        boxes: boxes,
        floating: true
    };

    // Css Selector.
    var cssSelector = "#grid";

    // Inserts the grid to the DOM and decorates the object grid with its API.
    gridGlobalFunc(cssSelector, grid);
});
```

```html
    <div id="grid">
        <di class="box"></div>
    </div>
```

#### Grid size

The grid assumes two ways to set the width and height.

##### Width

If columnWidth is set (in pixels), the grid width becomes columnWidth times
numColumns.

If columnWidth is not set, the grid width becomes the parent elements width,
and the columnWidth is parent element width divided by numColumns.

If numColumns is not set, numColumns attains the default value of 6.

##### Height

If rowHeight is set (in pixels), the grid height becomes rowHeight times
numRows.

If rowHeight is not set, the grid height becomes the parent elements height,
and the rowHeight is parent element height divided by numRows.

If numRows is not set, numRows attains the default value of 6.

### Simple API

Once you've initiated the grid.

### Checkout fastdom

Use fixed size arrays for performance.
