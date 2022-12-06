import {arrayExpression} from "@babel/core/node_modules/@babel/types"
import {CoreColumn, flexRender} from "@tanstack/react-table"
import {max} from "lodash"
import React, {Ref} from "react"
import styled from "styled-components"
import {config} from "./config"
import {useZedTable} from "./context"
import {measureMaxCellSize} from "./utils"

const BG = styled.div`
  width: 100%;
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  background: white;
  z-index: 1;
`

const Group = styled.div`
  display: flex;
  align-items: center;
`

const TH = styled.div`
  white-space: nowrap;
  text-align: left;
  padding: 0 10px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 11px;
  height: 100%;
  position: relative;
  background: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;
`

const resizePadding = 8
const resizeWidth = 1
const ResizeArea = styled.div`
  width: ${resizePadding * 2 + resizeWidth}px;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 2;
  cursor: col-resize;
  display: flex;
  justify-content: center;
`

const ResizeBar = styled.div`
  width: ${resizeWidth}px;
  margin-top: 3px;
  height: calc(100% - 6px);
  background: var(--border-color);
`

export function Header() {
  const {table, ref} = useZedTable()

  return (
    <BG>
      {table.getHeaderGroups().map((group) => {
        return (
          <Group key={group.id} style={{height: config.headerHeight + "px"}}>
            {group.headers.map((header) => {
              return (
                <React.Fragment key={header.id}>
                  <TH
                    style={{width: header.getSize()}}
                    data-column-id={header.column.id}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TH>
                  <ResizeArea
                    onMouseDown={header.getResizeHandler()}
                    onDoubleClick={() => {
                      if (ref.current) {
                        const id = header.column.id
                        const size = measureMaxCellSize(ref.current, id)
                        table.setColumnSizing((prev) => ({...prev, [id]: size}))
                      }
                    }}
                    style={{
                      left:
                        header.getStart() + header.getSize() - resizePadding,
                    }}
                  >
                    <ResizeBar />
                  </ResizeArea>
                </React.Fragment>
              )
            })}
          </Group>
        )
      })}
    </BG>
  )
}
