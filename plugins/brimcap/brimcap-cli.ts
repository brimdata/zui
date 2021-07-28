import env from "app/core/env"
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

export interface indexOptions {
  root: string
  pcap: string
}

export interface analyzeOptions {
  config?: string
  suricata?: boolean
  suricataStderr?: string
  suricataStdout?: string
  zeek?: boolean
  zeekStdout?: string
  zeekStderr?: string
  utf8?: boolean
  showTypes?: boolean
  showFields?: boolean
  color?: boolean
  lz4Blocksize?: number
  pretty?: number
  columnThresh?: number
  skewThresh?: number
  dir?: string
  out?: string
  json?: boolean
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
  srcPort: "src.port",
  utf8: "U",
  showTypes: "T",
  showFields: "F",
  lz4Blocksize: "znglz4blocksize",
  pretty: "pretty",
  columnThresh: "coltresh",
  skewThresh: "skewtresh",
  dir: "d",
  out: "o",
  pcap: "r"
}

const toCliOpts = (
  opts: searchOptions | analyzeOptions | indexOptions
): string[] =>
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

  index(opts: indexOptions) {
    return this.exec("index", opts)
  }

  analyze(
    pcapPath: string,
    opts: analyzeOptions,
    signal?: AbortSignal
  ): ChildProcess {
    const subCommandWithArgs = ["analyze", ...toCliOpts(opts), pcapPath]
    const isWin = env.isWindows
    // don't detach if is windows
    const spawnOpts = isWin ? undefined : {detached: true}
    const p = spawn(this.binPath, subCommandWithArgs, spawnOpts)
    signal?.addEventListener("abort", () => {
      if (isWin) {
        spawnSync("taskkill", ["/pid", p.pid.toString(), "/f", "/t"])
      } else {
        process.kill(-p.pid, "SIGINT")
      }
    })
    return p
  }

  search(opts: searchOptions) {
    return this.exec("search", opts)
  }

  private exec(subCommand: string, opts: searchOptions | indexOptions) {
    const subCommandWithArgs = [subCommand, ...toCliOpts(opts)]
    return spawnSync(this.binPath, subCommandWithArgs)
  }
}
