import {createOperation} from "../../core/operations"
import {LoadContext} from "src/core/loader/load-context"
import {LoadOptions} from "src/core/loader/types"
import {syncPoolOp} from "./sync-pool-op"
import {loaders} from "src/zui"
import env from "src/app/core/env"
import log from "electron-log"

export const loadFilesOp = createOperation(
  "loadFilesOp",
  async ({main}, options: LoadOptions) => {
    const opts = injectTestPaths(options)
    const context = new LoadContext(main, opts)
    const loader = await loaders.getMatch(context)
    try {
      await context.setup()
      await loader.run(context)
      await waitForPoolStats(context)
    } catch (e) {
      await loader.rollback(context)
      throw e
    } finally {
      context.teardown()
    }
  }
)

export type LoadFilesOp = typeof loadFilesOp

async function waitForPoolStats(context: LoadContext) {
  let tries = 0
  while (tries < 20) {
    tries++
    const pool = await syncPoolOp.run(context.lakeId, context.poolId)
    if (pool.hasStats() && pool.size > 0) break
    await new Promise((r) => setTimeout(r, 300))
  }
}

function injectTestPaths(options: LoadOptions) {
  if (
    env.isTest &&
    options.files.filter((f) => f !== "").length == 0 &&
    global.e2eFilePaths
  ) {
    options.files = global.e2eFilePaths
  }
  log.debug(options)
  return options
}
