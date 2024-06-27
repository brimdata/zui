import React from "react"

export function cmdOrCtrl(e: React.KeyboardEvent) {
  if (global.env.isMac) return e.metaKey
  else return e.ctrlKey
}
