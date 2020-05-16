const {
  of,
  Observable,
  merge,
  timer,
  Subject,
  combineLatest,
} = require("rxjs");
const {
  tap,
  map,
  mapTo,
  skip,
  race,
  filter,
  take,
  startWith,
  takeUntil,
  switchMap,
} = require("rxjs/operators");

const sub = {
  next: (d) => {
    console.log("next", d);
  },
  err: () => {
    console.error(err);
  },
  complete: () => {
    console.log("complete");
  },
};

const taskStartSubject = new Subject();
const taskStart = taskStartSubject.asObservable();
const taskEndSubject = new Subject();
const taskEnd = taskEndSubject.asObservable();
const busyDelayTimer = timer(500);
const busyMinDurationTimer = timer(3000);

////////////// start/////////////////
const busyDelayTimerStart = taskStart.pipe(switchMap(() => busyDelayTimer));
const busyDelayTimerEnd = busyDelayTimerStart.pipe(takeUntil(taskEnd));
const emitOnTaskEnd = taskEnd.pipe(mapTo(1));
const emitOnTimeout = busyDelayTimerEnd.pipe(mapTo(-1));
const emitOnTimerEnd = busyMinDurationTimer.pipe(mapTo(-1));
const taskEndBeforeTimeout = combineLatest([
  emitOnTaskEnd.pipe(startWith(null)),
  emitOnTimeout.pipe(startWith(null)),
]).pipe(skip(1));
const showSpinner = taskEndBeforeTimeout.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst === null && timerEndFirst !== null;
  }),
  tap(() => console.log("show"))
);

/////////////// end ///////////////

const taskEndBeforeTimerEnd = showSpinner.pipe(() =>
  combineLatest([
    emitOnTaskEnd.pipe(startWith(null)),
    emitOnTimerEnd.pipe(startWith(null)),
  ]).pipe(skip(1))
);
const hideSpinnerUntilTimerEnd = taskEndBeforeTimerEnd.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst !== null && timerEndFirst === null;
  }),
  takeUntil(emitOnTimerEnd)
);
const hideSpinnerAfterTimerAndTaskEnd = taskEndBeforeTimerEnd.pipe(
  filter(([taskEndFirst, timerEndFirst]) => {
    return taskEndFirst === null && timerEndFirst !== null;
  }),
  takeUntil(taskEnd)
);
const hideSpinner = merge(
  hideSpinnerUntilTimerEnd,
  hideSpinnerAfterTimerAndTaskEnd
).pipe(tap(() => console.log("hide")));
const Spinner = showSpinner.pipe(takeUntil(hideSpinner));
Spinner.subscribe();

taskStartSubject.next();

setTimeout(() => {
  taskEndSubject.next();
}, 1000);
