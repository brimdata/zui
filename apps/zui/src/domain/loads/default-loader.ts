import {LoadContext} from "./load-context"
import fs from "fs"
import {pipeline, Transform} from "stream"
import {Loader} from "./types"
import {createReadableStream} from "@brimdata/zed-node"
import {throttle} from "lodash"

export const defaultLoader: Loader = {
  when() {
    return true
  },

  async run(ctx: LoadContext) {
    const client = await ctx.createClient()
    const progress = createProgressTracker(ctx)
    const shaper = createShaper(ctx)

    let streamError = null
    const body = pipeline(shaper, progress, (err) => {
      streamError = err
      if (err) ctx.abort()
    })

    let res
    try {
      ctx.onProgress(0)
      res = await client.load(body, {
        pool: ctx.poolId,
        branch: ctx.branch,
        message: {
          author: ctx.author,
          body: ctx.body,
        },
        signal: ctx.signal,
      })
    } catch (e) {
      ctx.onProgress(null)
      if (streamError) throw new Error(streamError)
      else throw e
    }
    for (const warning of res?.warnings ?? []) ctx.onWarning(warning)
    await ctx.onPoolChanged()
    ctx.onProgress(1)
  },

  rollback() {},
}

function getFileSize(path: string) {
  return fs.statSync(path).size
}

function createShaper(ctx) {
  return createReadableStream({
    query: ctx.shaper,
    i: ctx.format,
    file: ctx.files,
  })
}

function createProgressTracker(ctx) {
  const onProgress = throttle((n) => ctx.onProgress(n), 500)

  let total = ctx.files.reduce((sum, file) => sum + getFileSize(file), 0)
  let bytes = 0
  return new Transform({
    transform(chunk, encoding, callback) {
      bytes += Buffer.byteLength(chunk, encoding)
      onProgress(bytes / total)
      callback(null, chunk)
    },
  })
}