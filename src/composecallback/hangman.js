import { addListener, done, forOf } from "./broadcasters";
import { targetValue, map } from "./operators";
import { pipe } from "lodash/fp";
const log = console.log;

let inputInput = addListener("#input", "input");
let inputValue = targetValue(inputInput);

let word = forOf("honeycomb");

inputValue((value) => {});

let mapBroadcaster = (createBroadcaster) => (broadcaster) => (listener) => {
  broadcaster((value) => {
    let newBroadcaster = createBroadcaster(value);
    newBroadcaster(listener);
  });
};

let hangmanLogic = (value) => {
  return map((letter) => (value.includes(letter) ? letter : "*"));
};

let applyOperator = (broadcaster) =>
  mapBroadcaster((operator) => operator(broadcaster));

let stringConcat = (broadcaster) => (listener) => {
  let result = "";
  broadcaster((value) => {
    if (value === done) {
      listener(result);
      result = "";
      return;
    }
    result += value;
  });
};

let hangman = pipe(map(hangmanLogic), applyOperator(word), stringConcat);

let doneCondition = (condition) => (broadcaster) => (listener) => {
  let cancel = filter(condition)(broadcaster)((value) => {
    listener(done);
    cancel();
  });

  return () => {
    cancel();
  };
};

let mapDone = (doneValue) => (broadcaster) => (listener) => {
  broadcaster((value) => {
    if (value === done) {
      listener(doneValue);
    }
  });
};
let cancelWhen = (cancelBroadcaster) => (broadcaster) => (listener) => {
  let cancel = broadcaster(listener);

  let cancel2 = cancelBroadcaster(() => {
    cancel();
  });

  return () => {
    cancel();
    cancel2();
  };
};

let winPipe = pipe(
  doneCondition((str) => !str.includes("*")),
  mapDone("you win!")
);
let play = hangman(inputValue);
let win = winPipe(play);

let rules = pipe(cancelWhen(win));
let playWithWin = rules(play);
playWithWin(console.log);
win(console.log);
