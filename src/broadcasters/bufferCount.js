const logL = (value) => {
  console.log(value);
};

const intervalB = (time) => (listener) => {
  let count = 0;
  const id = setInterval(() => {
    listener(count++);
  }, time);

  return () => {
    clearInterval(id);
  };
};

const bufferCountOperator = (bufferSize) => (innerBroadcaster) => (
  listener
) => {
  let buffers = [];

  const clean = innerBroadcaster((val) => {
    buffers.push(val);
    if (buffers.length >= bufferSize) {
      listener(buffers);
      buffers.length = 0;
    }
  });

  return () => {
    if (buffers.length > 0) {
      listener(buffers);
    }
    clean();
  };
};

const bufferCountSkipOperator = (bufferSize, startBufferEvery) => (
  broadcaster
) => (listener) => {
  let buffers = [];
  let count = 0;
  const clean = broadcaster((val) => {
    count++;
    if (count % startBufferEvery === 0) {
      buffers.push([]);
    }

    for (let i = buffers.length; i--; ) {
      const buffer = buffers[i];
      buffer.push(val);
      console.log(
        `==i: ${i}, push val: ${val}`,
        "buffer",
        buffer,
        "buffers",
        buffers,
        "=="
      );
      if (buffer.length === bufferSize) {
        // delete first one
        buffers.splice(i, 1);
        listener(buffer);
      }
    }
  });

  return () => {
    if (buffers.length > 0) {
      // popup the first one and return its value
      listener(buffers.shift());
    }
    clean();
  };
};

const bufferCounter = (bufferSize, startBufferEvery) => (broadcaster) => (
  listener
) => {
  if (!startBufferEvery || bufferSize === startBufferEvery) {
    return bufferCountOperator(bufferSize)(broadcaster)(listener);
  } else {
    return bufferCountSkipOperator(bufferSize, startBufferEvery)(broadcaster)(
      listener
    );
  }
};

const grouper = intervalB(100);

const clean = bufferCounter(3, 1)(grouper)(logL);

setTimeout(() => {
  clean();
  console.log("clean up");
}, 800);
