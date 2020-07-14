const { Task } = require("../../libs/types");
const { save, all } = require("../../libs/db");
const { last } = require("ramda");
const { liftF } = require("../../libs/free");
const { Id } = require("../../libs/types.js");
const { taggedSum } = require("daggy");

const AuthorTable = "Authors";
const Author = (name) => ({ name });
const PostTable = "Posts";
const Post = (title, body) => ({ title, body });

/** real actions */
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const formatPost = (post) => `${post.title}\n${post.body}`;
const writeOutput = (s) =>
  Task((rej, res) => {
    console.log(s);
    res(s);
  });
const getInput = (q) =>
  Task((rej, res) => readline.question(q, (i) => res(i.trim())));

/** Mock data type */
const Console = taggedSum("Console", { Question: ["q"], Print: ["s"] });
const Db = taggedSum("Db", {
  Save: ["table", "record"],
  All: ["table", "query"],
});

/**Lift into free monads */
const print = (s) => liftF(Console.Print(s));
const question = (s) => liftF(Console.Question(s));
const dbAll = (table, query) => liftF(Db.All(table, query));
const dbSave = (table, record) => liftF(Db.Save(table, record));

/**App logics */
const menu = () =>
  question("where do you want to go today? (createAuthor, write, latest)").map(
    (route) => router[route]
  );

const createAuthor = () =>
  question("Name? ")
    .map((name) => Author(name))
    .chain((author) => dbSave(AuthorTable, author))
    .map(() => menu);

const latest = () =>
  dbAll(PostTable)
    .map((posts) => last(posts))
    .map(formatPost)
    .chain(print)
    .map(() => menu);

const write = () =>
  question("Title: ")
    .chain((title) => question("Body: ").map((body) => Post(title, body)))
    .chain((post) => dbSave(PostTable, post))
    .map(() => latest);

const start = () =>
  dbAll(AuthorTable).map((authors) => (authors.length ? menu : createAuthor));

const router = { menu, createAuthor, latest, write };

/** interpret */
const dbToTask = (x) =>
  x.cata({
    Save: save,
    All: all,
  });
const consoleToTask = (x) =>
  x.cata({
    Question: getInput,
    Print: writeOutput,
  });
const interpret = (x) => (x.table ? dbToTask(x) : consoleToTask(x));
const dbToId = (x) =>
  x.cata({
    Save: (table, r) => Id.of(`saving to ${r} ${table}`),
    All: (table, q) => Id.of(`query for ${q} ${table}`),
  });
const consoleToId = (x) =>
  x.cata({
    Question: (q) => Id.of(router[q]),
    Print: (s) => Id.of("writing the string " + s),
  });
const interpretTest = (x) => (x.table ? dbToId(x) : consoleToId(x));

/*const runApp = (f) =>
  f().foldMap(interpret, Task.of).fork(console.error, runApp);*/
const runApp = (f) => runApp(f().foldMap(interpretTest, Id.of).extract());

runApp(start);
