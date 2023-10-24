import fs from "fs"

const PCAP_1_HEX = "d4c3b2a1"
const PCAP_2_HEX = "a1b2c3d4"
const PCAPNG_HEX = "0a0d0d0a"
const PCAPNANO_HEX = "4d3cb2a1"
const PCAP_HEXES = [PCAP_1_HEX, PCAP_2_HEX, PCAPNG_HEX, PCAPNANO_HEX]

function firstBytes(filePath: string, n: number) {
  return new Promise((res, rej) => {
    const stream = fs.createReadStream(filePath)
    stream
      .on("readable", () => {
        let buffer = stream.read(n)
        stream.destroy()
        res(buffer)
      })
      .on("error", rej)
  })
}

export async function isPcap(filePath: string) {
  let bytes = await firstBytes(filePath, 4)
  for (let hex of PCAP_HEXES) {
    if (bytes instanceof Buffer && bytes.equals(Buffer.from(hex, "hex")))
      return true
  }
  return false
}
