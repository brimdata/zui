import {createOperation} from "../operations"
import {LoadContext} from "src/core/loader/load-context"
import {LoadOptions} from "src/core/loader/types"
import {syncPoolOp} from "./sync-pool-op"
import {brimcapLoader} from "src/plugins/brimcap/loader"
import {defaultLoader} from "src/core/loader/default-loader"

const loaders = [brimcapLoader]

export const loadFilesOp = createOperation(
  "loadFilesOp",
  async ({main, event}, options: LoadOptions) => {
    const context = new LoadContext(main, event, options)
    const loader = await getLoader(context)
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

async function getLoader(context) {
  let loader = defaultLoader
  for (const l of loaders) {
    if (await l.when(context)) {
      loader = l
      break
    }
  }
  return loader
}
