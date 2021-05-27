import {createZealot} from "../../index"
import {join} from "path"
import fs from "fs-extra"
import {spawn, ChildProcess} from "child_process"

const DIR = __dirname
const ZED_LAKE_ROOT = join(DIR, "../lake_root")
const ZED_RUNNER = join(DIR, "../../../zdeps/zed")
const ADDR = "localhost:9119"
function createDataDir() {
  fs.mkdirSync(ZED_LAKE_ROOT)
}

function removeDataDir() {
  fs.removeSync(ZED_LAKE_ROOT)
}

async function kill(lake: ChildProcess, client: any) {
  removeDataDir()
  lake.kill()
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
  return spawn(ZED_RUNNER, ["lake", "serve", "-R", ZED_LAKE_ROOT, "-l", ADDR], {
    stdio: null, // make this "inherit" to debug a problem
    shell: true
  })
}

async function until(
  fn: () => Promise<boolean>,
  timeout: number,
  wait: number,
  msg: string
) {
  return new Promise<void>((resolve, reject) => {
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
  const zealot = createZealot(ADDR)
  await until(
    () =>
      zealot
        .status()
        .then((ok: string) => ok === "ok")
        .catch((_e) => false),
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
