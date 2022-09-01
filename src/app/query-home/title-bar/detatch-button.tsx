import React from "react"
import styled from "styled-components"
import {useBrimApi} from "src/app/core/context"
import useSelect from "src/app/core/hooks/use-select"
import {IconButton} from "./icon-button"
import Editor from "src/js/state/Editor"

const Detatch = styled(IconButton)`
  height: 18px;
  width: 18px;
`

export function DetatchButton() {
  const select = useSelect()
  const api = useBrimApi()

  function onClick() {
    const snapshot = select(Editor.getSnapshot)
    api.queries.open(snapshot)
  }
  return <Detatch icon="close" onClick={onClick} size={14} />
}
