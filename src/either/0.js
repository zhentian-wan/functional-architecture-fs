const Right = (x) => ({
  chain: (f) => f(x),
  map: (f) => Right(f(x)),
  fold: (f, g) => g(x),
  toString: `Right(${x})`,
});

const Left = (x) => ({
  chain: (f) => Left(x),
  map: (f) => Left(x),
  fold: (f, g) => f(x),
  toString: `Left(${x})`,
});

const fromNullable = (x) => (x ? Right(x) : Left(null));

const findColor = (name) =>
  ({
    red: "#ff4444",
    blue: "#3b5998",
    yellow: "#ffff68f",
  }[name]);

// const res = findColor("redd").toUpperCase();

const res = fromNullable(findColor("red"));
console.log(res.fold(console.error, console.log));
