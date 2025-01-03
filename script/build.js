import { cp } from "node:fs/promises";
import { join } from "node:path";
import { build, context } from "esbuild";
import { removeEntryFileOutputFileExtensionsPlugin } from "./removeEntryFileOutputFileExtensionsPlugin.js";

const DIST_FOLDER = "./dist/web/cdn.cubing.net";
const DIST_FOLDER_V0 = join(DIST_FOLDER, "v0");

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
  external: [],
  sourceRoot: "./src/compiled/",
  chunkNames: "v0/js/chunks/[name]-[hash]",
  outdir: DIST_FOLDER,
  entryPoints: ["./src/compiled/**/*.ts"],
});

await build({
  ...commonOptions,
  loader: {
    ".ttf": "copy",
    ".woff": "copy",
    ".woff2": "copy",
  },
  sourceRoot: "./src/compiled/v0/css",
  outdir: join(DIST_FOLDER_V0, "css"),
  entryPoints: ["./src/compiled/v0/css/**/*.css"],
});

console.log("--------");
console.log("Copying stating files…");
await cp("./src/static", DIST_FOLDER, { recursive: true });
