import { Zealot } from "../../types.ts";
import { createZealot } from "../../zealot.ts";
const ZQD_ROOT = "../zqd";

function createDataDir() {
  try {
    Deno.mkdirSync(ZQD_ROOT);
  } catch (_) {
  }
}

function removeDataDir() {
  try {
    Deno.removeSync(ZQD_ROOT, { recursive: true });
  } catch (_) {
  }
}

async function kill(zqd: Deno.Process, client: Zealot) {
  removeDataDir();
  zqd.close();
  await until(
    () => client.status().then(() => false).catch(() => true),
    1000,
    "Unable to kill zqd process",
  );
}

async function start() {
  return Deno.run({
    cmd: ["zqd", "listen", "-zeekrunner", "zeek"],
    cwd: ZQD_ROOT,
    stdout: "null",
    stderr: "null",
  });
}

async function until(fn: () => Promise<boolean>, timeout: number, msg: string) {
  return new Promise(async (resolve, reject) => {
    const id = setTimeout(
      () => reject(new Error("Timed out: " + msg)),
      timeout,
    );
    async function check() {
      try {
        const result = (await fn());
        if (result) {
          clearTimeout(id);
          resolve();
        } else {
          setTimeout(check, 10);
        }
      } catch {
        setTimeout(check, 10);
      }
    }
    check();
  });
}

async function withZqd(fn: (zealot: Zealot) => any) {
  removeDataDir();
  createDataDir();
  const zqd = await start();
  const zealot = createZealot("localhost:9867");
  await until(
    () =>
      zealot
        .status()
        .then((ok: string) => ok === "ok")
        .catch(() => false),
    10_000,
    "Unable to start zqd",
  );
  try {
    await fn(zealot);
  } finally {
    await kill(zqd, zealot);
  }
}

export function testApi(name: string, fn: (z: Zealot) => any) {
  return Deno.test(name, () => withZqd(fn));
}
