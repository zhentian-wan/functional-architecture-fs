import { curry } from "lodash";
import { done } from "./broadcasters";

let createOperator = curry((operator, broadcaster, listener) => {
  return operator((behaviorListener) => {
    return broadcaster((value) => {
      if (value === done) {
        listener(done);
        return;
      }

      behaviorListener(value);
    });
  }, listener);
});

export let map = (transform) =>
  createOperator((broadcaster, listener) => {
    return broadcaster((value) => {
      listener(transform(value));
    });
  });

export let filter = (predicate) =>
  createOperator((broadcaster, listener) => {
    return broadcaster((value) => {
      if (predicate(value)) {
        listener(value);
      }
    });
  });

export let split = (splitter) =>
  curry((broadcaster, listener) => {
    let buffer = [];
    return broadcaster((value) => {
      if (value === done) {
        listener(buffer);
        buffer = [];
        listener(done);
      }
      if (value == splitter) {
        listener(buffer);
        buffer = [];
      } else {
        buffer.push(value);
      }
    });
  });

export let hardCode = (newValue) =>
  createOperator((broadcaster, listener) => {
    let cancel = broadcaster((value) => {
      listener(newValue);
    });

    return () => cancel();
  });

export let add = (initial) => (broadcaster) => (listener) => {
  return broadcaster((value) => {
    listener((initial += value));
  });
};

export let startWhen = (whenBroadcaster) => (mainBroadcaster) => (listener) => {
  let cancelMain;
  let cancelWhen;

  cancelWhen = whenBroadcaster((whenValue) => {
    if (cancelMain) cancelMain();
    cancelMain = mainBroadcaster((value) => {
      if (value === done) {
        if (whenValue === done) {
          listener(done);
        }
        return;
      }
      listener(value);
    });
  });

  return () => {
    cancelMain();
    cancelWhen();
  };
};

export let stopWhen = (whenBroadcaster) => (mainBroadcaster) => (listener) => {
  let cancelMain = mainBroadcaster(listener);

  let cancelWhen = whenBroadcaster((value) => {
    cancelMain();
  });

  return () => {
    cancelMain();
    cancelWhen();
  };
};

export let targetValue = map((event) => event.target.value);

export let mapBroadcaster = (createBroadcaster) => (broadcaster) => (
  listener
) => {
  return broadcaster((value) => {
    let newBroadcaster = createBroadcaster(value);
    newBroadcaster(listener);
  });
};

export let applyOperator = (broadcaster) =>
  mapBroadcaster((operator) => operator(broadcaster));

export let stringConcat = (broadcaster) => (listener) => {
  let result = "";
  return broadcaster((value) => {
    if (value === done) {
      listener(result);
      result = "";
      return;
    }
    result += value;
  });
};

export const sequence = (...broadcasters) => (listener) => {
  let broadcaster = broadcasters.shift();
  let cancel;
  let sequenceListener = (value) => {
    if (value === done && broadcasters.length) {
      broadcaster = broadcasters.shift();
      cancel = broadcaster(sequenceListener);
      return;
    }
    listener(value);
  };
  cancel = broadcaster(sequenceListener);

  return () => {
    cancel();
  };
};

export let doneIf = (condition) => (broadcaster) => (listener) => {
  let cancel;

  cancel = broadcaster((value) => {
    if (condition(value)) {
      listener(done);
      return;
    }

    listener(value);
  });

  return () => {
    cancel();
  };
};
