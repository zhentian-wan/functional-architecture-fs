const Reader = run => ({
  run,
  map: f => Reader(x => f(run(x))),
  chain: f => Reader(x => f(run(x)).run(x)),
  concat(o) {
    return Reader(x => run(x).concat(o.run(x)));
  }
});
Reader.of = x => Reader(() => x);
Reader.ask = Reader(x => x).map;

const prefix = s => m => `${s}${m}`;
const prefixHttps = prefix("https://");
const prefixHttp = prefix("http://");

const res = Reader.of("localhost")
  .chain(host =>
    Reader.ask(config => (config.https ? prefixHttps(host) : prefixHttp(host)))
  )
  .chain(domain =>
    Reader.ask(config => `${domain.concat(":").concat(config.port)}`)
  )
  .run({ port: 3000, https: true });

console.log(res); // https://localhost:3000
