import {execSync} from "child_process"
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
  s: "space",
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
  private rootCmd = "brimcap"

  constructor() {}

  async load(opts: loadOptions) {
    this.exec("load", opts)
  }

  async launch(opts: launchOptions) {
    this.exec("launch", opts)
  }

  async search(opts: searchOptions) {
    this.exec("search", opts)
  }

  private exec(
    command: string,
    opts: searchOptions | launchOptions | loadOptions
  ) {
    const commandWithOpts = [
      this.rootCmd,
      command,
      ...flatMap(
        Object.entries(opts).map(([k, v]) => [`-${OPTION_NAME_MAP[k] || k}`, v])
      )
    ].join(" ")

    execSync(commandWithOpts)
  }
}
