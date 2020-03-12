const { List } = require("immutable-ext");

const Success = x => ({
  x,
  isFail: false,
  concat(o) {
    return o.isFail ? o : Success(x);
  }
});

const Fail = x => ({
  x,
  isFail: true,
  concat(o) {
    return o.isFail ? Fail(x.concat(o.x)) : Fail(x);
  }
});

const Validation = run => ({
  run,
  concat(o) {
    return Validation((key, x) => run(key, x).concat(o.run(key, x)));
  }
});

/////////////////

const isPresent = Validation((key, x) =>
  !!x ? Success(x) : Fail([`${key} is required`])
);
const isEmail = Validation((key, x) =>
  /@/.test(x) ? Success(x) : Fail([`${key} is not an Eamil`])
);

const validate = (schema, obj) => {
  return List(Object.keys(schema)).foldMap(key => {
    return schema[key].run(key, obj[key]);
  }, Success(obj));
};

////////////////////

const validationSchema = {
  name: isPresent,
  email: isPresent.concat(isEmail)
};
const obj = {
  name: "Zhentian",
  email: "s@s.com"
};
const res = validate(validationSchema, obj);

console.log(res);
