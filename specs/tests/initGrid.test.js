import {isNumber, arraysEqual} from '../util.js';

export default function initGrid(dashGridGlobal, test) {
    // Mockup.
    let boxes = [
        {'row': 0, 'column': 0, 'rowspan': 3, 'columnspan': 3, 'floating': false, 'swapping': false, 'pushable': true, 'resizable': true, 'draggable': true}
    ];

    test('Initialize Grid using default values', function (t) {
        let dashgrid = dashGridGlobal(document.getElementById('grid'), {});

        // Check that grid object gets all properties.
        t.notEqual(dashgrid.dashgrid, undefined, 'Returns object');
        t.notEqual(dashgrid.dashgrid, undefined, 'Has grid options');
        t.notEqual(dashgrid.updateBox, undefined, 'Has API updateBox');
        t.notEqual(dashgrid.insertBox, undefined, 'Has API insertBox');
        t.notEqual(dashgrid.removeBox, undefined, 'Has API removeBox');

        t.equal(dashgrid.dashgrid._element.nodeName, 'DIV', 'Grid Element initialized');
        t.equal(Array.isArray(dashgrid.dashgrid.boxes), true, 'Boxes is array');

        t.equal(isNumber(dashgrid.dashgrid.numRows), true, 'numRows initialized');
        t.equal(isNumber(dashgrid.dashgrid.minRows), true, 'minRows initialized');
        t.equal(isNumber(dashgrid.dashgrid.maxRows), true, 'maxRows initialized');

        t.equal(isNumber(dashgrid.dashgrid.numColumns), true, 'numColumns initialized');
        t.equal(isNumber(dashgrid.dashgrid.minColumns), true, 'minColumns initialized');
        t.equal(isNumber(dashgrid.dashgrid.maxColumns), true, 'maxColumns initialized');

        t.equal(isNumber(dashgrid.dashgrid.minRowspan), true, 'minRowspan initialized');
        t.equal(isNumber(dashgrid.dashgrid.maxRowspan), true, 'maxRowspan initialized');
        t.equal(isNumber(dashgrid.dashgrid.minColumnspan), true, 'minColumnspan initialized');
        t.equal(isNumber(dashgrid.dashgrid.maxColumnspan), true, 'maxColumnspan initialized');

        t.equal(isNumber(dashgrid.dashgrid.xMargin), true, 'xMargin initialized');
        t.equal(isNumber(dashgrid.dashgrid.yMargin), true, 'yMargin initialized');

        // t.equal(typeof grid.pushable, 'boolean', 'pushable initialized');
        // t.equal(typeof grid.floating, 'boolean', 'floating initialized');
        // t.equal(typeof grid.stacking, 'boolean', 'stacking initialized');
        // t.equal(typeof grid.swapping, 'boolean', 'swapping initialized');

        t.equal(typeof dashgrid.dashgrid.animate, 'boolean', 'animate initialized');
        t.equal(typeof dashgrid.dashgrid.liveChanges, 'boolean', 'liveChanges initialized');
        // t.equal(isNumber(dashgrid.dashgrid.mobileBreakPoint), true, 'mobileBreakPoint initialized');
        // t.equal(typeof grid.mobileBreakPointEnabled, 'boolean', 'mobileBreakPointEnabled initialized');

        t.equal(isNumber(dashgrid.dashgrid.scrollSensitivity), true, 'scrollSensitivity initialized');
        t.equal(isNumber(dashgrid.dashgrid.scrollSpeed), true, 'scrollSpeed initialized');

        t.equal(isNumber(dashgrid.dashgrid.snapBackTime), true, 'snapBackTime initialized');
        t.equal(typeof dashgrid.dashgrid.showGridLines, 'boolean', 'showGridLines initialized');
        t.equal(typeof dashgrid.dashgrid.showGridCentroids, 'boolean', 'showGridCentroids initialized');

        t.equal(typeof dashgrid.dashgrid.draggable, 'object', 'draggable initialized');
        t.equal(typeof dashgrid.dashgrid.draggable.enabled, 'boolean', 'draggable.enabled initialized');
        t.equal(dashgrid.dashgrid.draggable.handle, 'dashgrid-box', 'draggable.handles initialized');
        t.equal(dashgrid.dashgrid.draggable.dragStart, undefined, 'dragStart initialized');
        t.equal(dashgrid.dashgrid.draggable.dragging, undefined, 'dragging initialized');
        t.equal(dashgrid.dashgrid.draggable.dragEnd, undefined, 'dragEnd initialized');

        t.equal(typeof dashgrid.dashgrid.resizable, 'object', 'resizable initialized');
        t.equal(typeof dashgrid.dashgrid.resizable.enabled, 'boolean', 'enabled initialized');
        t.equal(Array.isArray(dashgrid.dashgrid.resizable.handle), true, 'resizable handles initialized');
        t.equal(isNumber(dashgrid.dashgrid.resizable.handleWidth), true, 'handleWidth initialized');
        t.equal(dashgrid.dashgrid.resizable.resizeStart, undefined, 'resizeStart initialized');
        t.equal(dashgrid.dashgrid.resizable.resizing, undefined, 'resizing initialized');
        t.equal(dashgrid.dashgrid.resizable.resizeEnd, undefined, 'resize initialized');

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
                handle: undefined,
                dragStart: function () {},
                dragging: function () {},
                dragEnd: function () {}
            },
            resizable: {
                enabled: true,
                handle: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
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
            snapBackTime: 400,
            showGridLines: true,
            showGridCentroids: true
        };
        let dashgrid = dashGridGlobal(document.getElementById('grid'), gs);

        // Check that grid object gets all properties.
        t.notEqual(dashgrid.dashgrid, undefined, 'Returns object');
        t.notEqual(dashgrid.dashgrid, undefined, 'Has grid options');
        t.notEqual(dashgrid.updateBox, undefined, 'Has API updateBox');
        t.notEqual(dashgrid.insertBox, undefined, 'Has API insertBox');
        t.notEqual(dashgrid.removeBox, undefined, 'Has API removeBox');

        t.equal(dashgrid.dashgrid._element.nodeName, 'DIV', 'Grid Element initialized');
        t.equal(Array.isArray(dashgrid.dashgrid.boxes), true, 'Boxes is array');

        t.equal(dashgrid.dashgrid.rowHeight, gs.rowHeight, 'RowHeight initialized');
        t.equal(dashgrid.dashgrid.numRows, gs.numRows, 'numRows initialized');
        t.equal(dashgrid.dashgrid.minRows, gs.minRows, 'minRows initialized');
        t.equal(dashgrid.dashgrid.maxRows, gs.maxRows, 'maxRows initialized');

        t.equal(dashgrid.dashgrid.columnWidth, gs.columnWidth, 'columnWidth initialized');
        t.equal(dashgrid.dashgrid.numColumns, gs.numColumns, 'numColumns initialized');
        t.equal(dashgrid.dashgrid.minColumns, gs.minColumns, 'minColumns initialized');
        t.equal(dashgrid.dashgrid.maxColumns, gs.maxColumns, 'maxColumns initialized');

        t.equal(dashgrid.dashgrid.minRowspan, gs.minRowspan, 'minRowspan initialized');
        t.equal(dashgrid.dashgrid.maxRowspan, gs.maxRowspan, 'maxRowspan initialized');
        t.equal(dashgrid.dashgrid.minColumnspan, gs.minColumnspan, 'minColumnspan initialized');
        t.equal(dashgrid.dashgrid.maxColumnspan, gs.maxColumnspan, 'maxColumnspan initialized');

        t.equal(dashgrid.dashgrid.xMargin, gs.xMargin, 'xMargin initialized');
        t.equal(dashgrid.dashgrid.yMargin, gs.yMargin, 'yMargin initialized');

        t.equal(dashgrid.dashgrid.pushable, gs.pushable, 'pushable initialized');
        t.equal(dashgrid.dashgrid.floating, gs.floating, 'floating initialized');
        t.equal(dashgrid.dashgrid.stacking, gs.stacking, 'stacking initialized');
        t.equal(dashgrid.dashgrid.swapping, gs.swapping, 'swapping initialized');

        t.equal(dashgrid.dashgrid.animate, gs.animate, 'animate initialized');
        t.equal(dashgrid.dashgrid.liveChanges, gs.liveChanges, 'liveChanges initialized');

        // t.equal(dashgrid.dashgrid.mobileBreakPoint, gs.mobileBreakPoint, 'mobileBreakPoint initialized');
        // t.equal(dashgrid.dashgrid.mobileBreakPointEnabled, gs.mobileBreakPointEnabled, 'mobileBreakPointEnabled initialized');

        t.equal(dashgrid.dashgrid.scrollSensitivity, gs.scrollSensitivity, 'scrollSensitivity initialized');
        t.equal(dashgrid.dashgrid.scrollSpeed, gs.scrollSpeed, 'scrollSpeed initialized');

        t.equal(dashgrid.dashgrid.snapBackTime, gs.snapBackTime, 'snapBackTime initialized');
        t.equal(dashgrid.dashgrid.showGridLines, gs.showGridLines, 'showGridLines initialized');
        t.equal(dashgrid.dashgrid.showGridCentroids, gs.showGridCentroids, 'showGridCentroids initialized');

        t.equal(typeof dashgrid.dashgrid.draggable, 'object', 'draggable initialized');
        t.equal(dashgrid.dashgrid.draggable.enabled, true, 'draggable.enabled initialized');
        t.equal(dashgrid.dashgrid.draggable.handle, 'dashgrid-box', 'draggable.handle initialized');
        t.equal(typeof dashgrid.dashgrid.draggable.dragStart, 'function', 'dragStart initialized');
        t.equal(typeof dashgrid.dashgrid.draggable.dragging, 'function', 'dragging initialized');
        t.equal(typeof dashgrid.dashgrid.draggable.dragEnd, 'function', 'dragEnd initialized');

        t.equal(typeof dashgrid.dashgrid.resizable, 'object', 'resizable initialized');
        t.equal(dashgrid.dashgrid.resizable.enabled, gs.resizable.enabled, 'resizable enabled initialized');
        t.equal(arraysEqual(dashgrid.dashgrid.resizable.handle, ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']), true, 'resizable handles initialized');
        t.equal(dashgrid.dashgrid.resizable.handleWidth, gs.resizable.handleWidth, 'handleWidth initialized');
        t.equal(typeof dashgrid.dashgrid.resizable.resizeStart, 'function', 'resizeStart initialized');
        t.equal(typeof dashgrid.dashgrid.resizable.resizing, 'function', 'resizing initialized');
        t.equal(typeof dashgrid.dashgrid.resizable.resizeEnd, 'function', 'resize initialized');

        t.end();
    });

}
