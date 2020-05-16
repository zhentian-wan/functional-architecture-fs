const { of, Observable, merge, timer } = require("rxjs");
const { mapTo, scan, takeUntil } = require("rxjs/operators");

const taskStarts = new Observable();
const taskComplete = new Observable();
const showSpinner = new Observable();

const loadUp = taskStarts.pipe(mapTo(1));
const loadDown = taskStarts.pipe(mapTo(-1));

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx //

const loadVariations = merge(loadUp, loadDown);
const currentLoads = loadVariations.pipe(
  scan((total, curr) => {
    return total + curr;
  }, 0)
);
