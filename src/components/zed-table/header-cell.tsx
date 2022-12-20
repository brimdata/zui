import {Header} from "@tanstack/react-table"
import classNames from "classnames"
import React from "react"
import {HeaderResizeArea} from "./header-resize-area"

export function HeaderCell({header}: {header: Header<any, any>}) {
  const isPlaceholder = header.isPlaceholder
  const hasChildren = header.subHeaders.length !== 0
  return (
    <div
      className={classNames("zed-table__header-cell", {
        isPlaceholder,
        hasChildren,
      })}
      style={{width: header.getSize()}}
      data-column-id={isPlaceholder ? header.placeholderId : header.column.id}
    >
      {isPlaceholder ? null : (
        <span className="zed-table__header-cell-text">
          {header.column.columnDef.header as string}
        </span>
      )}
      <HeaderResizeArea header={header} />
    </div>
  )
}
