import {LoadContext} from "./load-context"
import fs from "fs"
import {pipeline, Transform} from "stream"
import {Loader} from "./types"
import {createReadableStream} from "@brimdata/zed-node"

export const defaultLoader: Loader = {
  when() {
    return true
  },

  async run(ctx: LoadContext) {
    const client = await ctx.createClient()
    const files = ctx.files
    const totalBytes = files.reduce((sum, file) => sum + getFileSize(file), 0)

    let readBytes = 0
    function onChunk(chunk: Buffer, encoding: BufferEncoding) {
      readBytes += Buffer.byteLength(chunk, encoding)
      ctx.onProgress(readBytes / totalBytes)
    }

    const zq = createReadableStream({
      query: ctx.shaper,
      i: ctx.format,
      file: files,
    })
    let streamError = null
    const body = pipeline(zq, inspectStream(onChunk), (err) => {
      streamError = err
      if (err) ctx.abort()
    })
    let res
    try {
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
      if (streamError) throw new Error(streamError)
      else throw e
    }

    ctx.onProgress(0)
    for (const warning of res?.warnings ?? []) ctx.onWarning(warning)
    await ctx.onPoolChanged()
    ctx.onProgress(1)
  },

  rollback() {},
}

function getFileSize(path: string) {
  return fs.statSync(path).size
}

function inspectStream(fn) {
  return new Transform({
    transform(chunk, encoding, callback) {
      fn(chunk, encoding)

      callback(null, chunk)
    },
  })
}
