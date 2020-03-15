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
const loginReducer = (state, payload) =>
  payload.email
    ? Object.assign({}, state, {
        loggedIn: checkCreds(payload.email, payload.pass)
      })
    : state;
const setPrefsReducer = (state, payload) =>
  payload.prefs ? Object.assign({}, state, { prefs: payload.prefs }) : state;
const reducer = Reducer(loginReducer).concat(Reducer(setPrefsReducer));
const state = { loggedIn: false, prefs: {} };
const payload = { email: "admin", pass: 123, prefs: { bgColor: "#000" } };
console.log(reducer.run(state, payload));
