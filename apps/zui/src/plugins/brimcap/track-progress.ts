import fs from "fs"
import {compact} from "lodash"

export function trackProgress(sub, callback) {
  sub.stderr
    .once("data", () => sub.stdout.emit("start"))
    .on("data", (data) => {
      const lines = compact(data.toString().split("\n")) as string[]
      const stats = lines.map((line) => JSON.parse(line))
      stats.forEach(callback)
    })
}

function statusToPercent(status, totalSize): number {
  return status.pcap_read_size / totalSize || 0
}
