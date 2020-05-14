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
const tryCatch = (fn) => {
  try {
    const result = fn();
    return Right(result);
  } catch (e) {
    return Left(e);
  }
};
const findColor = (name) =>
  ({
    red: "#ff4444",
    blue: "#3b5998",
    yellow: "#ffff68f",
  }[name]);

// const res = findColor("redd").toUpperCase();

const res = fromNullable(findColor("red"));
console.log(res.fold(console.error, console.log));

const _getPost = () => {
  try {
    const str = fs.readFileSync("config.json");
    const config = JSON.parse(str);
    return config.port;
  } catch (e) {
    return 3000;
  }
};

const readFileSync = (path) => tryCatch(() => fs.readFileSync(path));
const parseJSON = (content) => tryCatch(() => JSON.parse(content));
const getPost = () => {
  return readFileSync("config.json")
    .chain(parseJSON)
    .map((c) => c.port)
    .fold(
      () => 3000,
      (x) => x
    );
};

const _parseDbUrl = (cfg) =>
  tryCatch(() => JSON.parse(cfg))
    .map((c) => c.url.match(DB_REGEX))
    .fold(
      () => null,
      (x) => x
    );

const _parseDbUrl = (cfg) =>
  Right(cfg)
    .chain(() => tryCatch(() => JSON.parse(cfg)))
    .map((c) => c.url.match(DB_REGEX))
    .fold(
      () => null,
      (x) => x
    );
