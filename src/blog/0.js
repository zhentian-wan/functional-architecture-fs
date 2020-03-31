const { Task } = require("data.task");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const getInput = s =>
  readline.question(s, line => {
    console.log("Receive: ", line.trim());
  });
getInput("what's up?");
