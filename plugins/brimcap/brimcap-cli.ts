import {execSync, spawn, ChildProcess} from "child_process"
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
  space: string
  suricata?: boolean
  suricataStderr?: string
  suricataStdout?: string
  zeek?: boolean
  zeekStdout?: string
  zeekStderr?: string
}

export interface launchOptions extends packetOptions {
  root: string
}

export interface searchOptions extends packetOptions {
  root: string
  write: string
}

const OPTION_NAME_MAP = {
  space: "s",
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

export default class BrimcapCLI {
  private binPath: string

  constructor(binPath: string) {
    this.binPath = binPath
  }

  public load(pcapPath: string, opts: loadOptions): ChildProcess {
    const subCommandWithArgs = [
      "load",
      ...flatMap(
        Object.entries(opts).map(([k, v]) => [`-${OPTION_NAME_MAP[k] || k}`, v])
      ),
      pcapPath
    ]

    return spawn(this.binPath, subCommandWithArgs)
  }

  public launch(opts: launchOptions) {
    return this.exec("launch", opts)
  }

  async search(opts: searchOptions) {
    return this.exec("search", opts)
  }

  private exec(subCommand: string, opts: searchOptions | launchOptions) {
    const commandWithArgs = [
      this.binPath,
      subCommand,
      ...flatMap(
        Object.entries(opts).map(([k, v]) => [`-${OPTION_NAME_MAP[k] || k}`, v])
      )
    ].join(" ")

    return execSync(commandWithArgs)
  }
}
