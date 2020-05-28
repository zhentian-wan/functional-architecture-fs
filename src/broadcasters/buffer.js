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

const bufferOperator = (broadcaster, grouperBroadcaster) => (listener) => {
  let buffers = [];

  const clean1 = broadcaster((val) => {
    buffers.push(val);
  });

  const clean2 = grouperBroadcaster((ignored) => {
    listener(buffers);
    buffers.length = 0;
  });

  return () => {
    if (buffers.length) {
      listener(buffers);
    }
    clean1();
    clean2();
  };
};

const source = intervalB(99);
const grouper = intervalB(502);

const clean = bufferOperator(source, grouper)(logL);

setTimeout(() => {
  clean();
  console.log("clean up");
}, 2000);
