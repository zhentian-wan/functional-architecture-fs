const Id = x => ({
  map: f => Id(f(x)),
  chain: f => f(x),
  extract: () => x,
  concat: other => Id(x.concat(other.extract()))
});
Id.of = x => Id(x);

module.exports = {
  Id
};
