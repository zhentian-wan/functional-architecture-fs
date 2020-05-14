const { compose } = require("ramda");
const Task = require("data.task");

const Box = (f) => ({
  map: (g) => Box(compose(f, g)),
  fold: f,
});

console.log(
  Box(() => 2)
    .map((two) => two + 1)
    .fold()
);

Task.of(2)
  .map((two) => two + 1)
  .fork(
    (e) => console.error(e),
    (data) => console.log("data", data)
  );

new Task((rej, res) => res(2))
  .map((t) => t * 2)
  .fork(console.error, console.log);
