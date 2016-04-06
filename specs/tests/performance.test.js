testStats(grid, boxes, numRows, numColumns);

export function testStats(grid, boxes, numRows, numColumns) {
    var t1 = window.performance.now();
    for (let i = 0; i < numRows; i += 1) {
        for (let j = 0; j < numColumns; j += 1) {
            grid.updateBox(boxes[0], {row: i, column: j});
        }
    }
    var t2 = window.performance.now();
    console.log(t2 - t1);
}
