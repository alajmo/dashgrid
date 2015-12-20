import dashGridGlobal from "../src/dashgrid.js";

export function insertTest(test) {

    test("Valid box inserts", function (t) {
        // Mockup.
        let grid = {};
        dashGridGlobal("#grid", grid);

        grid.api.insertBox({"row": 0, "column": 0, "rowspan": 2, "columnspan": 3});

        // Tests.
        t.plan(0);

        t.end();
    });

}
