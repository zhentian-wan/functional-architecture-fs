// From 2:03:00
// Util: 2:16:22

// Reader
// Provide all kinds of configuration for Reader.
// The config will be always there and you can read / access it anytime

// useful: Dependency injection

/**
 * Take a `run` function, return a object which contain `run & concat`
 * methods.
 *
 * Instead of passing a data, we pass a function run. Then we can
 * Keep concat different functions
 *
 * concat take other Monoid. we able to concat the reuslt inside concat function.
 * @param {run: function}
 */
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
Fn.of = x => Fn(() => x);
Fn.ask = Fn(x => x);

const toUpper = s => s.toUpperCase();
const exclaim = s => `${s}!`;
/*
const res = Fn(toUpper)
  .concat(Fn(exclaim))
  .map(s => s.slice(5))
  .run("happy flow"); // HAPPY FLOWhappy flow!
console.log("res", res);

const res1 = Fn(toUpper)
  .chain(upper => Fn(y => [upper, exclaim(y)]))
  .run("hi");
console.log(res1); // [ 'HI', 'hi!' ]
*/
// FROM: 2:09:00
const res2 = Fn.of("hi")
  .map(toUpper)
  .chain(upper => Fn(x => [upper, exclaim(x)])) // ["HI", 'hello!']
  .chain(ary => Fn(x => [exclaim(ary[0]), x])) // ["HI!", "hello"]
  .run("hello");
console.log(res2);

const res22 = Fn.of("hi")
  .map(toUpper)
  .chain(upper => Fn.ask.map(x => [upper, exclaim(x)])) // ["HI", 'hello!']
  .chain(ary => Fn.ask.map(x => [exclaim(ary[0]), x])) // ["HI!", "hello"]
  .run("hello");
console.log(res22);

const res3 = Fn.of("hi")
  .map(toUpper)
  .chain(upper => Fn.ask.map(config => [upper, config]))
  .run({ port: 3300 });
console.log(res3);

const res4 = Fn(toUpper)
  .chain(upper => Fn(y => exclaim(upper)))
  .run("hi");

console.log(res4); // 'Hi!'
