import React from "react"
import env from "../env"

export function cmdOrCtrl(e: React.KeyboardEvent) {
  if (env.isMac) return e.metaKey
  else return e.ctrlKey
}
