import { default as assert } from "node:assert";
import { KPattern, type KPatternData } from "cubing/kpuzzle";
import { cube3x3x3 } from "cubing/puzzles";
import type { TwistyPlayer } from "cubing/twisty";
import { chromium, devices } from "playwright";

async function attempt() {
  type GlobalThis = typeof globalThis & { player: TwistyPlayer };

  // Setup
  await using browser = await chromium.launch();
  await using context = await browser.newContext(devices["iPhone 11"]);
  await using page = await context.newPage();

  await page.goto(
    new URL("test-twisty-player.html", import.meta.url).toString(),
  );

  async function run(
    description: string,
    fn: () => Promise<void>,
  ): Promise<void> {
    try {
      await fn();
      console.log(`✅ ${description}`);
    } catch (e) {
      console.log(`❌ ${description}`);
      throw e;
    }
  }

  await run("<twisty-player> appears", async () => {
    await page.waitForSelector("twisty-player");
  });

  await run("<twisty-player> pattern", async () => {
    const patternData: KPatternData = await page.evaluate(async () => {
      return (
        await (
          globalThis as GlobalThis
        ).player.experimentalModel.currentPattern.get()
      ).patternData;
    });
    const observedKPattern = new KPattern(
      await cube3x3x3.kpuzzle(),
      patternData,
    );
    const expectedKPattern = new KPattern(await cube3x3x3.kpuzzle(), {
      EDGES: {
        pieces: [0, 3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      CORNERS: {
        pieces: [2, 3, 0, 1, 4, 5, 6, 7],
        orientation: [1, 0, 1, 1, 0, 0, 0, 0],
      },
      CENTERS: {
        pieces: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 0, 0, 0],
        orientationMod: [1, 1, 1, 1, 1, 1],
      },
    });
    assert(observedKPattern.isIdentical(expectedKPattern));
  });

  await run("<twisty-player> time range", async () => {
    const timeRange: { start: number; end: number } = await page.evaluate(
      () => {
        return (
          globalThis as GlobalThis
        ).player.experimentalModel.timeRange.get();
      },
    );
    assert(typeof timeRange === "object");
    assert.equal(timeRange.start, 0);
    assert.equal(timeRange.end, 7500);
  });

  await run("<twisty-player> screenshot", async () => {
    const screenshot = await page.evaluate(() =>
      (globalThis as GlobalThis).player.experimentalScreenshot(),
    );
    assert(screenshot.startsWith("data:image/png;base64,"));
  });
}

const MAX_NUM_ATTEMPTS = 5;
export async function attemptWithRetries(options?: { numRetries?: number }) {
  for (let i = 0; i < (options?.numRetries ?? MAX_NUM_ATTEMPTS); i++) {
    try {
      await attempt();
      return;
    } catch (e) {
      console.error(e);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  throw new Error("Failed all retries.");
}
