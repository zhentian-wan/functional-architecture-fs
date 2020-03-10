const { List } = require("immutable-ext");

const Success = x => ({
  x,
  isFail: false,
  concat(otherM) {
    return otherM.isFail ? otherM : Success(x);
  }
});

const Fail = x => ({
  x,
  isFail: true,
  concat(otherM) {
    return otherM.isFail ? Fail(x.concat(otherM.x)) : Fail(x);
  }
});

const Validation = run => ({
  run,
  concat(otherM) {
    return Validation((key, x) => run(key, x).concat(otherM.run(key, x)));
  }
});

/////////////////

const isPresent = Validation((key, x) =>
  !!x ? Success(x) : Fail([`${key} is required`])
);
const isEmail = Validation((key, x) =>
  /@/.test(x) ? Success(x) : Fail([`${key} is not a valid email`])
);

const validate = (schema, obj) =>
  List(Object.keys(schema)).foldMap(
    key => schema[key].run(key, obj[key]),
    Success(obj)
  );

////////////////////

const validationSchema = {
  name: isPresent,
  email: isPresent.concat(isEmail)
};
const obj = {
  name: "Zhentian",
  email: "wan@wan.one"
};
const res = validate(validationSchema, obj);

console.log(res);
