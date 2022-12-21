import React from "react"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import {RenderMode} from "../types"
import {View} from "../views/view"

export function clickHandlers(view: View) {
  const {field, value, ctx} = view.args
  return {
    onContextMenu: (e: React.MouseEvent) => {
      const fn = ctx.props?.onContextMenu
      fn && fn(e, value, field)
    },
    onClick: (e: React.MouseEvent) => {
      const fn = ctx.props.onClick
      fn && fn(e, value, field)
    },
  }
}

export function item(view: View, mode: RenderMode) {
  const props = {
    key: view.args.indexPath.join(","),
    className: zedTypeClassName(view.value),
    ...clickHandlers(view),
  }
  return <span {...props}>{view.render(mode)}</span>
}
