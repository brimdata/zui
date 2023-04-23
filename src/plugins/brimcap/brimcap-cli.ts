import env from "src/app/core/env"
import {spawnSync, spawn, ChildProcess} from "child_process"
import {compact, isEmpty} from "lodash"
import flatMap from "lodash/flatMap"

interface PacketOptions {
  dstIp?: string
  dstPort?: string
  duration?: string
  proto?: string
  srcIp?: string
  srcPort?: string
  ts?: string
}

export interface IndexOptions {
  root: string
  pcap: string
}

export interface AnalyzeOptions {
  config?: string
  suricataDisabled?: boolean
  suricataStderr?: string
  suricataStdout?: string
  zeekDisabled?: boolean
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

export interface SearchOptions extends PacketOptions {
  root: string
  write: string
}

const OPTION_NAME_MAP = {
  pool: "p",
  suricataDisabled: "analyzers.suricata.disabled",
  suricataStderr: "analyzers.suricata.stderr",
  suricataStdout: "analyzers.suricata.stdout",
  zeekDisabled: "analyzers.zeek.disabled",
  zeekStdout: "analyzers.zeek.stdout",
  zeekStderr: "analyzers.zeek.stderr",
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
  pcap: "r",
}

const toCliOpts = (
  opts: SearchOptions | AnalyzeOptions | IndexOptions
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
  private isWin = env.isWindows
  // don't detach if is windows
  private spawnOpts = this.isWin ? undefined : {detached: true}

  constructor(private binPath: string) {}

  index(opts: IndexOptions) {
    return this.execSpawnSync("index", [...toCliOpts(opts)])
  }

  analyze(
    pcapPath: string,
    opts: AnalyzeOptions,
    signal?: AbortSignal
  ): ChildProcess {
    return this.execSpawn("analyze", [...toCliOpts(opts), pcapPath], signal)
  }

  search(opts: SearchOptions) {
    return this.execSpawnSync("search", [...toCliOpts(opts)])
  }

  private execSpawn(
    subCommand: string,
    optsAndArgs: string[],
    signal?: AbortSignal
  ) {
    // don't detach if is windows
    const p = spawn(this.binPath, [subCommand, ...optsAndArgs], this.spawnOpts)
    signal?.addEventListener("abort", () => {
      if (this.isWin) {
        spawnSync("taskkill", ["/pid", p.pid.toString(), "/f", "/t"])
      } else {
        process.kill(-p.pid, "SIGINT")
      }
    })
    return p
  }

  private execSpawnSync(subCommand: string, opts: string[]) {
    return spawnSync(this.binPath, [subCommand, ...opts])
  }
}
