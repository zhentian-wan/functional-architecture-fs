const { Id } = require("./types");
const Either = require("data.either");
const { Right, Left } = Either;
const { List } = require("immutable-ext");

const Sum = x => ({
  x,
  concat: other => {
    return Sum(x + other.x);
  }
});
Sum.empty = () => Sum(0);

const res = Id.of(Sum(3)).concat(Id(Sum(5))); // Id(Sum(8))
console.log(res.extract());

const Alternative = ex => ({
  ex,
  concat: other => {
    return Alternative(other.ex.isLeft ? ex : ex.concat(other.ex));
  }
});
Alternative.empty = () => Alternative(Right(""));

const lg = console.log;

// Different from Either, when meet Left, just keep the Left
// Alternative will ignore the Left, only keep the Right
const res1 = Alternative(Right("hi"))
  .concat(Alternative(Right("!!!")))
  .concat(Alternative(Left("bye"))); // Right('hi!!!')
res1.ex.fold(console.log, console.log); // hi!!!

const res2 = List([Right("a"), Right("b"), Left("c")]).foldMap(
  Alternative,
  Alternative(Right(""))
);
res2.ex.fold(lg, lg); // ab
