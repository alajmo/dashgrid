### Grid

A highly customizable drag-and-drop built on pure javascript with no
dependencies. DEMO. Inspired by gridster and angular-gridster.

* Feature rich.
* No dependencies.
* High performance.
* Works with all frameworks.

# NOT SAFE FOR PRODUCTION

### Install with Bower

### Install with Npm

### How to use it

#### JS way

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

    // Inserts the grid to the DOM and populates the object grid with its API.
    gridGlobalFunc(cssSelector, grid);
});
```

### Documentation

There are two ways to set grid width:

1. Inherit - inherits width from the parent element. 
2. Custom - enter width in pixel or % (of parent element).

### API

### Building

Uses webpack as package-manager and setting up unit-tests.

1. Clone https://github.com/samiralajmovic/dash-grid.git
2. npm install
3. npm run dev
4. ?
5. Profit.
