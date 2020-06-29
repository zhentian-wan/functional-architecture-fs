const { TaskT, Task, Either } = require("../types");
const { Right, Left } = Either;
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
  Task.of(Either.fromNullable(_.find(table, query)));

const app = () =>
  find(users, { id: 1 }) // Task(Either(User))
    .chain((eitherUser) =>
      eitherUser.fold(Task.rejected, (user) =>
        find(following, { follow_id: user.id })
      )
    )
    .chain((eitherUser) =>
      eitherUser.fold(Task.rejected, (foUser) =>
        find(users, { id: foUser.user_id })
      )
    )
    .fork(console.error, (eu) => eu.fold(console.error, console.log));

app();
