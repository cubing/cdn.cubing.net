import { testURL } from "./testURL";

const testFastlyURL = testURL.bind(testURL, "https://cdn.cubing.net/");

const promises = [
  testFastlyURL("/", 200),
  testFastlyURL("/v0/js/cubing/twisty", 200),
  testFastlyURL("/robots.txt", 404),
];
await Promise.allSettled(promises);
await Promise.all(promises);

await import("./cdn-js/test-twisty-player");
