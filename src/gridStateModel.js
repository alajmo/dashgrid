export {gridStateModel};

function gridStateModel(options) {

    let gridStateModel = {
        rowHeight: options.rowHeight,
        numRows: (options.numRows !== undefined) ? options.numRows : 6,
        minRows: (options.minRows !== undefined) ? options.minRows : 6,
        maxRows: (options.maxRows !== undefined) ? options.maxRows : 10,

        extraRows: 0,
        extraColumns: 0,

        columnWidth: options.columnWidth,
        numColumns: (options.numColumns !== undefined) ? options.numColumns : 6,
        minColumns: (options.minColumns !== undefined) ? options.minColumns : 6,
        maxColumns: (options.maxColumns !== undefined) ? options.maxColumns : 10,

        xMargin: (options.xMargin !== undefined) ? options.xMargin : 20,
        yMargin: (options.yMargin !== undefined) ? options.yMargin : 20,

        defaultBoxRowspan: 2,
        defaultBoxColumnspan: 1,

        minRowspan: (options.minRowspan !== undefined) ? options.minRowspan : 1,
        maxRowspan: (options.maxRowspan !== undefined) ? options.maxRowspan : 9999,

        minColumnspan: (options.minColumnspan !== undefined) ? options.minColumnspan : 1,
        maxColumnspan: (options.maxColumnspan !== undefined) ? options.maxColumnspan : 9999,

        pushable: (options.pushable === false) ? false : true,
        floating: (options.floating === true) ? true : false,
        stacking: (options.stacking === true) ? true : false,
        swapping: (options.swapping === true) ? true : false,
        animate: (options.animate === true) ? true : false,

        liveChanges: (options.liveChanges === false) ? false : true,

        // Drag handle can be a custom classname or if not set revers to the
        // box container with classname 'dashgrid-box'.
        draggable: {
                enabled: (options.draggable && options.draggable.enabled === false) ? false : true,
                handle: (options.draggable && options.draggable.handle) || 'dashgrid-box',

                // user cb's.
                dragStart: options.draggable && options.draggable.dragStart,
                dragging: options.draggable && options.draggable.dragging,
                dragEnd: options.draggable && options.draggable.dragEnd
        },

        resizable: {
            enabled: (options.resizable && options.resizable.enabled === false) ? false : true,
            handle: (options.resizable && options.resizable.handle) || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            handleWidth: (options.resizable &&  options.resizable.handleWidth !== undefined) ? options.resizable.handleWidth : 10,

            // user cb's.
            resizeStart: options.resizable && options.resizable.resizeStart,
            resizing: options.resizable && options.resizable.resizing,
            resizeEnd: options.resizable && options.resizable.resizeEnd
        },

        onUpdate: () => {},

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapBackTime: (options.snapBackTime === undefined) ? 300 : options.snapBackTime,

        showVerticalLine: (options.showVerticalLine === false) ? false : true,
        showHorizontalLine: (options.showHorizontalLine === false) ? false : true,
        showCentroid: (options.showCentroid === false) ? false : true
    };

    return gridStateModel;
};
