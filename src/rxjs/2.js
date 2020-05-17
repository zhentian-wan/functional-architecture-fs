const { merge, timer, Subject, combineLatest } = require("rxjs");
const {
  tap,
  mapTo,
  skip,
  filter,
  startWith,
  takeUntil,
  switchMap,
} = require("rxjs/operators");

const DELAY = 500;
const MIN_DURATION = 1200;

const taskStartSubject = new Subject();
const taskStart = taskStartSubject.asObservable();
const taskEndSubject = new Subject();
const taskEnd = taskEndSubject.asObservable();
const busyDelayTimer = timer(DELAY);
const busyMinDurationTimer = timer(MIN_DURATION + DELAY);
const busyDelayTimerStart = taskStart.pipe(switchMap(() => busyDelayTimer));
const busyDelayTimerEnd = busyDelayTimerStart.pipe(takeUntil(taskEnd));
const emitOnTaskEnd = taskEnd.pipe(mapTo(1));
const emitOnDelayTimerEnd = busyDelayTimerEnd.pipe(mapTo(-1));
const emitOnMinDurationEnd = busyMinDurationTimer.pipe(mapTo(-1));

////////////// start/////////////////

const raceBetweenTaskAndDelay = combineLatest([
  emitOnTaskEnd.pipe(startWith(null)),
  emitOnDelayTimerEnd.pipe(startWith(null)),
]).pipe(skip(1));
const taskEndBeforeDelay = raceBetweenTaskAndDelay.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst === 1 && timerEndFirst === null;
  })
);
const shouldNotShowSpinner = taskEndBeforeDelay.pipe(mapTo(false));
const taskEndAfterTimeout = raceBetweenTaskAndDelay.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst === null && timerEndFirst === -1;
  })
);
const shouldShowSpinner = taskEndAfterTimeout.pipe(mapTo(true));
const showSpinner = shouldShowSpinner.pipe(
  tap(() => {
    console.timeLog("spinner");
    console.log("show");
  })
);

/////////////// end ///////////////

const raceBetweenTaskAndMinDuration = combineLatest([
  emitOnTaskEnd.pipe(startWith(null)),
  emitOnMinDurationEnd.pipe(startWith(null)),
]).pipe(skip(1));
const hideSpinnerUntilMinDurationEnd = raceBetweenTaskAndMinDuration.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst === 1 && timerEndFirst === null;
  })
);
const hideSpinnerAfterTimerAndTaskEnd = raceBetweenTaskAndMinDuration.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst === 1 && timerEndFirst === -1;
  })
);
const hideSpinner = merge(
  // case 1: should not show spinner at all
  shouldNotShowSpinner,
  // case 2: task end, but wait until min duration timer ends
  combineLatest([hideSpinnerUntilMinDurationEnd, emitOnMinDurationEnd]),
  // case 3: task takes a long time, wait unitl its end
  hideSpinnerAfterTimerAndTaskEnd
).pipe(
  tap(() => {
    console.timeLog("spinner");
    console.log("hide");
  })
);
const Spinner = showSpinner.pipe(takeUntil(hideSpinner));

// test
Spinner.subscribe();

console.log("task start");
console.time("spinner");
taskStartSubject.next();

// Case 1: Should not show spinner

setTimeout(() => {
  taskEndSubject.next();
}, 50);

// Case 2: Should show spinner when busyMinDurationMs end
/*
setTimeout(() => {
  taskEndSubject.next();
}, 600);
*/
// Case 3: Should show spinner until task ends
/*
setTimeout(() => {
  taskEndSubject.next();
}, 2000);
*/
