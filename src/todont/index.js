// From: 6:17:00

import { over, lensProp, remove, append } from "ramda";
import { Fn } from "../libs/types";
const { ask } = Fn;

const L = {
  habits: lensProp("habits")
};

const Merge = x => ({
  x,
  concat: other => Merge(Object.assign({}, x, other.x))
});

const create = habit => Fn(ask.map(over(L.habits, append(habit))));
const destroy = ({ idx }) => Fn(ask.map(over(L.habits, remove(idx, 1))));

const setShowPage = Fn(() => Fn.of({ page: "show" }));
const setIndex = Fn(({ idx }) => Fn.of({ index: idx }));
const view = setIndex.concat(setShowPage);

const route = { create, destroy, view };

const appLoop = state =>
  renderApp(state, (state, action) => {
    return appLoop(
      Merge(state).concat(Merge(route[action].run(payload).run(state))).x
    );
  });
