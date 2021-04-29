import {createZealot} from "./mod.ts"
import {
  join,
  fromFileUrl,
  dirname
} from "https://deno.land/std@0.70.0/path/mod.ts"

const DIR = dirname(fromFileUrl(import.meta.url))
const ZED_LAKE_ROOT = join(DIR, "../lake_root")
const ZED_RUNNER = join(DIR, "../../../zdeps/zed")

function createDataDir() {
  try {
    Deno.mkdirSync(ZED_LAKE_ROOT)
  } catch (_) {}
}

function removeDataDir() {
  try {
    Deno.removeSync(ZED_LAKE_ROOT, {recursive: true})
  } catch (_) {}
}

async function kill(lake: Deno.Process, client: any) {
  removeDataDir()
  lake.close()
  await until(
    () =>
      client
        .status()
        .then(() => false)
        .catch(() => true),
    10_000,
    100,
    "Unable to kill lake process"
  )
}

async function start() {
  return Deno.run({
    cmd: [ZED_RUNNER, "lake", "serve", "-R", ZED_LAKE_ROOT],
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

export async function withLake(fn: (zealot: any) => any) {
  removeDataDir()
  createDataDir()
  const lake = await start()
  const zealot = createZealot("localhost:9867")
  await until(
    () =>
      zealot
        .status()
        .then((ok: string) => ok === "ok")
        .catch(() => false),
    10_000,
    1,
    "Unable to start zed lake"
  )
  try {
    await fn(zealot)
  } finally {
    await kill(lake, zealot)
  }
}

export function testApi(name: string, fn: (z: any) => any) {
  return Deno.test({
    name,
    only: name.startsWith("ONLY"),
    fn: () => withLake(fn)
  })
}
