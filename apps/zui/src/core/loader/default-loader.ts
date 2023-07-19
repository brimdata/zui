import {LoadContext} from "./load-context"
import fs from "fs"
import {Transform} from "stream"
import {Loader} from "./types"

export const defaultLoader: Loader = {
  when() {
    return true
  },

  async run(ctx: LoadContext) {
    const client = await ctx.createClient()
    const files = ctx.files
    const totalBytes = files.reduce((sum, file) => sum + getFileSize(file), 0)
    let readBytes = 0

    ctx.onProgress(0)

    for (const file of files) {
      const progress = new Transform({
        transform(chunk, encoding, callback) {
          readBytes += Buffer.byteLength(chunk, encoding as BufferEncoding)
          ctx.onProgress(readBytes / totalBytes)
          callback(null, chunk)
        },
      })
      const data = fs.createReadStream(file).pipe(progress)
      const res = await client.load(data, {
        pool: ctx.poolId,
        branch: ctx.branch,
        format: ctx.format,
        message: {
          author: "zui",
          body: "automatic import of " + file,
        },
        signal: ctx.signal,
      })
      for (const warning of res?.warnings ?? []) ctx.onWarning(warning)
    }
    await ctx.onPoolChanged()
    ctx.onProgress(1)
  },

  rollback() {},
}

function getFileSize(path: string) {
  return fs.statSync(path).size
}
