import React, {useRef} from "react"

import {useSelector} from "react-redux"
import MainEditor from "src/js/state/Editor"
import {useDispatch} from "src/core/use-dispatch"
import {cmdOrCtrl} from "src/util/keyboard"
import Config from "src/js/state/Config"
import {useTabId} from "src/util/hooks/use-tab-id"
import {ZedEditor} from "src/components/zed-editor"
import {EditorResizer} from "src/views/session-page/editor-resizer"
import styles from "./editor.module.css"
import {submitSearch} from "src/domain/session/handlers"

export function Editor() {
  const value = useSelector(MainEditor.getValue)
  const runOnEnter = useSelector(Config.getRunOnEnter)
  const dispatch = useDispatch()
  const tabId = useTabId()
  const container = useRef()
  const onChange = (v: string) => {
    dispatch(MainEditor.setValue(v))
  }

  const onKey = (e: React.KeyboardEvent) => {
    const isEnterKey = e.key === "Enter"
    const isModKey = e.shiftKey || cmdOrCtrl(e)
    if (isEnterKey) {
      if ((runOnEnter && !isModKey) || (!runOnEnter && isModKey)) {
        e.preventDefault()
        submitSearch()
      }
    }
  }

  return (
    <div ref={container} className={styles.container} onKeyDownCapture={onKey}>
      <ZedEditor
        value={value}
        onChange={onChange}
        path={tabId}
        testId="main-editor"
      />
      <EditorResizer container={container} />
    </div>
  )
}
