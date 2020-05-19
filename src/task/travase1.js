const Task = require("data.task");
const Either = require("data.either");
const { Right, Left } = Either;

const eitherToTask = (e) => e.fold(Task.rejected, Task.of);
const fake = (id) => ({
  id,
  name: "user1",
  best_friend_id: id + 1,
});

const Db = {
  find: (id) =>
    new Task((rej, res) =>
      setTimeout(() => res(id > 2 ? Right(fake(id)) : Left("not found")), 100)
    ),
};

const send = (code, json) =>
  console.log(`sending ${code}: ${JSON.stringify(json)}`);

// FROM
Db.find(3) // Task(Either(user))
  .chain((eu) =>
    eu.fold(
      (e) => Task.of(eu),
      (u) => Db.find(u.best_friend_id)
    )
  )
  .fork(
    (error) => send(500, { error }),
    (eu) =>
      eu.fold(
        (error) => send(404, { error }),
        (x) => send(200, x)
      )
  );

// TO
Db.find(3) // Task(Either(user))
  .chain(eitherToTask) // Task(user))
  .chain((u) => Db.find(u.best_friend_id)) // Task(Either(user))
  .chain(eitherToTask) //Task(user))
  .fork(
    (error) => send(500, { error }),
    (u) => send(200, u)
  );
