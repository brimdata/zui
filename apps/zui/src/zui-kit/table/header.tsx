import {HeaderGroup as HeaderGroupType} from "@tanstack/table-core"
import React from "react"
import {HeaderCell} from "./header-cell"
import {HeaderGroup} from "./header-group"

export const Header = React.memo(function Header(props: {
  headerGroups: HeaderGroupType<any>[]
}) {
  const groups = props.headerGroups
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
})
