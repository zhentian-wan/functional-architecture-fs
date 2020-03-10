// Reader
// Provide all kinds of configuration for Reader.
// The config will be always there and you can read / access it anytime

// useful: Dependency injection

/**
 * Take a `run` function, return a object which contain `run & concat`
 * methods.
 *
 * concat take other Monoid. we able to concat the reuslt inside concat function.
 * @param {run: function}
 */
const Fn = run => ({
  run,
  map: f => Fn(x => f(run(x))),
  chain: f => Fn(x => f(run(x)).run(x)),
  // run two functions and concat the result
  concat(otherM) {
    return Fn(x => run(x).concat(otherM.run(x)));
  }
});
Fn.of = x => Fn(() => x);
Fn.ask = Fn(x => x);

const toUpper = s => s.toUpperCase();
const exclaim = s => `${s}!`;

const res = Fn(toUpper)
  .concat(Fn(exclaim))
  // .map(s => s.slice(3))
  .run("happy flow"); // HAPPY FLOWhappy flow!
console.log("res", res);

const res1 = Fn(toUpper)
  .chain(upper => Fn(y => [upper, exclaim(y)]))
  .run("hi");
console.log(res1); // [ 'HI', 'hi!' ]

const res2 = Fn.of("hello")
  .map(toUpper)
  .chain(upper => Fn(config => [upper, config]))
  .run({ port: 3300 });
console.log(res2);

const res3 = Fn.of("hello")
  .map(toUpper)
  .chain(upper => Fn.ask.map(config => [upper, config]))
  .run({ port: 3300 });
console.log(res3);
