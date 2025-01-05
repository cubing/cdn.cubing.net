export async function testURL(
  origin: string,
  path: string,
  expectedStatus: number,
  options?: { setFastlyHeader?: boolean },
) {
  const url = new URL(path, origin);
  const headers: Record<string, string> = options?.setFastlyHeader
    ? { "Fastly-Client": "test" }
    : {};
  const { status } = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers,
  });
  if (status === expectedStatus) {
    console.log(`✅ ${url} ${JSON.stringify(options) ?? ""}
↪ status matches expected: ${expectedStatus}`);
  } else {
    console.log(`❌ ${url} ${JSON.stringify(options) ?? ""}
↪ expected status: ${expectedStatus}
↪ observed status: ${status}`);
    throw new Error("failure");
  }
}
