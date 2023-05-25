import * as zed from "@brimdata/zed-js"
import {join} from "path"
import {createCli} from "../cli"
import os from "os"
import {window, env, commands} from "src/zui"
import {queryForConnLog} from "./query-conn-log"
import {DOWNLOAD, DownloadArgs} from "./types"

function getSearchArgsFromConn(conn: zed.Record) {
  const dur = conn.try("duration") as zed.Duration
  return {
    dstIp: conn.get(["id", "resp_h"]).toString(),
    dstPort: conn.get(["id", "resp_p"]).toString(),
    duration: dur?.isSet() ? dur.toString() : "0s",
    proto: conn.get("proto").toString(),
    srcIp: conn.get(["id", "orig_h"]).toString(),
    srcPort: conn.get(["id", "orig_p"]).toString(),
    ts: conn.get("ts").toString(),
  }
}

function getPacketDest(conn: zed.Record) {
  const tsString = conn.get("ts").toString()
  return join(os.tmpdir(), `packets-${tsString}.pcap`.replace(/:/g, "_"))
}

export async function downloadPackets(root: string, pool: string, uid: string) {
  const conn = await queryForConnLog(pool, uid)
  if (conn) {
    const args = getSearchArgsFromConn(conn)
    const dest = getPacketDest(conn)
    const cli = createCli()
    const result = cli.search({...args, write: dest, root})

    if (result.status > 0) {
      const err = result.stderr.toString()
      console.error(err)
      const msg = JSON.parse(err)?.error || `brimcap search failed: ${err}`
      window.showErrorMessage(msg)
    } else {
      env.openExternal(dest)
      window.showSuccessMessage("Packets extracted. Opening...")
    }
  }
}

export function activateDownloadPacketsCommand(packetsDir: string) {
  commands.create<DownloadArgs>(DOWNLOAD, (pool: string, uid: string) =>
    downloadPackets(packetsDir, pool, uid)
  )
}
