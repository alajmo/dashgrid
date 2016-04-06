import {isNumber, arraysEqual} from './sim-click.js';

export default function initGrid(dashGridGlobal, test) {
    // Mockup.
    let boxes = [
        {'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3, 'floating': false, 'swapping': false, 'pushable': true, 'resizable': true, 'draggable': true}
    ];

    test('Initialize Grid using default values', function (t) {
        let grid = dashGridGlobal('#grid', {});

        t.plan(46);

        // Check that grid object gets all properties.
        t.notEqual(grid, undefined, 'Returns object');
        t.notEqual(grid.grid, undefined, 'Has grid options');
        t.notEqual(grid.updateBox, undefined, 'Has API updateBox');
        t.notEqual(grid.insertBox, undefined, 'Has API insertBox');
        t.notEqual(grid.removeBox, undefined, 'Has API removeBox');

        t.equal(grid.grid.element.nodeName, 'DIV', 'Grid Element initialized');
        t.equal(Array.isArray(grid.grid.boxes), true, 'Boxes is array');

        t.equal(isNumber(grid.grid.rowHeight), true, 'RowHeight initialized');
        t.equal(isNumber(grid.grid.numRows), true, 'numRows initialized');
        t.equal(isNumber(grid.grid.minRows), true, 'minRows initialized');
        t.equal(isNumber(grid.grid.maxRows), true, 'maxRows initialized');

        t.equal(isNumber(grid.grid.columnWidth), true, 'columnWidth initialized');
        t.equal(isNumber(grid.grid.numColumns), true, 'numColumns initialized');
        t.equal(isNumber(grid.grid.minColumns), true, 'minColumns initialized');
        t.equal(isNumber(grid.grid.maxColumns), true, 'maxColumns initialized');

        t.equal(isNumber(grid.grid.minRowspan), true, 'minRowspan initialized');
        t.equal(isNumber(grid.grid.maxRowspan), true, 'maxRowspan initialized');
        t.equal(isNumber(grid.grid.minColumnspan), true, 'minColumnspan initialized');
        t.equal(isNumber(grid.grid.maxColumnspan), true, 'maxColumnspan initialized');

        t.equal(isNumber(grid.grid.xMargin), true, 'xMargin initialized');
        t.equal(isNumber(grid.grid.yMargin), true, 'yMargin initialized');

        t.equal(typeof grid.grid.pushable, 'boolean', 'pushable initialized');
        t.equal(typeof grid.grid.floating, 'boolean', 'floating initialized');
        t.equal(typeof grid.grid.stacking, 'boolean', 'stacking initialized');
        t.equal(typeof grid.grid.swapping, 'boolean', 'swapping initialized');

        t.equal(typeof grid.grid.animate, 'boolean', 'animate initialized');
        t.equal(typeof grid.grid.liveChanges, 'boolean', 'liveChanges initialized');
        t.equal(isNumber(grid.grid.mobileBreakPoint), true, 'mobileBreakPoint initialized');
        t.equal(typeof grid.grid.mobileBreakPointEnabled, 'boolean', 'mobileBreakPointEnabled initialized');

        t.equal(isNumber(grid.grid.scrollSensitivity), true, 'scrollSensitivity initialized');
        t.equal(isNumber(grid.grid.scrollSpeed), true, 'scrollSpeed initialized');

        t.equal(isNumber(grid.grid.snapbacktime), true, 'snapbacktime initialized');
        t.equal(typeof grid.grid.displayGrid, 'boolean', 'displayGrid initialized');

        t.equal(typeof grid.grid.draggable, 'object', 'draggable initialized');
        t.equal(typeof grid.grid.draggable.enabled, 'boolean', 'draggable.enabled initialized');
        t.equal(grid.grid.draggable.handles, undefined, 'draggable.handles initialized');
        t.equal(grid.grid.draggable.dragStart, undefined, 'dragStart initialized');
        t.equal(grid.grid.draggable.dragging, undefined, 'dragging initialized');
        t.equal(grid.grid.draggable.dragEnd, undefined, 'dragEnd initialized');

        t.equal(typeof grid.grid.resizable, 'object', 'resizable initialized');
        t.equal(typeof grid.grid.resizable.enabled, 'boolean', 'enabled initialized');
        t.equal(Array.isArray(grid.grid.resizable.handles), true, 'resizable handles initialized');
        t.equal(isNumber(grid.grid.resizable.handleWidth), true, 'handleWidth initialized');
        t.equal(grid.grid.resizable.resizeStart, undefined, 'resizeStart initialized');
        t.equal(grid.grid.resizable.resizing, undefined, 'resizing initialized');
        t.equal(grid.grid.resizable.resizeEnd, undefined, 'resize initialized');

        t.end();
    });

    test('Initialize Grid using manually entered values', function (t) {
        let gs = {
            boxes: [],
            rowHeight: 80,
            numRows: 10,
            minRows: 10,
            maxRows: 10,
            columnWidth: 120,
            numColumns: 6,
            minColumns: 6,
            maxColumns: 10,
            xMargin: 20,
            yMargin: 10,
            draggable: {
                enabled: true,
                handles: undefined,
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
            minRowspan: 1,
            maxRowspan: 10,
            minColumnspan: 1,
            maxColumnspan: 10,
            pushable: true,
            floating: false,
            stacking: false,
            swapping: false,
            animate: true,
            liveChanges: true,
            mobileBreakPoint: 600,
            mobileBreakPointEnabled: false,
            scrollSensitivity: 20,
            scrollSpeed: 10,
            snapbacktime: 400,
            displayGrid: true
        };
        let grid = dashGridGlobal('#grid', gs);

        t.plan(46);

        // Check that grid object gets all properties.
        t.notEqual(grid, undefined, 'Returns object');
        t.notEqual(grid.grid, undefined, 'Has grid options');
        t.notEqual(grid.updateBox, undefined, 'Has API updateBox');
        t.notEqual(grid.insertBox, undefined, 'Has API insertBox');
        t.notEqual(grid.removeBox, undefined, 'Has API removeBox');

        t.equal(grid.grid.element.nodeName, 'DIV', 'Grid Element initialized');
        t.equal(Array.isArray(grid.grid.boxes), true, 'Boxes is array');

        t.equal(grid.grid.rowHeight, gs.rowHeight, 'RowHeight initialized');
        t.equal(grid.grid.numRows, gs.numRows, 'numRows initialized');
        t.equal(grid.grid.minRows, gs.minRows, 'minRows initialized');
        t.equal(grid.grid.maxRows, gs.maxRows, 'maxRows initialized');

        t.equal(grid.grid.columnWidth, gs.columnWidth, 'columnWidth initialized');
        t.equal(grid.grid.numColumns, gs.numColumns, 'numColumns initialized');
        t.equal(grid.grid.minColumns, gs.minColumns, 'minColumns initialized');
        t.equal(grid.grid.maxColumns, gs.maxColumns, 'maxColumns initialized');

        t.equal(grid.grid.minRowspan, gs.minRowspan, 'minRowspan initialized');
        t.equal(grid.grid.maxRowspan, gs.maxRowspan, 'maxRowspan initialized');
        t.equal(grid.grid.minColumnspan, gs.minColumnspan, 'minColumnspan initialized');
        t.equal(grid.grid.maxColumnspan, gs.maxColumnspan, 'maxColumnspan initialized');

        t.equal(grid.grid.xMargin, gs.xMargin, 'xMargin initialized');
        t.equal(grid.grid.yMargin, gs.yMargin, 'yMargin initialized');

        t.equal(grid.grid.pushable, gs.pushable, 'pushable initialized');
        t.equal(grid.grid.floating, gs.floating, 'floating initialized');
        t.equal(grid.grid.stacking, gs.stacking, 'stacking initialized');
        t.equal(grid.grid.swapping, gs.swapping, 'swapping initialized');

        t.equal(grid.grid.animate, gs.animate, 'animate initialized');
        t.equal(grid.grid.liveChanges, gs.liveChanges, 'liveChanges initialized');

        t.equal(grid.grid.mobileBreakPoint, gs.mobileBreakPoint, 'mobileBreakPoint initialized');
        t.equal(grid.grid.mobileBreakPointEnabled, gs.mobileBreakPointEnabled, 'mobileBreakPointEnabled initialized');

        t.equal(grid.grid.scrollSensitivity, gs.scrollSensitivity, 'scrollSensitivity initialized');
        t.equal(grid.grid.scrollSpeed, gs.scrollSpeed, 'scrollSpeed initialized');

        t.equal(grid.grid.snapbacktime, gs.snapbacktime, 'snapbacktime initialized');
        t.equal(grid.grid.displayGrid, gs.displayGrid, 'displayGrid initialized');

        t.equal(typeof grid.grid.draggable, 'object', 'draggable initialized');
        t.equal(grid.grid.draggable.enabled, true, 'draggable.enabled initialized');
        t.equal(grid.grid.draggable.handles, gs.draggable.handles, 'draggable.handles initialized');
        t.equal(typeof grid.grid.draggable.dragStart, 'function', 'dragStart initialized');
        t.equal(typeof grid.grid.draggable.dragging, 'function', 'dragging initialized');
        t.equal(typeof grid.grid.draggable.dragEnd, 'function', 'dragEnd initialized');

        t.equal(typeof grid.grid.resizable, 'object', 'resizable initialized');
        t.equal(grid.grid.resizable.enabled, gs.resizable.enabled, 'resizable enabled initialized');
        t.equal(arraysEqual(grid.grid.resizable.handles, ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']), true, 'resizable handles initialized');
        t.equal(grid.grid.resizable.handleWidth, gs.resizable.handleWidth, 'handleWidth initialized');
        t.equal(typeof grid.grid.resizable.resizeStart, 'function', 'resizeStart initialized');
        t.equal(typeof grid.grid.resizable.resizing, 'function', 'resizing initialized');
        t.equal(typeof grid.grid.resizable.resizeEnd, 'function', 'resize initialized');

        t.end();
    });

}
