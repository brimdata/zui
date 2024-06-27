import classNames from "classnames"
import React from "react"

export function HeaderGroup(props: {
  isLeaf: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={classNames("zed-table__header-group", {
        "zed-table__header-group--parent": !props.isLeaf,
      })}
    >
      {props.children}
    </div>
  )
}
