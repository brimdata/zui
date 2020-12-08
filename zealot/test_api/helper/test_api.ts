import {createZealot} from "./mod.ts"
import {
  join,
  fromFileUrl,
  dirname
} from "https://deno.land/std@0.70.0/path/mod.ts"

const DIR = dirname(fromFileUrl(import.meta.url))
const ZQD_ROOT = join(DIR, "../zqd_root")
const ZEEK_RUNNER = join(DIR, "../../../zdeps/zeek/zeekrunner")
const ZQD_RUNNER = join(DIR, "../../../zdeps/zqd")

function createDataDir() {
  try {
    Deno.mkdirSync(ZQD_ROOT)
  } catch (_) {}
}

function removeDataDir() {
  try {
    Deno.removeSync(ZQD_ROOT, {recursive: true})
  } catch (_) {}
}

async function kill(zqd: Deno.Process, client: any) {
  removeDataDir()
  zqd.close()
  await until(
    () =>
      client
        .status()
        .then(() => false)
        .catch(() => true),
    10_000,
    100,
    "Unable to kill zqd process"
  )
}

async function start() {
  return Deno.run({
    cmd: [ZQD_RUNNER, "listen", "-zeekrunner", ZEEK_RUNNER],
    cwd: ZQD_ROOT,
    stdout: "null",
    stderr: "null"
  })
}

async function until(
  fn: () => Promise<boolean>,
  timeout: number,
  wait: number,
  msg: string
) {
  return new Promise<void>(async (resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Timed out: " + msg)), timeout)
    async function check() {
      try {
        const result = await fn()
        if (result) {
          clearTimeout(id)
          resolve()
        } else {
          setTimeout(check, wait)
        }
      } catch {
        setTimeout(check, wait)
      }
    }
    check()
  })
}

export async function withZqd(fn: (zealot: any) => any) {
  removeDataDir()
  createDataDir()
  const zqd = await start()
  const zealot = createZealot("localhost:9867")
  await until(
    () =>
      zealot
        .status()
        .then((ok: string) => ok === "ok")
        .catch(() => false),
    10_000,
    1,
    "Unable to start zqd"
  )
  try {
    await fn(zealot)
  } finally {
    await kill(zqd, zealot)
  }
}

export function testApi(name: string, fn: (z: any) => any) {
  return Deno.test({
    name,
    only: name.startsWith("ONLY"),
    fn: () => withZqd(fn)
  })
}
