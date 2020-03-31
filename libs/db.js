const Task = require("data.task");
const Either = require("data.either");
const I = require("immutable-ext");

const genId = table => table.count();

const addRecord = (table, record) => Task.of(table.push(record));

const getAll = table => Task.of(table.toJS());

const queryAll = (table, query) =>
  Task.of(table.filter((v, k) => query[k] === v));

// db
const addId = (obj, table) => Object.assign({ id: genId(table) }, obj);

const save = (tableName, obj) =>
  loadTable(tableName)
    .chain(table => addRecord(table, addId(obj, table)))
    .chain(newTable => store(tableName, newTable));

const all = tableName => loadTable(tableName).chain(table => getAll(table));

const find = (tableName, query) =>
  loadTable(tableName).chain(table => queryAll(table, query));

module.exports = { save, find, all, STORE };
