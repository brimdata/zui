import fs from "fs"
import {compact} from "lodash"

export function trackProgress(ctx, sub, stream) {
  const pcap = ctx.files[0]
  const totalSize = fs.statSync(pcap).size

  sub.stderr
    .once("data", () => sub.stdout.emit("start"))
    .on("data", (data) => {
      const lines = compact(data.toString().split("\n")) as string[]
      const stats = lines.map((line) => JSON.parse(line))
      stats.forEach((stat) => {
        const {type, ...status} = stat
        switch (type) {
          case "status":
            ctx.onProgress(statusToPercent(status, totalSize))
            ctx.onPoolChanged()
            break
          case "warning":
            if (status.warning) ctx.onWarning(status.warning)
            break
          case "error":
            if (status.error) stream.destroy(status.error)
            break
        }
      })
    })
}

function statusToPercent(status, totalSize): number {
  return status.pcap_read_size / totalSize || 0
}
