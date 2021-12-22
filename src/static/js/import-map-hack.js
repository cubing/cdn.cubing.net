// See https://twitter.com/lgarron/status/1438742427133612032

const importMap = {
  imports: {
    "cubing/alg": "https://cdn.cubing.net/js/cubing/alg",
    "cubing/bluetooth": "https://cdn.cubing.net/js/cubing/bluetooth",
    "cubing/kpuzzle": "https://cdn.cubing.net/js/cubing/kpuzzle",
    "cubing/notation": "https://cdn.cubing.net/js/cubing/notation",
    "cubing/protocol": "https://cdn.cubing.net/js/cubing/protocol",
    "cubing/puzzle-geometry":
      "https://cdn.cubing.net/js/cubing/puzzle-geometry",
    "cubing/puzzles": "https://cdn.cubing.net/js/cubing/puzzles",
    "cubing/scramble": "https://cdn.cubing.net/js/cubing/scramble",
    "cubing/search": "https://cdn.cubing.net/js/cubing/search",
    "cubing/stream": "https://cdn.cubing.net/js/cubing/stream",
    "cubing/twisty": "https://cdn.cubing.net/js/cubing/twisty",
    "scramble-display": "https://cdn.cubing.net/js/scramble-display",
    three: "https://cdn.cubing.net/js/three",
  },
};
const script = document.createElement("script");
script.type = "importmap";
script.textContent = JSON.stringify(importMap);

console.warn(
  "Loading the hacky cdn.cubing.net import map. This is experimental, only works in Chrome, and WILL slow down your page. Do not use it for any real apps."
);

document.write(new XMLSerializer().serializeToString(script));
