const Max = (x) => ({
  x,
  concat(o) {
    return Max(Math.max(x, o.x));
  },
  fold() {
    return x;
  },
});
Max.empty = () => Max(Number.MIN_VALUE);
const Min = (x) => ({
  x,
  concat(o) {
    if (x === 0 && o.x === 0) {
      return Min.empty();
    } else if (x === 0 || o.x === 0) {
      return Min(x + o.x);
    } else {
      return Min(Math.min(x, o.x));
    }
  },
  fold() {
    return x;
  },
});
Min.empty = () => Min(Number.MAX_VALUE);

const Total = (x) => ({
  x,
  concat(o) {
    return Total(o.x + x);
  },
  fold() {
    return x;
  },
  toString() {
    return `Total(${x})`;
  },
});
Total.empty = () => Total(0);

const Points = (x) => ({
  x,
  concat(o) {
    return Points(x.concat(o.x));
  },
  fold() {
    return x;
  },
  toString() {
    return `Points([${x}])`;
  },
});
Points.empty = () => Points([]);

const First = (x) => ({
  x,
  concat(o) {
    if (x === undefined) {
      return First(o.x);
    }
    return First(x);
  },
  fold() {
    return x;
  },
  toString() {
    return `First(${x})`;
  },
});
First.empty = () => First(undefined);

const _Map = (x) => ({
  x,
  concat(o) {
    const obj = o.x;
    return _Map(
      Object.keys(obj).reduce((acc, key) => {
        return {
          ...acc,
          [key]: x[key].concat(obj[key]),
        };
      }, {})
    );
  },
  fold() {
    return Object.keys(x).reduce((acc, key) => {
      return {
        ...acc,
        [key]: x[key].fold(),
      };
    }, {});
  },
  toString() {
    return `_Map(${JSON.stringify(x, null, 2)})`;
  },
});
_Map.empty = (m) => _Map(m);

const AssignMap = (x) => ({
  x,
  concat(o) {
    const existingKeys = Object.keys(x);
    const newKey = Object.keys(o.x)[0];
    if (existingKeys.indexOf(newKey) === -1) {
      // create a new key
      return AssignMap({
        ...x,
        ...o.x,
      });
    }
    // updating the existing key
    const updates = x[newKey].concat(o.x[newKey]);
    return AssignMap({
      ...x,
      [newKey]: updates,
    });
  },
  fold() {
    return Object.keys(x).reduce((acc, key) => {
      return {
        ...acc,
        [key]: x[key].fold(),
      };
    }, {});
  },
  toString() {
    return `AssignMap(${JSON.stringify(x, null, 2)})`;
  },
});
AssignMap.empty = () => AssignMap({});

const List = (x) => ({
  x,
  foldMap(type, _empty) {
    const empty = _empty ? _empty : type.empty();
    if (!empty) throw new Error(`foldMap expect an empty as second value`);
    return x.map(type).reduce((acc, curr) => {
      return acc.concat(curr);
    }, empty);
  },
});

const Right = (x) => ({
  x,
  chain: (f) => f(x),
  map: (f) => Right(f(x)),
  concat: (o) => Right(x.concat(o.x)),
  fold: (f, g) => g(x),
  isRight: true,
  isLeft: false,
  toString: `Right(${x})`,
});

const Left = (x) => ({
  x,
  chain: (f) => Left(x),
  map: (f) => Left(x),
  concat: (o) => Left(x),
  fold: (f, g) => f(x),
  isRight: false,
  isLeft: true,
  toString: `Left(${x})`,
});

const Alternative = (ex) => ({
  ex,
  concat: (o) => Alternative(o.ex.isLeft ? ex : ex.concat(o.ex)),
});

/**
 *
 */
const identity = (i) => i;
const compose = (f, g) => (...args) => f(g(...args));
const converge = (combineFn, [fn1, fn2]) => (data) =>
  combineFn(fn1(data), fn2(data));

const getAllTimeStamps = (responses) => {
  const timeStampes = new Set();
  responses.forEach(({ data: datas }) => {
    datas.forEach(([timestamp]) => {
      timeStampes.add(timestamp);
    });
  });
  return [...timeStampes];
};
const getExistingTimeStamp = (datas) => {
  const timeStampes = new Set();
  datas.forEach(([timestamp]) => {
    timeStampes.add(timestamp);
  });
  return [...timeStampes];
};
const fillAllEmptyTimeStamps = (all, res) => {
  return res.map(({ data: datas }) => {
    let copy = [...datas];
    const existingTimeStamps = getExistingTimeStamp(datas);
    all.forEach((t) => {
      if (existingTimeStamps.indexOf(t) === -1) {
        copy.push([t, 0]);
      }
    });
    return copy;
  });
};

const getFilledResponses = converge(fillAllEmptyTimeStamps, [
  getAllTimeStamps,
  identity,
]);
const transformResponse = compose((res) => res.flat(1), getFilledResponses);

const dataToTimeSeries = ([time, point]) =>
  AssignMap({
    [time]: _Map({
      x: First(time),
      points: Points([point]),
      total: Total(point),
    }),
  });

const TimeSeries = {
  run(responses) {
    return transformResponse(responses)
      .reduce(
        (acc, data) => acc.concat(dataToTimeSeries(data)),
        AssignMap.empty()
      )
      .fold();
  },
};

const res = Alternative(Right("hello"))
  .concat(Alternative(Right("world")))
  .concat(Alternative(Left("errrr")))
  .concat(Alternative(Right("!!")));
console.log(res.ex.fold(identity, identity)); // helloworld!!

const res1 = List([
  Right("hello"),
  Right("world"),
  Left("errrr"),
  Right("!!!!"),
]).foldMap(Alternative, Alternative(Right("")));
console.log(res1.ex.fold(identity, identity)); // helloworld!!!!
