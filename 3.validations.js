const { List } = require("immutable-ext");

const Success = x => ({
  x,
  isFail: false,
  concat: other => (other.isFail ? other : Success(x)),
  fold: (_, succ) => succ(x)
});

const Fail = x => ({
  x,
  isFail: true,
  concat: other => (other.isFail ? Fail(x.concat(other.x)) : Fail(x)),
  fold: (fail, _) => fail(x)
});

const Validation = run => ({
  run,
  concat: other => {
    return Validation((key, x) => run(key, x).concat(other.run(key, x)));
  }
});

const validate = (spec, obj) =>
  List(Object.keys(spec)).foldMap(key => {
    return spec[key].run(key, obj[key]);
  }, Success([obj]));

const isEmail = Validation((key, x) =>
  /@/.test(x) ? Success(x) : Fail([`${key} not a valid email`])
);

const isPresent = Validation((key, x) =>
  !!x ? Success(x) : Fail([`${key} need to be present`])
);

const validations = {
  name: isPresent,
  email: isPresent.concat(isEmail)
};
const obj = { name: "wan", email: "ztw.wan@gmail.com" };
const res = validate(validations, obj);

module.exports = validate;
