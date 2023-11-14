import {useContext} from "react"
import {Scrollable} from "src/components/scrollable"
import styled from "styled-components"
import {ColumnsToolbar} from "./columns-toolbar"
import {ColumnsTree} from "./columns-tree"
import {ResultsContext} from "src/app/query-home"

const BG = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export function ColumnsPane() {
  const value = useContext(ResultsContext)
  if (!value) return null

  return (
    <BG>
      <ColumnsToolbar />
      <Scrollable>
        <ColumnsTree />
      </Scrollable>
    </BG>
  )
}
