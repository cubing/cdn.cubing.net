import { join, parse } from "node:path";
import { rename } from "fs/promises";

const ENTRY_POINTS_COMMON_PREFIX = "src/";

// Removes file extensions from the output files that come from input files (but
// not from e.g. chunks). Currently includes some hardcoded assumptions for
// `cdn.cubing.net`.
//
// For example, `./src/js/cubing/alg.ts` is normally built to
// `./dist/web/cdn.cubing.net/js/cubing/alg.js` by `esbuild`. This plugin
// effectively removes the `.js` extension by moving the built entry point to
// `./dist/web/cdn.cubing.net/js/cubing/alg`
export const removeEntryFileOutputFileExtensionsPlugin = {
  name: "remove-entry-file-output-file-extensions",
  setup(build) {
    build.onEnd(async (result) => {
      // TODO: Why is `result.outputFiles` not always present/iterable?

      console.log("--------");
      for (const [outputFileName, info] of Object.entries(
        result.metafile.outputs,
      )) {
        // TODO: This is a total hack, because:
        // - I can't find an obvious way to tell which `esbuild` outputs come from the `entryPoints` option.
        // - `node:path` doesn't have a sensible way to check whether a path is contained in a folder.
        const movePromises = [];
        if (info.entryPoint?.startsWith(ENTRY_POINTS_COMMON_PREFIX)) {
          const { dir, name } = parse(outputFileName);
          const newOutputFileName = join(dir, name);
          console.log(`${outputFileName} → ${newOutputFileName}`);
          movePromises.push(rename(outputFileName, newOutputFileName));
        }
        await Promise.all(movePromises);
      }
    });
  },
};
