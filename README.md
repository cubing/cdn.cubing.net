# `cdn.cubing.net`

## JavaScript Modules (`/esm`)

For now, look [here](./src/esm/public/web_modules/.htaccess) for a list of packages.

Example:

```html
<script type="module" defer>
  import "https://cdn.cubing.net/esm/scramble-display";
  import {
    algToString,
    invert,
    parse,
  } from "https://cdn.cubing.net/esm/cubing/alg";

  // Invert the scramble when you click the display.
  const disp = document.querySelector("#disp");
  disp.addEventListener("click", () => {
    disp.scramble = algToString(invert(parse(disp.scramble)));
  });
</script>
<scramble-display id="disp" scramble="R U R'"></scramble-display>
```

### Import Map

At <https://cdn.cubing.net/esm/import-map.json> . Most browsers don't support it yet.
