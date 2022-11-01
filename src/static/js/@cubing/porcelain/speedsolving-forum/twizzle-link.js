if (!globalThis.twizzleLinkScript) {
  var script = document.createElement("script");
  globalThis.twizzleLinkScript = script;
  script.src = "https://cdn.cubing.net/js/cubing/twisty";
  script.type = "module";

  function append() {
    document.body.appendChild(script);
  }

  if (document.body) {
    append();
  } else {
    window.addEventListener("DOMContentLoaded", append);
  }
}
