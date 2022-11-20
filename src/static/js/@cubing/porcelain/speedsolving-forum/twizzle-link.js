if (!globalThis.twizzleLinkScript) {
  var script = document.createElement("script");
  globalThis.twizzleLinkScript = script;
  script.src = "https://cdn.cubing.net/js/cubing/twisty";
  script.type = "module";

  function append() {
    document.body.appendChild(script);
    const style = document.createElement("style");
    style.textContent = `
@font-face {
  font-family: "Ubuntu";
  src: url("https://cdn.cubing.net/font/ubuntu/Ubuntu-Regular.ttf");
}
twizzle-link {
  font-family: Ubuntu, -apple-system, Tahoma, sans-serif;
  color: black;
}
`;
    document.body.appendChild(style);
  }

  if (document.body) {
    append();
  } else {
    window.addEventListener("DOMContentLoaded", append);
  }
}
