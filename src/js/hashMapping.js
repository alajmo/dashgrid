import gridRenderer from './gridRender.js';

function hashMapping (gridRenderer){
    var gridHash = {
        numHor: 3,
        numVer: 2,
        cellWidth: null,
        cellHeight: null,
        hashMap: {}
    };

    gridHash.getBoxesFromHash = function () {

    };

    gridHash.initHash = function (width, height) {
        var i,
            numCells;

        this.cellWidth = width / this.numHor;
        this.cellHeight = height / this.numVer;

        this.cleanHash();

        // Visualize hash grid.
        gridRenderer.drawHash(this.numHor, this.numVer,
            this.cellWidth, this.cellHeight);
    };

    gridHash.cleanHash = function () {
        var i,
            numCells = this.numHor * this.numVer;

        for (i = 0; i < numCells; i += 1) {
            this.hashMap[i] = {};
        }
    };

    gridHash.populateHash = function (boxes) {
        var key;

        this.cleanHash();
        for (key in boxes) {
            this.insertToHashMap(boxes[key]);
        }
    };

    gridHash.findIntersectedCells = function (box) {
        var i,
            j,
            c,
            left,
            right,
            top,
            bottom,
            cells = [null, null, null, null], // nw ne sw se
            leftCol,
            rightCol;

        // pos, column
        left = [box.elem[0].offsetLeft, null];
        // pos, column
        right = [box.elem[0].offsetLeft + box.elem[0].offsetWidth, null];
        // pos, row
        top = [box.elem[0].offsetTop, null];
        // pos, row
        bottom = [box.elem[0].offsetTop + box.elem[0].offsetHeight, null];

        // TODO: fix width/height rounding off errors
        // Left
        for (i = 1; i <= this.numVer; i += 1) {
            if (left[0] < (this.cellWidth * i)) {
                left[1] = i - 1;
                break;
            }
        }
        // Right
        for (i = 1; i <= this.numVer; i += 1) {
            if (right[0] <= (this.cellWidth * i)) {
                right[1] = i - 1;
                break;
            }
        }
        // Top
        for (i = 1; i <= this.numHor; i += 1) {
            if (top[0] <= (this.cellHeight * i)) {
                top[1] = i - 1;
                break;
            }
        }
        // Bottom
        for (i = 1; i <= this.numHor; i += 1) {
            if (bottom[0] <= (this.cellHeight * i)) {
                bottom[1] = i - 1;
                break;
            }
        }

        // Top left.
        cells[0] = (left[1] + top[1] * this.numHor);
        // Top right.
        cells[1] = (right[1] + top[1] * this.numHor);
        // Bottom left.
        cells[2] = (left[1] + bottom[1] * this.numHor);
        // Bottom right.
        cells[3] = (right[1] + bottom[1] * this.numHor);

        return cells;
    }

    // @desc Insert to hashmap.
    // @param object box
    gridHash.insertToHashMap = function (box) {
        var i,
            cells;

        cells = this.findIntersectedCells(box);

        for (i = 0; i < cells.length; i += 1) {
            this.hashMap[cells[i]][box.id] = box.id;
        }

        // Insert boxes into hashmap.
        if (box.id === 0) {
            console.log(this.hashMap);
        }

    };

    // @desc On rows/columns change, updateGrid hashmap.
    gridHash.updateHashMap = function () {

    };

    return gridHash;
}
