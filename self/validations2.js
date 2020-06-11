const { List } = require("immutable-ext");

const Success = (x) => ({
  x,
  isFail: false,
  concat(o) {
    return o.isFail ? o : Success(x);
  },
});

const Fail = (x) => ({
  x,
  isFail: true,
  concat(o) {
    return Fail(o.isFail ? x.concat(o.x) : x);
  },
});

// Validation takes a run function
// which return Success or Fail monids
// Validation only takes care of concatnation
const Validation = (run) => ({
  run,
  concat(o) {
    return Validation((key, x) => {
      return run(key, x).concat(o.run(key, x));
    });
  },
});

// Imp Or And

const isPresent = Validation((key, x) =>
  !!x ? Success([x]) : Fail([`${key} is required`])
);
const isEmail = Validation((key, x) =>
  /@/.test(x) ? Success([x]) : Fail([`${key} is not an email`])
);

const obj = { name: "", email: "" };
const validation = {
  name: isPresent,
  email: isPresent.concat(isEmail),
};
const validate = (schema, obj) => {
  return List(Object.keys(schema)).foldMap(
    (key) => schema[key].run(key, obj[key]),
    Success([obj])
  );
};
/**
 * Success: obj
 *
 * Error: Array<Error message>
 */
const res = validate(validation, obj);
console.log(res);
