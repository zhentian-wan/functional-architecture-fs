import { createTimeout, done } from "./broadcasters";
import { hardCode } from "./operators";

let repeat = (broadcaster) => (listener) => {
  let cancel;
  let repeatListener = (value) => {
    if (value === done) {
      if (cancel) {
        cancel();
      }
      cancel = broadcaster(repeatListener);
      return;
    }

    listener(value);
  };
  cancel = broadcaster(repeatListener);

  return () => {
    cancel();
  };
};

let repeatWhen = (whenBroadcaster) => (mainBroadcaster) => (listener) => {
  let cancelMain;
  let cancelWhen;

  let repeatListener = (value) => {
    if (value === done) {
      cancelMain();
      if (cancelWhen) {
        cancelWhen();
      }
      cancelWhen = whenBroadcaster(() => {
        cancelMain = mainBroadcaster(repeatListener);
      });
      return;
    }
  };
  cancelMain = mainBroadcaster(listener);

  return () => {
    cancelMain();
    if (cancelWhen) {
      cancelWhen();
    }
  };
};

let one = repeatWhen(createTimeout(1000))(hardCode("hi"));

let cancel = one(console.log);
setTimeout(() => {
  console.log("called");
  cancel();
}, 5000);
