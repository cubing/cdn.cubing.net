# `cdn.cubing.net/esm`

For now, look at [here](./public/web_modules/.htaccess) for a list of packages.

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
