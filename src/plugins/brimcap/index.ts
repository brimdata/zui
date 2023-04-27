import * as zed from "@brimdata/zed-js"
import {findUid} from "../zeek/util"
import {findConnLog} from "../zeek/queries"
import {
  PluginContext,
  commands,
  configurations,
  env,
  lake,
  loaders,
  menus,
  session,
  window,
} from "src/zui"
import {MenuItem} from "src/zui"
import os from "os"
import {join} from "path"
import {createCli} from "./create-cli"
import {ensureDirSync} from "fs-extra"
import {createLoader} from "./loader"
import {pluginNamespace, yamlConfigPropName} from "./config"

const DOWNLOAD = "brimcap.downloadPackets"

type DownloadArgs = [pool: string, uid: string]

const packetsMenuItem: MenuItem = {
  id: "packets",
  iconName: "sharkfin",
  label: "Packets",
  description: "Download Packets",
  command: DOWNLOAD,
  enabled: false,
  priority: 1,
}

async function onSelectionChange({row}) {
  if (row instanceof zed.Record) {
    const uid = findUid(row)
    const pool = session.poolName
    let enabled = false
    if (uid && pool) {
      const conn = await findConn(pool, uid)
      if (conn) {
        enabled = true
      }
    }
    menus.get("results.toolbarMenu").update(packetsMenuItem.id, {
      enabled,
      args: [pool, uid] as DownloadArgs,
    })
  }
}

async function findConn(pool: string, uid: string) {
  const query = findConnLog(pool, uid)
  const results = await lake.query(query).then((r) => r.zed())
  const [conn] = results
  return conn as zed.Record
}

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

function getPacketIndexRoot(ctx: PluginContext) {
  return join(ctx.storagePath, "root")
}

async function downloadPackets(root: string, pool: string, uid: string) {
  const conn = await findConn(pool, uid)
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

export function activate(ctx: PluginContext) {
  const root = getPacketIndexRoot(ctx)
  ensureDirSync(root)

  session.on("result-selection-change", onSelectionChange)

  menus.extend("results.toolbarMenu", [packetsMenuItem])

  commands.create<DownloadArgs>(DOWNLOAD, (pool: string, uid: string) =>
    downloadPackets(root, pool, uid)
  )

  loaders.create("brimcap-loader", createLoader(root))

  configurations.create({
    name: pluginNamespace,
    title: "Brimcap Settings",
    properties: {
      [yamlConfigPropName]: {
        name: yamlConfigPropName,
        type: "file",
        label: "Brimcap YAML Config File",
        defaultValue: "",
        helpLink: {
          label: "docs",
          url: "https://github.com/brimdata/brimcap/wiki/Custom-Brimcap-Config",
        },
      },
    },
  })
}
