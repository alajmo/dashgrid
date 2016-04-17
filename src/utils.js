
/**
 *
 * @param {Object} box
 * @param {string} at1
 * @param {string} at2
 * @returns {Number}
 */
export function getMaxNum(box, at1, at2) {
    let maxVal = 0;
    for (var i = 0, len = box.length; i < len; i++) {
        if (box[i][at1] + box[i][at2] >= maxVal) {
            maxVal = box[i][at1] + box[i][at2];
        }
    }

    return maxVal;
}

/**
 *
 * @param {string} order
 * @param {string} attr
 * @param {Array.<Object>} objs
 * @returns {Array.<Object>}
 */
export function getSortedArr(order, attr, objs) {
    let key;
    let arr = [];

    Object.keys(objs).forEach(function (i) {
        insertByOrder(order, attr, objs[i], arr);
    });

    return arr;
}

/**
 * Sort array with newly inserted object.
 * @param {string} box
 * @param {string} at1
 * @param {Object} at2
 */
export function insertByOrder(order, attr, o, arr) {
    let len = arr.length;

    if (len === 0) {
        arr.push(o);
    } else {
        // Insert by order, start furthest down.
        // Insert between 0 and n -1.
        for (let i = 0; i < len; i += 1) {
            if (order === 'desc') {
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
        if (len === arr.length) {arr.push(o);}
    }
}

/**
 *
 * @param {Array.<Object>} a
 * @param {string} a
 */
export function insertionSort(a, attr) {
    if (a.length < 2) {
        return;
    }

    var i = a.length;
    var temp;
    var j;
    while (i--) {
        j = i;
        while (j > 0 && a[j - 1][attr] < a[j][attr]) {
            temp = a[j];
            a[j] = a[j - 1];
            a[j - 1] = temp;
            j -= 1;
        }
    }
}

/**
 *
 * @param {Object} obj
 * @returns {number} Number of properties in object.
 */
export function ObjectLength(obj) {
    let length = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            length += 1;
        }
    }
    return length;
}

/**
 * Add event, and not overwrite.
 * @param {Object} element
 * @param {string} type
 * @param {Function} eventHandle
 * @returns
 */
export function addEvent(element, type, eventHandle) {
    if (element === null || typeof(element) === 'undefined') return;
    if (element.addEventListener) {
        element.addEventListener( type, eventHandle, false );
    } else if (element.attachEvent) {
        element.attachEvent( 'on' + type, eventHandle );
    } else {
        element['on' + type] = eventHandle;
    }
}

/**
 * Remove nodes from element.
 * @param {Object} element
 */
export function removeNodes(element) {
    while (element.firstChild) {element.removeChild(element.firstChild);}
}

/**
 *
 * @param {Object} node
 * @param {string} className
 * @returns {Object|Boolean} DOM element object or false if not found. 
 */
export function findParent(node, className) {
    while (node.nodeType === 1 && node !== document.body) {
        if (node.className.search(className) > -1) {return node;}
        node = node.parentNode;
    }
    return false;
}
