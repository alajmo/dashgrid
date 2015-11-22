### Grid

A highly customizable drag-and-drop grid built on pure javascript with no
dependencies. Inspired by gridster and angular-gridster. Currently alpha status,
no set API.

* Feature rich.
* No dependencies.
* High performance.
* Works with all frameworks.

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