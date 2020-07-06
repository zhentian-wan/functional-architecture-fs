const { Task } = require("../../libs/types");
const { save, all } = require("../../libs/db");
const { last } = require("ramda");

const AuthorTable = "Authors";
const Author = (name) => ({ name });
const PostTable = "Posts";
const Post = (title, body) => ({ title, body });

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const formatPost = (post) => `${post.title}:\n${post.body}`;
const print = (s) =>
  Task((rej, res) => {
    res(console.log(s));
  });

const getInput = (q) =>
  Task((rej, res) => readline.question(q, (i) => res(i.trim())));

const menu = () =>
  getInput("where do you want to go today? (createAuthor, write, latest)").map(
    (route) => router[route]
  );

const createAuthor = () =>
  getInput("Name? ")
    .map((name) => Author(name))
    .chain((author) => save(AuthorTable, author))
    .map(() => menu);

const latest = () =>
  all(PostTable)
    .map((posts) => last(posts))
    .map(formatPost)
    .chain(print)
    .map(() => menu);

const write = () =>
  getInput("Title: ")
    .chain((title) => getInput("Body: ").map((body) => Post({ title, body })))
    .chain((post) => save(PostTable, post))
    .map(() => latest);

const start = () =>
  all(AuthorTable).map((authors) => (authors.length ? menu : createAuthor));

const router = { menu, createAuthor, latest, write };

const runApp = (f) => f().fork(console.error, runApp);

runApp(start);
