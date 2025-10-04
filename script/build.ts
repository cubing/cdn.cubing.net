import { cp, rm } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";
import { removeEntryFileOutputFileExtensionsPlugin } from "./removeEntryFileOutputFileExtensionsPlugin.js";

const DIST_FOLDER = "./dist/web/cdn.cubing.net";
const DIST_FOLDER_V0 = join(DIST_FOLDER, "v0");

console.log("--------");
console.log("Copying static files into a fresh distribution folder…");
await rm(DIST_FOLDER, { recursive: true, force: true });
await cp("./src/static", DIST_FOLDER, { recursive: true, errorOnExist: false });

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

await build({
  format: "esm",
  target: "es2020",
  splitting: true,
  ...commonOptions,
  external: [],
  sourceRoot: "./src/package-entries/",
  chunkNames: "v0/js/chunks/[name]-[hash]",
  outdir: DIST_FOLDER,
  entryPoints: ["./src/package-entries/**/*.ts"],
});

await build({
  ...commonOptions,
  loader: {
    ".woff": "copy",
    ".woff2": "copy",
  },
  sourceRoot: "./src/package-entries/v0/css",
  outdir: join(DIST_FOLDER_V0, "css"),
  entryPoints: ["./src/package-entries/v0/css/**/*.css"],
});

console.log("Done building.");
