import {spawnSync, spawn, ChildProcess} from "child_process"
import flatMap from "lodash/flatMap"

interface packetOptions {
  dstIp?: string
  dstPort?: string
  duration?: string
  proto?: string
  srcIp?: string
  srcPort?: string
  ts?: string
}

export interface loadOptions {
  config?: string
  n?: number
  root: string
  pool: string
  suricata?: boolean
  suricataStderr?: string
  suricataStdout?: string
  zeek?: boolean
  zeekStdout?: string
  zeekStderr?: string
}

export interface searchOptions extends packetOptions {
  root: string
  write: string
}

const OPTION_NAME_MAP = {
  pool: "p",
  suricataStderr: "suricata.stderr",
  suricataStdout: "suricata.stdout",
  zeekStdout: "zeek.stdout",
  zeekStderr: "zeek.stderr",
  write: "w",
  dstIp: "dst.ip",
  dstPort: "dst.port",
  srcIp: "src.ip",
  srcPort: "src.port"
}

const toCliOpts = (opts: loadOptions | searchOptions): string[] =>
  flatMap(
    Object.entries(opts).map(([k, v]) => [`-${OPTION_NAME_MAP[k] || k}`, v])
  )

export default class BrimcapCLI {
  constructor(private binPath: string) {}

  public load(pcapPath: string, opts: loadOptions): ChildProcess {
    const subCommandWithArgs = ["load", ...toCliOpts(opts), pcapPath]

    return spawn(this.binPath, subCommandWithArgs, {detached: true})
  }

  public search(opts: searchOptions) {
    return this.exec("search", opts)
  }

  private exec(subCommand: string, opts: searchOptions) {
    const subCommandWithArgs = [subCommand, ...toCliOpts(opts)]

    return spawnSync(this.binPath, subCommandWithArgs)
  }
}
