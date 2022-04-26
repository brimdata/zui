import React from "react"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import {View} from "../views/view"

export function item(view: View) {
  const {args} = view
  const {field, value, ctx, indexPath} = args
  const props = {
    key: args.indexPath.join(","),
    className: zedTypeClassName(value),
    onContextMenu: (e: React.MouseEvent) => {
      ctx.props?.onContextMenu(e, value, field, indexPath[0])
    },
    onClick: (e: React.MouseEvent) => {
      ctx.props?.onClick(e, value, field, indexPath[0])
    },
  }
  return <span {...props}>{view.render()}</span>
}
