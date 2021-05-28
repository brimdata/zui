import {createZealot} from "zealot"
import {join} from "path"
import fs from "fs-extra"
import {spawn, ChildProcess} from "child_process"

function createDataDir(root) {
  fs.mkdirSync(root)
}

function removeDataDir(root) {
  fs.removeSync(root)
}

async function kill(lake: ChildProcess, client: any) {
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

async function start(runner, root, addr) {
  return spawn(runner, ["lake", "serve", "-R", root, "-l", addr], {
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

type Config = {
  addr?: string
  root?: string
  runner?: string
}

export async function withLake(fn: (zealot: any) => any, config: Config = {}) {
  const DIR = __dirname
  const ZED_LAKE_ROOT = join(DIR, "../lake_root")
  const ZED_RUNNER = join(DIR, "../../../zdeps/zed")
  const ADDR = "localhost:9119"

  const root = config.root || ZED_LAKE_ROOT
  const runner = config.runner || ZED_RUNNER
  const addr = config.addr || ADDR

  removeDataDir(root)
  createDataDir(root)

  const lake = await start(runner, root, addr)
  const zealot = createZealot(addr)
  await until(
    () =>
      zealot
        .status()
        .then((ok: string) => ok === "ok")
        .catch((e) => {
          if (!/ECONNREFUSED/.test(e.toString())) {
            console.log(e)
          }
          return false
        }),
    10_000,
    1,
    "Unable to start zed lake"
  )
  try {
    await fn(zealot)
  } finally {
    removeDataDir(root)
    await kill(lake, zealot)
  }
}
