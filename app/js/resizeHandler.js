/**
 * @desc resize handler.
 */
export default function ResizeHandler() {
    let member = {
        box: null,
        scope: null,
        elem: null,
        gridElem: null,
        body: document.body,
        shadowElem: null,
        anchorX: 0,
        anchorY: 0,
        mouseX: 0, // x position of mouse, resets after box move
        mouseY: 0, // y position of mouse, resets after box move
        xRelBox: 0, // x position of mouse relative to box
        yRelBox: 0, // y position of mouse relative to box
        xDiff: 0, // Difference between initial x box and resizing
        yDiff: 0, // Difference between initial y box and resizing
        pos: {} // Object containing how many x/y steps to move
    };

    /**
     * 
     */
    let createShadowElem = function () {

    };

    /**
     * 
     */
    let updateHoverElem = function (x, y) {

    };

    /**
     * 
     */
    let resizeStart = function (e) {

    };

    /**
     * 
     */
    let resize = function (e) {

    };

    /**
     * 
     */
    let resizeStop = function (e) {

    };

    return Object.freeze({
        createShadowElem,
        updateHoverElem,
        resize,
        resizeStart,
        resizeStop
    });
}