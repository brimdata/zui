import React from "react"
import {RenderMode} from "../types"
import {View} from "../views/view"

export function clickHandlers(view: View) {
  const {field, value, ctx} = view.args
  return {
    onContextMenu: (e: React.MouseEvent) => {
      const fn = ctx.onContextMenu
      fn && fn(e as any, value as any, field)
    },
    onClick: (e: React.MouseEvent) => {
      const fn = ctx.onClick
      fn && fn(e as any, value as any, field)
    },
  }
}

export function item(view: View, mode: RenderMode) {
  const props = {
    role: "gridcell",
    key: "item-" + view.id,
    className: view.className,
    ...clickHandlers(view),
  }
  return <span {...props}>{view.render(mode)}</span>
}
