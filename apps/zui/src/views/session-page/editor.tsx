import React, {useRef} from "react"

import {useSelector} from "react-redux"
import MainEditor from "src/js/state/Editor"
import {useDispatch} from "src/app/core/state"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import Config from "src/js/state/Config"
import {useTabId} from "src/app/core/hooks/use-tab-id"
import {ZedEditor} from "src/components/zed-editor"
import {EditorResizer} from "src/views/session-page/editor-resizer"
import styles from "./editor.module.css"
import {submitSearch} from "src/domain/session/handlers"
import {validateQuery} from "src/domain/session/handlers"

// XXX this doesn't work since it's global. Need to figure out where to hang
// this mother-fer
let handle: number
let abort: AbortController

export function Editor() {
  const value = useSelector(MainEditor.getValue)
  const runOnEnter = useSelector(Config.getRunOnEnter)
  const markers = useSelector(MainEditor.getMarkers)
  const dispatch = useDispatch()
  const tabId = useTabId()
  const container = useRef()

  const onChange = (v: string) => {
    dispatch(MainEditor.setValue(v))
    clearTimeout(handle)
    if (abort) {
      abort.abort()
    }
    abort = new AbortController()
    handle = window.setTimeout(() => validateQuery(abort.signal) , 500)
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
        markers={markers}
      />
      <EditorResizer container={container} />
    </div>
  )
}
