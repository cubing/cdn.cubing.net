import { build, context } from "esbuild";
import { join } from "node:path";
import { removeEntryFileOutputFileExtensionsPlugin } from "./removeEntryFileOutputFileExtensionsPlugin.js";
import { cp } from "node:fs/promises";

const DIST_CDN = "./dist/cdn.cubing.net";

// We could try to combine the JS and CSS build using options like `chunkNames:
// "[ext]/[name]-[hash]"`, but this seems to place the `.woff[2]` files one
// folder too high. So we keep the builds separate for now, and just share common options.
const commonOptions = {
  bundle: true,
  minify: true,
  sourcemap: true,
  metafile: true, // needed for the plugin
  plugins: [removeEntryFileOutputFileExtensionsPlugin],
};

const result = await build({
  format: "esm",
  target: "es2020",
  splitting: true,
  ...commonOptions,
  external: ["node:*"],
  sourceRoot: "./src/js",
  chunkNames: "chunks/[name]-[hash]",
  outdir: join(DIST_CDN, "js"),
  entryPoints: [
    "./src/js/**/*.ts",
    {
      // Hardcode the search worker entry to avoid error messages in Firefox.
      // TODO: Remove this if https://github.com/evanw/esbuild/issues/312 or https://github.com/evanw/esbuild/issues/2866 is ever implemented.
      in: "node_modules/cubing/dist/cubing/search-worker-entry.js",
      out: "chunks/search-worker-entry",
    },
  ],
});

await build({
  ...commonOptions,
  loader: {
    ".woff": "copy",
    ".woff2": "copy",
  },
  sourceRoot: "./src/css",
  outdir: join(DIST_CDN, "css"),
  entryPoints: ["./src/css/**/*.css"],
});

console.log("--------");
console.log("Copying stating files…");
await cp("./src/static", DIST_CDN, { recursive: true });
