import React from "react"
import styled from "styled-components"

import {useSelector} from "react-redux"
import {Pins} from "./pins/pins"
import Editor from "src/js/state/Editor"
import Layout from "src/js/state/Layout"
import {EditorResizer} from "../editor-resizer"
import {ZedEditor} from "./zed-editor"
import {useDispatch} from "src/app/core/state"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import submitSearch from "../flows/submit-search"
import Config from "src/js/state/Config"
import {useTabId} from "src/app/core/hooks/use-tab-id"

const Group = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
`

export default function SearchArea() {
  const value = useSelector(Editor.getValue)
  const height = useSelector(Layout.getEditorHeight)
  const runOnEnter = useSelector(Config.getRunOnEnter)
  const dispatch = useDispatch()
  const tabId = useTabId()
  const onChange = (v: string) => {
    dispatch(Editor.setValue(v))
  }

  const onKey = (e: React.KeyboardEvent) => {
    const isEnterKey = e.key === "Enter"
    const isModKey = e.shiftKey || cmdOrCtrl(e)
    if (isEnterKey) {
      if ((runOnEnter && !isModKey) || (!runOnEnter && isModKey)) {
        e.preventDefault()
        dispatch(submitSearch())
      }
    }
  }

  return (
    <>
      <Pins />
      <Group style={{height}} onKeyDownCapture={onKey}>
        <ZedEditor
          value={value}
          onChange={onChange}
          path={tabId}
          testId="main-editor"
        />
        <EditorResizer />
      </Group>
    </>
  )
}
