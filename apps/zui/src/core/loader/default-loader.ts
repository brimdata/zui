import {LoadContext} from "./load-context"
import fs from "fs"
import {Transform} from "stream"
import {Loader} from "./types"
import {createStream} from "@brimdata/zed-node"
import MultiStream from "multistream"

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

    const zq = createStream({query: ctx.shaper, i: ctx.format})

    ctx.onProgress(0)
    const input = new MultiStream(files.map((f) => fs.createReadStream(f)))
    const data = input.pipe(zq).pipe(inspectStream(onChunk))
    const res = await client.load(data, {
      pool: ctx.poolId,
      branch: ctx.branch,
      format: ctx.format,
      message: {
        author: ctx.author,
        body: ctx.body,
      },
      signal: ctx.signal,
    })

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
