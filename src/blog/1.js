const Task = require("data.task");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const getInput = q =>
  new Task((rej, res) => {
    readline.question(q, i => res(i.trim()));
  });

getInput("what is good?")
  .map(answer => answer.toUpperCase())
  .fork(console.error, console.log);
