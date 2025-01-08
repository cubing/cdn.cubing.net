import { env, exit } from "node:process";

const HEALTHCHECK_SUCCESS_PING_URL_ENV_VAR = "HEALTHCHECK_SUCCESS_PING_URL";

const url = env[HEALTHCHECK_SUCCESS_PING_URL_ENV_VAR];

if (!url) {
  console.info(
    `Could not send a healthcheck success ping because env var is not set: ${HEALTHCHECK_SUCCESS_PING_URL_ENV_VAR}`,
  );
  exit(1);
}

await fetch(url);

export {};
