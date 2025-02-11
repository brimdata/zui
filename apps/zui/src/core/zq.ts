import * as zed from "@brimdata/zed-node"
import * as zdeps from "../electron/zdeps"

export const zq = ((opts) => {
  return zed.zq({...opts, bin: zdeps.superdb})
}) as typeof zed.zq

export const createReadableStream = ((opts) => {
  return zed.createReadableStream({...opts, bin: zdeps.zq})
}) as typeof zed.createReadableStream
