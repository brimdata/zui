import {MenuItem, menus, session} from "src/zui"
import {DOWNLOAD, DownloadArgs} from "./types"
import * as zed from "@brimdata/zed-js"
import {findUid} from "../zeek/util"
import {queryForConnLog} from "./query-conn-log"

const MENU_NAME = "results.toolbarMenu"

const packetsMenuItem: MenuItem = {
  id: "packets",
  iconName: "wireshark",
  label: "Packets",
  description: "Download Packets",
  command: DOWNLOAD as any,
  enabled: false,
  priority: 1,
}

async function onSelectionChange({row}) {
  if (row instanceof zed.Record) {
    const uid = findUid(row)
    const pool = session.poolName
    let enabled = false
    if (uid && pool) {
      const conn = await queryForConnLog(pool, uid)
      if (conn) {
        enabled = true
      }
    }
    const id = packetsMenuItem.id
    menus.updateItem(MENU_NAME, id, {
      enabled,
      args: [pool, uid] as DownloadArgs,
    })
  }
}

export function activatePacketsMenuItem() {
  session.on("result-selection-change", onSelectionChange)
  menus.extend(MENU_NAME, (menu: MenuItem[]) => {
    menu.unshift(packetsMenuItem)
  })
}
