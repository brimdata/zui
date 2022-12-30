import {zed} from "@brimdata/zealot"
import React, {useMemo} from "react"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import {FillFlexParent} from "src/components/fill-flex-parent"
import Results from "src/js/state/Results"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import styled from "styled-components"
import {Node} from "./node"
import {toTreeData} from "./tree-data"

export function ColumnsTree() {
  const shapesObj = useSelector(Results.getShapes(MAIN_RESULTS))
  const shapes = Object.values(shapesObj)
  const record = shapes[0] as zed.TypeRecord
  const data = useMemo(() => toTreeData(record), [record])
  if (!record || !(record instanceof zed.TypeRecord)) return null
  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <Tree width={width} height={height} initialData={data} padding={10}>
            {Node}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}
