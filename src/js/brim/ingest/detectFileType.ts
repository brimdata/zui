import {toNodeReadable} from "../../lib/response"
import fs from "fs"
import env from "src/app/core/env"

const PCAP_1_HEX = "d4c3b2a1"
const PCAP_2_HEX = "a1b2c3d4"
const PCAPNG_HEX = "0a0d0d0a"
const PCAPNANO_HEX = "4d3cb2a1"
const PCAP_HEXES = [PCAP_1_HEX, PCAP_2_HEX, PCAPNG_HEX, PCAPNANO_HEX]

export type IngestFileType = "pcap" | "log"

export default async function (file: File): Promise<IngestFileType> {
  if (isDirectory(file)) {
    throw new Error("EISDIR")
  } else if (await isPcap(file)) {
    return "pcap"
  } else {
    return "log"
  }
}

function isDirectory(file: File) {
  if (env.isIntegrationTest) return false // We don't have access to the path in integration tests...
  return fs.lstatSync(file.path).isDirectory()
}

async function isPcap(file: File) {
  let bytes = await firstBytes(file, 4)
  for (let hex of PCAP_HEXES) {
    if (bytes instanceof Buffer && bytes.equals(Buffer.from(hex, "hex")))
      return true
  }
  return false
}

function firstBytes(file: File, n: number) {
  return new Promise((res, rej) => {
    const stream = toNodeReadable(file.stream().getReader())
    stream
      .on("readable", () => {
        let buffer = stream.read(n)
        stream.destroy()
        res(buffer)
      })
      .on("error", rej)
  })
}
