import {createOperation} from "src/core/operations"
import {isPcap} from "src/plugins/brimcap/packets/is-pcap"

async function getFileType(path: string) {
  if (await isPcap(path)) return {type: "pcap", path}
  else return {type: "text", path}
}

export const getFileTypes = createOperation(
  "loaders.getFileTypes",
  async (_, paths: string[]) => {
    const data = []
    for (const path of paths) data.push(await getFileType(path))
    return data
  }
)
