#!/usr/bin/env bun

import { exit } from "node:process";
import { $ } from "bun";
import {
  binary,
  string as cmdString,
  command,
  positional,
  run,
} from "cmd-ts-too";

//TODO: add safety features from https://github.com/lgarron/dotfiles/blob/254b7f26464dff58f4c58cf03c3b07996628bb33/scripts/web/bun-roll.fish

const app = command({
  name: "bump-package-commit",
  description: "Example: bump-package-commit cubing",
  args: {
    npmPackage: positional({
      type: cmdString,
      displayName: "package",
    }),
  },
  handler: async ({ npmPackage }) => {
    if ((await $`git status --porcelain`.text()).trim() !== "") {
      console.error("`git status` must be clean");
      exit(1);
    }

    const version = (await $`npm show ${npmPackage} version`.text()).trim();

    const currentDependencyVersion: string = (
      await $`npm ls cubing --json`.json()
    ).dependencies.cubing.version;
    if (currentDependencyVersion === version) {
      console.log(`Current version matches latest from \`npm\`: ${version}`);
      console.log("Exiting (without error).");
      exit(0);
    }

    console.log(`Rolling \`${npmPackage}\` to version: v${version}`);

    await $`bun add "${npmPackage}@v${version}`;
    await $`git stage package.json bun.lock`;
    await $`git commit -m "\`bun add "${npmPackage}@v${version}\`"`;
  },
});

await run(binary(app), process.argv);
