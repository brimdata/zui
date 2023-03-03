import {Header} from "@tanstack/react-table"
import classNames from "classnames"
import React from "react"
import Icon from "src/app/core/icon-temp"
import {ZedColumn} from "./column"
import {useZedTable} from "./context"
import {HeaderResizeArea} from "./header-resize-area"

export function HeaderCell({header}: {header: Header<any, any>}) {
  const api = useZedTable()
  const isPlaceholder = header.isPlaceholder
  const hasChildren = header.subHeaders.length !== 0
  const def = header.column.columnDef
  const column = def.meta as ZedColumn
  const width = header.getSize()
  return (
    <div
      role="columnheader"
      className={classNames("zed-table__header-cell", {
        isPlaceholder,
        hasChildren,
      })}
      style={{width}}
      data-header-id={isPlaceholder ? header.placeholderId : header.column.id}
    >
      {isPlaceholder ? null : (
        <>
          <div className="zed-table__header-cell-info">
            <span
              className="zed-table__header-cell-text"
              title={def.header as string}
            >
              {def.header as string}
            </span>

            {column.isSortedAsc && width > 75 && (
              <Icon name="sort-asc" className="zed-table__sort-icon" />
            )}
            {column.isSortedDesc && width > 75 && (
              <Icon name="sort-desc" className="zed-table__sort-icon" />
            )}
          </div>

          <button
            className="zed-table__header-cell-menu-button"
            aria-label={`${def.header} Header Menu`}
            onClick={(e) =>
              api.args.headerCellProps?.onContextMenu(e, def.meta as ZedColumn)
            }
          >
            <Icon name="chevron-down" size={16} />
          </button>
        </>
      )}
      <HeaderResizeArea header={header} />
    </div>
  )
}
