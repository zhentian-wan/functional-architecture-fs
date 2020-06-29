const { TaskT, Task, Either } = require("../types");
const _ = require("lodash");

const TaskEither = TaskT(Either);

const users = [
  { id: 1, name: "Brian" },
  { id: 2, name: "Marc" },
  { id: 3, name: "Odette" },
];
const following = [
  { user_id: 1, follow_id: 3 },
  { user_id: 1, follow_id: 2 },
  { user_id: 2, follow_id: 1 },
];

const find = (table, query) =>
  TaskEither.lift(Either.fromNullable(_.find(table, query)));

const app = () =>
  find(users, { id: 1 }) // Task(Either(User))
    .chain((user) => find(following, { follow_id: user.id }))
    .chain((foUser) => find(users, { id: foUser.user_id }))
    .fork(console.error, (eu) => eu.fold(console.log, console.log));

app();

// TaskEither.of(Either) --> Task(Either(Either))
// TaskEither.lift(Either) --> Task(Either)
