const { liftF } = require("../free");
const { Id } = require("../types");
const { taggedSum } = require("daggy");

/**
 * Data type to repersent function:
 *
 *
 * httpGet = url => HttpGet(url)
 *
 * HttpGet(url)
 *  .chain(contents => HttpPost('/ayalytics', contents))
 *
 */

const Http = taggedSum("Http", {
  Get: ["url"],
  Post: ["url", "body"],
});

// Free Http Get
const httpGet = (url) => liftF(Http.Get(url));
// Free Http Post
const httpPost = (url, body) => liftF(Http.Post(url, body));

const interpret = (x) =>
  x.cata({
    Get: (url) => Id.of(`contents for ${url}`),
    Post: (url, body) => Id.of(`Post ${body} to ${url}`),
  });

const app = () =>
  httpGet("/home").chain((contents) => httpPost("/analytics", contents));

const res = app().foldMap(interpret, Id.of);

console.log(res.extract());
