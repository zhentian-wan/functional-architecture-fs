const { TestScheduler } = require("rxjs/testing");
const { of } = require("rxjs");

const { taskStartSubject, taskEndSubject, Spinner } = require("../2.js");

test("should works", () => {
  expect(true).toBe(true);
});
