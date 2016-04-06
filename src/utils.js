
/**
* 
* @param {}  
* @returns 
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
* @param {}  
* @returns 
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
* Returns a new array with the newly inserted object.
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
* @param {}
* @returns
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
* @param {}
* @returns
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
*
* @param {}
* @returns
*/
export function addEvent(elem, type, eventHandle) {
    if (elem === null || typeof(elem) === 'undefined') return;
    if (elem.addEventListener) {
        elem.addEventListener( type, eventHandle, false );
    } else if (elem.attachEvent) {
        elem.attachEvent( 'on' + type, eventHandle );
    } else {
        elem['on' + type] = eventHandle;
    }
}

/**
*
* @param {}
* @returns
*/
export function parseArrayOfJSON(dataFromServer){
    let parsedJSON = JSON.parse(dataFromServer.d);
    for (let i = 0;i < parsedJSON.length; i += 1) {
        alert(parsedJSON[i].Id);
    }
 }

/**
*
* @param {}
* @returns
*/
export function removeNodes(element) {
    while (element.firstChild) {element.removeChild(element.firstChild);}
}

/**
*
* @param {Object} node
* @param {String} className
* @returns {Boolean}
*/
export function findParent(node, className) {
    while (node.nodeType === 1 && node !== document.body) {
        if (node.className.indexOf(className) > -1) {return node;}
        node = node.parentNode;
    }
    return false;
}
