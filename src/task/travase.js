const Task = require("data.task");
const Either = require("data.either");
const { Right, Left } = Either;
const { List } = require("immutable-ext");

// Task
const httpGet = (path, params) => Task.of(`${path}: result`);

const getUser = (x) => httpGet("/user", { id: x });
const getTimeline = (x) => httpGet(`/timeline/${x}`, {});
const getAds = () => httpGet("/ads", {});

const res = List([getUser, getTimeline, getAds]).traverse(Task.of, (f) => f());
res.fork(console.log, (x) => console.log(x.toJS()));

// Either
const greaterThan5 = (x) =>
  x.length > 5 ? Right(x) : Left("not greater than 5");

const looksLikeEmail = (x) =>
  x.match(/@/gi) ? Right(x) : Left("not an email");

const email = "balhh@yada.com";
const res1 = List([greaterThan5, looksLikeEmail]).traverse(Either.of, (v) =>
  v(email)
);

res1.fold(console.log, (z) => console.log(z.toJS()));
