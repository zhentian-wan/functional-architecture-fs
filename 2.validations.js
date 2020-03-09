const { List } = require("immutable-ext");

const First = x => ({
  x,
  concat: _ => {
    return First(x);
  }
});

const Success = x => ({
  x,
  isFail: false,
  concat: other => {
    return other.isFail ? other : Success(x);
  },
  fold: (fail, succ) => {
    return succ(x);
  }
});

const Fail = x => ({
  x,
  isFail: true,
  concat: other => {
    return other.isFail ? Fail(x.concat(other.x)) : Fail(x);
  },
  fold: (fail, succ) => {
    return fail(x);
  }
});

const validate = (spec, obj) =>
  List(Object.keys(spec)).foldMap(key => {
    return spec[key](obj[key]) ? Success([obj]) : Fail([`${key} bad`]);
  }, Success([obj]));

const isPresent = x => !!x;

const validations = {
  name: isPresent,
  email: isPresent
};
const obj = { name: "wan", email: "ztw.wan@gmail.com" };
const res = validate(validations, obj);

res.fold(console.error, console.log);
