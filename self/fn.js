const toUpper = (x) => x.toUpperCase();
const exclaim = (x) => x.concat("!");

const Fn = (run) => ({
  run,
  map(f) {
    return Fn((x) => f(run(x)));
  },
  chain(f) {
    // f() return another Fn
    // when you call .run(), it unwrapper Fn()
    return Fn((x) => f(run(x)).run(x));
  },
  concat(otherFn) {
    return Fn((x) => run(x).concat(otherFn.run(x)));
  },
});
Fn.of = (x) => Fn(() => x);
Fn.ask = Fn((x) => x);

const map = (f) => (x) => x.map(f);

const res = Fn(map(toUpper))
  .concat(Fn(map(exclaim)))
  .run(["Hello world"]);
console.log(res);

const res1 = Fn(toUpper).chain((upper) => Fn((x) => exclaim(upper)));

console.log(res1.run("hello"));

const res2 = Fn(toUpper).chain((upper) =>
  Fn.ask.map((config) => exclaim(upper))
);

console.log(res2.run("hello"));

const res3 = Fn.of("hi")
  .map(toUpper)
  .chain((upper) => Fn((config) => [upper, config]));

console.log(res3.run({ port: 3000 }));
