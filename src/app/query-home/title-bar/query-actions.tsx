import React from "react"
import {useSelector} from "react-redux"
import {useBrimApi} from "src/app/core/context"
import useSelect from "src/app/core/hooks/use-select"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import tabHistory from "src/app/router/tab-history"
import {lakeQueryPath} from "src/app/router/utils/paths"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import SessionHistories from "src/js/state/SessionHistories"
import styled from "styled-components"
import {ActiveQuery} from "./active-query"
import {Button} from "./button"

const Actions = styled.div`
  display: flex;
  padding: 0 16px;
  gap: 10px;
`

export function QueryActions({active}: {active: ActiveQuery}) {
  const isEditing = useSelector(Layout.getIsEditingTitle)
  if (isEditing) return null
  return (
    <Actions>
      {active.isModified() && <Update active={active} />}
      {!active.isAnonymous() && <Detach active={active} />}
      <Create />
    </Actions>
  )
}

function Create() {
  const dispatch = useDispatch()
  function onClick() {
    dispatch(Layout.showTitleForm("create"))
  }
  return (
    <Button onClick={onClick} icon="plus">
      Create
    </Button>
  )
}

function Detach({active}: {active: ActiveQuery}) {
  const api = useBrimApi()
  const select = useSelect()
  const dispatch = useDispatch()
  const lakeId = useLakeId()

  function onClick() {
    const snapshot = select(Editor.getSnapshot)
    const id = active.session.id
    api.queries.addVersion(id, snapshot)
    dispatch(SessionHistories.push(id, snapshot.version))
    dispatch(tabHistory.push(lakeQueryPath(id, lakeId, snapshot.version)))
  }

  return (
    <Button onClick={onClick} icon="detach">
      Detach
    </Button>
  )
}

function Update({active}: {active: ActiveQuery}) {
  const api = useBrimApi()
  const select = useSelect()
  const dispatch = useDispatch()
  const lakeId = useLakeId()

  function onClick() {
    const snapshot = select(Editor.getSnapshot)
    const id = active.query.id
    api.queries.addVersion(id, snapshot)
    dispatch(SessionHistories.replace(id, snapshot.version))
    dispatch(tabHistory.replace(lakeQueryPath(id, lakeId, snapshot.version)))
  }

  return (
    <Button icon="update" primary onClick={onClick}>
      Update
    </Button>
  )
}
