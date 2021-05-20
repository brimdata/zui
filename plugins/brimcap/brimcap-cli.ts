import {spawnSync, spawn, ChildProcess} from "child_process"
import {compact, isEmpty} from "lodash"
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
  json?: boolean
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
  compact(
    flatMap(
      Object.entries(opts).map(([k, v]) => {
        const optKey = `-${OPTION_NAME_MAP[k] || k}`
        // booleans flags don't use values, if opting in just include the key
        if (typeof v === "boolean" && v) return [optKey]
        // otherwise, if no value provided, don't include this option
        if (isEmpty(v)) return

        return [optKey, v]
      })
    )
  )

export default class BrimcapCLI {
  constructor(private binPath: string) {}

  public load(pcapPath: string, opts: loadOptions): ChildProcess {
    const subCommandWithArgs = ["load", ...toCliOpts(opts), pcapPath]

    return spawn(this.binPath, subCommandWithArgs)
  }

  public search(opts: searchOptions) {
    return this.exec("search", opts)
  }

  private exec(subCommand: string, opts: searchOptions) {
    const subCommandWithArgs = [subCommand, ...toCliOpts(opts)]

    return spawnSync(this.binPath, subCommandWithArgs)
  }
}
