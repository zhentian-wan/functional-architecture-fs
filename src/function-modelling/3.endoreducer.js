// Endo
// Util: 03:57:00
const { List } = require("immutable-ext");

const toUpper = s => s.toUpperCase();
const exclaim = s => `${s}!`;
const Fn = run => ({
  run,
  map: f => Fn(x => f(run(x))),
  chain: f =>
    Fn(x => console.log("run(x)", run(x), f(run(x))) || f(run(x)).run(x)),
  // run two functions and concat the result
  concat(otherFn) {
    return Fn(x => run(x).concat(otherFn.run(x)));
  }
});
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
// (acc, a) -> acc
// (a, acc) -> acc
// a -> acc -> acc
// a -> (acc -> acc)
// a -> Endo(acc -> acc)
// Fn(a -> Endo(acc -> acc))

const Reducer = run => ({
  run,
  contraMap(f) {
    return Reducer((acc, x) => run(acc, f(x)));
  },
  concat(other) {
    return Reducer((acc, curr) => other.run(run(acc, curr), curr));
  }
});

/*
Reducer(login)
  .contraMap(payload => payload.user)
  .concat(Reducer(changePage).contraMap(payload => payload.currentPage))
  .run(state, { user: {}, currentPage: {} });
*/

const checkCreds = (email, pass) => email === "admin" && pass === 123;
const loginReducer = payload => state =>
  payload.email
    ? Object.assign({}, state, {
        loggedIn: checkCreds(payload.email, payload.pass)
      })
    : state;
const setPrefsReducer = payload => state =>
  payload.prefs ? Object.assign({}, state, { prefs: payload.prefs }) : state;
const reducer = Fn(loginReducer)
  .map(Endo)
  .concat(Fn(setPrefsReducer).map(Endo));
const state = { loggedIn: false, prefs: {} };
const payload = { email: "admin", pass: 123, prefs: { bgColor: "#000" } };
console.log(reducer.run(payload).run(state));
