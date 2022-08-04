import React from "react"
import styled from "styled-components"
import {useBrimApi} from "src/app/core/context"
import useSelect from "src/app/core/hooks/use-select"
import {useActiveQuery} from "./context"
import {IconButton} from "./icon-button"
import Editor from "src/js/state/Editor"

const Detatch = styled(IconButton)`
  height: 18px;
  width: 18px;
`

export function DetatchButton() {
  const select = useSelect()
  const active = useActiveQuery()
  const api = useBrimApi()

  function onClick() {
    const snapshot = select(Editor.getSnapshot)
    const id = active.session.id
    api.queries.addVersion(id, snapshot)
    api.queries.open(id)
  }
  return <Detatch icon="close" onClick={onClick} size={14} />
}
