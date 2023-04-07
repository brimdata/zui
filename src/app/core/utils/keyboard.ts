import React from "react"

export function cmdOrCtrl(e: React.KeyboardEvent) {
  if (global.zui.env.isMac) return e.metaKey
  else return e.ctrlKey
}
