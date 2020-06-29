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

QUnit.test("Ex2: pred", (assert) => {
  const p = Pred((x) => x > 4)
    .contramap((x) => x.length)
    .concat(Pred((x) => x.startsWith("s")));
  const result = ["scary", "sally", "sipped", "the", "soup"].filter(p.run);
  assert.deepEqual(result, ["scary", "sally", "sipped"]);
});

// Ex3:
// =========================
const extension = (file) => file.name.split(".")[1];

const matchesAny = (regex) => (str) => str.match(new RegExp(regex, "ig"));

const matchesAnyP = (pattern) => Pred(matchesAny(pattern)); // Pred(str => Bool)

// TODO: rewrite using matchesAnyP. Take advantage of contramap and concat
// const ex3 = file =>
//	matchesAny('txt|md')(extension(file)) && matchesAny('functional')(file.contents)
const ex3 = (file) =>
  matchesAnyP("txt|md")
    .contramap((f) => extension(f))
    .concat(matchesAnyP("functional").contramap((f) => f.contents))
    .run(file);

QUnit.test("Ex3", (assert) => {
  const files = [
    { name: "blah.dll", contents: "2|38lx8d7ap1,3rjasd8uwenDzvlxcvkc" },
    {
      name: "intro.txt",
      contents: "Welcome to the functional programming class",
    },
    { name: "lesson.md", contents: "We will learn about monoids!" },
    {
      name: "outro.txt",
      contents:
        "Functional programming is a passing fad which you can safely ignore",
    },
  ];

  assert.deepEqual([files[1], files[3]], files.filter(ex3));
});
