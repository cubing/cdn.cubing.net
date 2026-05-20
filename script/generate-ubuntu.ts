#!/usr/bin/env -S bun run --

import { argv } from "node:process";
import { command, constant, message, object, or } from "@optique/core";
import { run } from "@optique/run";
import { Path } from "path-class";

const NODE_MODULES_PATH = new Path("./node_modules/");
const PACKAGE_SPECIFIER = new Path("@fontsource/ubuntu/");
const UBUNTU_CSS_ENTRY_PATH = new Path(
  "./src/package-entries/v0/css/@fontsource/ubuntu.css",
);

function parseArgs() {
  return run(
    or(
      command(
        "check",
        object({
          type: constant("check"),
        }),
      ),
      command(
        "write",
        object({
          type: constant("write"),
        }),
      ),
    ),
    {
      programName: new Path(argv[1]).basename.path,
      description: message`Generate \`ubuntu\` entry point.`,
      help: "option",
      completion: {
        option: {
          names: ["--option"],
          hidden: false,
        },
      },
    },
  );
}

async function execute(args: ReturnType<typeof parseArgs>): Promise<void> {
  const lines: string[] = [];
  for (const path of (
    await NODE_MODULES_PATH.join(PACKAGE_SPECIFIER).readDir()
  ).sort()) {
    if (!path.endsWith(".css")) {
      continue;
    }
    lines.push(`@import ${JSON.stringify(PACKAGE_SPECIFIER.join(path).path)};`);
  }

  const contents = `${lines.join("\n")}\n`;

  switch (args.type) {
    case "check": {
      console.log(`Checking: ${UBUNTU_CSS_ENTRY_PATH.blue}`);
      if (contents !== (await UBUNTU_CSS_ENTRY_PATH.readText())) {
        throw new Error(
          `Invalid contents (needs regeneration?): ${UBUNTU_CSS_ENTRY_PATH.blue}`,
        );
      }
      break;
    }
    case "write": {
      console.log(`Writing: ${UBUNTU_CSS_ENTRY_PATH.blue}`);
      await UBUNTU_CSS_ENTRY_PATH.write(contents);
      break;
    }
    default:
      throw new Error("Invalid type.") as never;
  }
}

if (import.meta.main) {
  await execute(parseArgs());
}
