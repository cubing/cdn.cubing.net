const DEFAULT_MAX_NUM_ATTEMPTS = 5;

export async function attemptWithRetries<T>(
  attempt: () => Promise<T>,
  options?: { maxNumAttempts?: number },
): Promise<T> {
  const maxNumAttempts = options?.maxNumAttempts ?? DEFAULT_MAX_NUM_ATTEMPTS;
  for (let i = 0; i < maxNumAttempts; i++) {
    try {
      // Note: `await` is important here.
      return await attempt();
    } catch (e) {
      console.error(e);
    }
  }
  throw new Error(`Failed all ${maxNumAttempts} attempts.`);
}
