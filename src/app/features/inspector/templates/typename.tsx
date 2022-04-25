import React from "react"
import {View} from "../views/view"
import {zed} from "@brimdata/zealot"

export function typename(view: View) {
  const type = view.args.type as zed.TypeAlias
  return [
    <span key="alias-1" className="zed-syntax">
      {" "}
      (
    </span>,
    <span key="alias-2" className="zed-annotation">
      {type.name}
    </span>,
    <span key="alias-3" className="zed-syntax">
      )
    </span>,
  ]
}
