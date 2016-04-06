var diff = require('deep-diff').diff;
var deepcopy = require('deepcopy');

import {isNumber, arraysEqual} from './sim-click.js';

export default function gridResize(dashGridGlobal, test) {
    // Mockup.
    let differences, prevState;
    let boxes = [{row: 0, column: 0, rowspan: 3, columnspan: 3}];
    let grid = dashGridGlobal('#grid', {boxes: boxes});
}
