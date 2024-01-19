import errors from "src/js/errors"
import {createCli} from "./cli"

export function indexPcap(pcap: string, root: string) {
  if (pcap) {
    const cli = createCli()
    // in tests we may not have the pcapPath, so skip indexing for now
    try {
      cli.index({root, pcap})
    } catch (e) {
      console.error(e)
      throw errors.pcapIngest(e)
    }
  }
}
