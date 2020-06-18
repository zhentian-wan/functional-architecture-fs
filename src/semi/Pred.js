// Ex2: model a predicate function :: a -> Bool and give it contramap() and concat(). i.e. make the test work
// =========================
const Pred = (run) => ({
  run,
  concat(otherP) {
    return Pred((x) => run(x) && otherP.run(x));
  },
  contramap(f) {
    return Pred((x) => run(f(x)));
  },
}); // todo

const p = Pred((x) => x > 4)
  .contramap((x) => x.length)
  .concat(Pred((x) => x.startsWith("s")));

const result = ["scary", "sally", "sipped", "the", "soup"].filter(p.run);

console.log(result == ["scary", "sally", "sipped"]);
