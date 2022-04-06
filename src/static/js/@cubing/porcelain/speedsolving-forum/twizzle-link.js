if (!globalThis.twizzleLinkScript) {
  var script = document.createElement("script");
  globalThis.twizzleLinkScript = script;
  script.src = "https://cdn.cubing.net/js/cubing/twisty";
  script.type = "module";

  console.log("script is", script);
  function append() {
    console.log("appending");
    document.body.appendChild(script);
  }

  if (document.body) {
    console.log("document.body exists");
    append();
  } else {
    console.log("listener");
    window.addEventListener("DOMContentLoaded", append);
  }
}
