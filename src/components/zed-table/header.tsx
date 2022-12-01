import React, {Ref} from "react"
import styled from "styled-components"
import {useZedTable} from "./context"

const TH = styled.th`
  white-space: nowrap;
  text-align: left;
  padding: 0 10px;
  border-bottom: 1px solid var(--border-color);
`

const BG = styled.div`
  width: 100%;
  overflow: hidden;
`

export function Header(props: {outerRef: Ref<HTMLDivElement>}) {
  const {table} = useZedTable()
  return (
    <BG id="zed-table-header" ref={props.outerRef}>
      <table {...table.getTableProps()}>
        <thead>
          {table.headerGroups.map((group) => {
            return (
              <tr {...group.getHeaderGroupProps()}>
                {group.headers.map((column) => {
                  return (
                    <TH {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </TH>
                  )
                })}
              </tr>
            )
          })}
        </thead>
      </table>
    </BG>
  )
}
