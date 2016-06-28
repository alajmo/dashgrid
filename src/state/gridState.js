import {BoxState} from './boxState.js';

export {GridState};

/**
 *
 * @param {}
 * @returns
 */
function GridState(gridOptions) {

    let gridState = {
        boxes: [],
        rowHeight: gridOptions.rowHeight,
        numRows: (gridOptions.numRows !== undefined) ? gridOptions.numRows : 6,
        minRows: (gridOptions.minRows !== undefined) ? gridOptions.minRows : 6,
        maxRows: (gridOptions.maxRows !== undefined) ? gridOptions.maxRows : 10,

        extraRows: 0,
        extraColumns: 0,

        columnWidth: gridOptions.columnWidth,
        numColumns: (gridOptions.numColumns !== undefined) ? gridOptions.numColumns : 6,
        minColumns: (gridOptions.minColumns !== undefined) ? gridOptions.minColumns : 6,
        maxColumns: (gridOptions.maxColumns !== undefined) ? gridOptions.maxColumns : 10,

        xMargin: (gridOptions.xMargin !== undefined) ? gridOptions.xMargin : 20,
        yMargin: (gridOptions.yMargin !== undefined) ? gridOptions.yMargin : 20,

        defaultBoxRowspan: 2,
        defaultBoxColumnspan: 1,

        minRowspan: (gridOptions.minRowspan !== undefined) ? gridOptions.minRowspan : 1,
        maxRowspan: (gridOptions.maxRowspan !== undefined) ? gridOptions.maxRowspan : 9999,

        minColumnspan: (gridOptions.minColumnspan !== undefined) ? gridOptions.minColumnspan : 1,
        maxColumnspan: (gridOptions.maxColumnspan !== undefined) ? gridOptions.maxColumnspan : 9999,

        pushable: (gridOptions.pushable === false) ? false : true,
        floating: (gridOptions.floating === true) ? true : false,
        stacking: (gridOptions.stacking === true) ? true : false,
        swapping: (gridOptions.swapping === true) ? true : false,
        animate: (gridOptions.animate === true) ? true : false,

        liveChanges: (gridOptions.liveChanges === false) ? false : true,

        // Drag handle can be a custom classname or if not set revers to the
        // box container with classname 'dashgrid-box'.
        draggable: {
                enabled: (gridOptions.draggable && gridOptions.draggable.enabled === false) ? false : true,
                handle: (gridOptions.draggable && gridOptions.draggable.handle) || 'dashgrid-box',

                // user cb's.
                dragStart: gridOptions.draggable && gridOptions.draggable.dragStart,
                dragging: gridOptions.draggable && gridOptions.draggable.dragging,
                dragEnd: gridOptions.draggable && gridOptions.draggable.dragEnd
        },

        resizable: {
            enabled: (gridOptions.resizable && gridOptions.resizable.enabled === false) ? false : true,
            handle: (gridOptions.resizable && gridOptions.resizable.handle) || ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            northHandleThickness: (gridOptions.resizable &&  gridOptions.resizable.northHandleThickness !== undefined) ? gridOptions.resizable.northHandleThickness : 10,
            southHandleThickness: (gridOptions.resizable &&  gridOptions.resizable.southHandleThickness !== undefined) ? gridOptions.resizable.southHandleThickness : 10,
            eastHandleThickness: (gridOptions.resizable &&  gridOptions.resizable.eastHandleThickness !== undefined) ? gridOptions.resizable.eastHandleThickness : 10,
            westHandleThickness: (gridOptions.resizable &&  gridOptions.resizable.westhHandleThickness !== undefined) ? gridOptions.resizable.westthHandleThickness : 10,

            // user cb's.
            resizeStart: gridOptions.resizable && gridOptions.resizable.resizeStart,
            resizing: gridOptions.resizable && gridOptions.resizable.resizing,
            resizeEnd: gridOptions.resizable && gridOptions.resizable.resizeEnd
        },

        onUpdate: () => {},

        transition: 'opacity .3s, left .3s, top .3s, width .3s, height .3s',
        scrollSensitivity: 20,
        scrollSpeed: 10,
        snapBackTime: (gridOptions.snapBackTime === undefined) ? 300 : gridOptions.snapBackTime,

        showVerticalLine: (gridOptions.showVerticalLine === false) ? false : true,
        showHorizontalLine: (gridOptions.showHorizontalLine === false) ? false : true,
        showCentroid: (gridOptions.showCentroid === false) ? false : true,
        showShadowBox: (gridOptions.showShadowBox === false) ? false : true
    };

    return Object.seal(gridState);

};
