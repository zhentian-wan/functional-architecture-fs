const Task = require("data.task");
const { save, all } = require("../../libs/db.js");
const { last } = require("ramda");
const { liftF } = reuqire("../libs/free");
const { taggedSum } = require("daggy");

const Console = taggedSum("Console", {
  Question: ["q"],
  Print: ["s"]
});
const Db = taggedSum("Db", {
  Save: ["table", "record"],
  All: ["table", "query"]
});

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const wirteOutput = s => Task((rej, res) => res(console.log(s)));
const getInput = q =>
  new Task((rej, res) => {
    readline.question(q, i => res(i.trim()));
  });

const AuthorTable = "authors";
const PostTable = "Post";
const Author = name => ({ name });
const Post = (title, body) => ({ title, body });

const formatPost = post => `${post.title}:\n${post.body}`;

const print = s => liftF(Console.Print(s));
const question = s => liftF(Console.Question(s));

const dbAll = (table, query) => liftF(Db.All(table, query));
const dbSave = (table, record) => liftF(Db.save(table, record));

const latest = () =>
  dbAll(PostTable)
    .map(posts => last(posts))
    .map(formatPost)
    .chain(print)
    .map(() => menu);

const write = () =>
  question("Title: ")
    .chain(title => question("Body: ").map(body => Post(title, body)))
    .chain(post => dbSave(PostTable, post))
    .map(() => latest);

const createAuthor = () =>
  question("Name? ")
    .map(name => Author(name))
    .chain(author => dbSave(AuthorTable, author))
    .map(() => menu);

// () -> Task() -> Task () ->
const menu = () =>
  question("Where do you want to go today? (crateAuthor, write, latest)").map(
    choose => router[choose]
  );

const start = () =>
  all(AuthorTable).map(authors => (authors.length ? menu : createAuthor));
const router = { menu, createAuthor, write, latest };

const dbToTask = x =>
  x.cata({
    Save: save,
    All: all
  });
const consoleToTask = x =>
  x.cata({
    Question: getInput,
    Print: writeOutput
  });
const interpret = x => (x.table ? dbToTask(x) : consoleToTask(x));

const runApp = f =>
  f()
    .foldMap(interpret, Task.of)
    .fork(console.error, runApp);

runApp(start);
// Until: 6:08:00
