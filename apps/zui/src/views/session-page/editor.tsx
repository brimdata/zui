import React from "react"

import {useSelector} from "react-redux"
import MainEditor from "src/js/state/Editor"
import {useDispatch} from "src/app/core/state"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import Config from "src/js/state/Config"
import {useTabId} from "src/app/core/hooks/use-tab-id"
import {ZedEditor} from "src/app/query-home/search-area/zed-editor"
import {EditorResizer} from "src/app/query-home/editor-resizer"
import submitSearch from "src/app/query-home/flows/submit-search"
import styles from "./editor.module.css"

export function Editor() {
  const value = useSelector(MainEditor.getValue)
  const runOnEnter = useSelector(Config.getRunOnEnter)
  const dispatch = useDispatch()
  const tabId = useTabId()
  const onChange = (v: string) => {
    dispatch(MainEditor.setValue(v))
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
    <div className={styles.container} onKeyDownCapture={onKey}>
      <ZedEditor
        value={value}
        onChange={onChange}
        path={tabId}
        testId="main-editor"
      />
      <EditorResizer />
    </div>
  )
}
