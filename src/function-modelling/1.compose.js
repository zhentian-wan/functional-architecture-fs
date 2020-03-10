// Endo
const { List } = require("immutable-ext");

const toUpper = s => s.toUpperCase();
const exclaim = s => `${s}!`;

// Endo functor
// a -> a
// string -> string
const Endo = run => ({
  run,
  concat(otherM) {
    return Endo(x => run(otherM.run(x)));
  }
});
Endo.empty = () => Endo(x => x);

const res = List([toUpper, exclaim])
  .foldMap(Endo, Endo.empty())
  .run("hello"); // HELLO!

console.log(res);

// contraMap
// modify the input before passing into the function
const Reducer = run => ({
  run,
  contraMap(f) {
    return Reducer((acc, x) => run(acc, f(x)));
  }
});

// Reducer(login).contraMap(payload => payload.user)
//   .concat(Reducer(changePage).contraMap(payload => payload.currentPage))
//   .run(state, {user: {}, currentPage: {}})
