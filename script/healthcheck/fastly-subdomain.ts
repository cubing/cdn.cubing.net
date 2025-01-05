import { testURL } from "./testURL";

const testFastlyURL = testURL.bind(testURL, "https://cdn.fastly.cubing.net/");

const promises = [
  // The world should not have access to the URLs we use to serve to Fastly (since this is an implementation detail and we want to mitigate Hyrum's law: https://www.hyrumslaw.com/).
  testFastlyURL("/", 403),
  testFastlyURL("/v0/js/cubing/twisty", 403),
  // The world should have access to the robots.txt (which denies indexing).
  testFastlyURL("/robots.txt", 200),
  // The world should have access to `/.well-known` to support Dreamhost's naïve implementation. (404 instead of 200 is expected since the folder has no index; what matters is that it's not a 403).
  testFastlyURL("/.well-known/", 404),
  // Fastly should not have access to robots.txt (so that it doesn't mirror the indexing denial to the public CDN domain).
  testFastlyURL("/robots.txt", 404, { setFastlyHeader: true }),
  // Fastly should have access to normal URLs.
  testFastlyURL("/", 200, { setFastlyHeader: true }),
  testFastlyURL("/v0/js/cubing/twisty", 200, { setFastlyHeader: true }),
];
await Promise.allSettled(promises);
await Promise.all(promises);

export {};
