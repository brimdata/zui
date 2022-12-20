import React from "react"
import {useZedTable} from "./context"
import {HeaderCell} from "./header-cell"
import {HeaderGroup} from "./header-group"

export const Header = function Header() {
  const api = useZedTable()
  const groups = api.table.getHeaderGroups()
  return (
    <div className="zed-table__header">
      {groups.map((group, index) => {
        return (
          <HeaderGroup key={group.id} isLeaf={index === groups.length - 1}>
            {group.headers.map((header) => (
              <HeaderCell header={header} key={header.id} />
            ))}
          </HeaderGroup>
        )
      })}
    </div>
  )
}
