const fs = require("fs");
const Task = require("data.task");
const Either = require("data.either");
const Id = (i) => i;
const { Right, Left, fromNullable } = Either;
const { List, Map } = require("immutable-ext");
