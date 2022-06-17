import React from "react"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import {RenderMode} from "../types"
import {View} from "../views/view"

export function clickHandlers(view: View) {
  const {field, value, ctx, indexPath} = view.args
  return {
    onContextMenu: (e: React.MouseEvent) => {
      ctx.props?.onContextMenu(e, value, field, indexPath[0])
    },
    onClick: (e: React.MouseEvent) => {
      ctx.props?.onClick(e, value, field, indexPath[0])
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
