/**
 * utils.js: Utility tools.
 */

export function getMaxObj(objs, attr) {
    let key;
    let maxVal = 0;

    objs.forEach(function (element) {
        if (element[attr] >= maxVal) {
            maxVal = element[attr];
        }
    });

    return maxVal;
}

/**
*   @desc
*/
export function getSortedArr(order, attr, objs) {
    let key;
    let arr = [];

    Object.keys(objs).forEach(function (i) {
        insertByOrder({
            order: order,
            attr: attr,
            o: objs[i],
            arr: arr
        });
    });

    return arr;
}

/**
*   @desc
*/
export function insertByOrder(obj) {
    let {order, attr, o, arr} = obj;
    let len = arr.length;

    if (len === 0) {
        arr.push(o);
    } else {
        // Insert by order, start furthest down.
        // Insert between 0 and n -1.
        for (let i = 0; i < len; i += 1) {
            if (order === "desc") {
                if (o.row > arr[i].row) {
                    arr.splice(i, 0, o);
                    break;
                }
            } else {
                if (o.row < arr[i].row) {
                    arr.splice(i, 0, o);
                    break;
                }
            }
        }

        // If not inbetween 0 and n - 1, insert last.
        if (len === arr.length) {
            arr.push(o);
        }

    }
}

/**
*   @desc
*/
export function ObjectLength(object) {
    let length = 0,
        key;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            length += 1;
        }
    }
    return length;
}

/**
*   @desc
*/
export function addEvent(elem, type, eventHandle) {
    if (elem === null || typeof(elem) === "undefined") return;
    if (elem.addEventListener) {
        elem.addEventListener( type, eventHandle, false );
    } else if (elem.attachEvent) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on" + type] = eventHandle;
    }
}

/**
*   @desc
*/
export function parseArrayOfJSON(dataFromServer){
    let parsedJSON = JSON.parse(dataFromServer.d);
    for (let i = 0;i < parsedJSON.length; i += 1) {
        alert(parsedJSON[i].Id);
    }
 }

/**
*   @desc
*/
export function removeNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
