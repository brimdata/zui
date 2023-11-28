import React from "react"
import {useSelector} from "react-redux"
import {runQuery} from "src/app/commands/run-query"
import {useZuiApi} from "src/app/core/context"
import useSelect from "src/app/core/hooks/use-select"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import styled from "styled-components"
import {useActiveQuery} from "./context"
import forms from "src/components/forms.module.css"
import {IconButton} from "src/components/icon-button"

const Actions = styled.div`
  display: flex;
  gap: 10px;
`

export function QueryActions() {
  const active = useActiveQuery()
  const isEditing = useSelector(Layout.getIsEditingTitle)
  if (isEditing) return null
  return (
    <Actions className={forms.form}>
      {active.isModified() && <Update />}
      <Create />
      <Run />
    </Actions>
  )
}

function Run() {
  return (
    <IconButton
      aria-label="run-query"
      click={() => runQuery.run()} // 🎶
      iconName="play"
      iconSize={16}
      label={"Run"}
    />
  )
}

function Create() {
  const dispatch = useDispatch()
  const active = useActiveQuery()
  const text = active.isAnonymous() ? "Save" : "Save As"
  const isEmpty = useSelector(Editor.isEmpty)
  function onClick() {
    dispatch(Layout.showTitleForm())
  }

  return (
    <IconButton
      label={text}
      iconName="plus"
      enabled={!isEmpty}
      click={onClick}
      display="icon-label"
    />
  )
}

function Update() {
  const active = useActiveQuery()
  const api = useZuiApi()
  const select = useSelect()

  function onClick() {
    const snapshot = select(Editor.getSnapshot)
    const id = active.query.id
    api.queries.addVersion(id, snapshot)
    api.queries.open(id, {history: "replace"})
  }

  return (
    <IconButton
      click={onClick}
      label="Update"
      iconName="check"
      display="icon-label"
    />
  )
}
