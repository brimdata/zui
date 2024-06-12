import React, {useRef} from "react"

import {useSelector} from "react-redux"
import MainEditor from "src/js/state/Editor"
import {useTabId} from "src/util/hooks/use-tab-id"
import {ZedEditor} from "src/components/zed-editor"
import {EditorResizer} from "src/views/session-page/editor-resizer"
import styles from "./editor.module.css"
import {EditorHandler} from "./editor-handler"

export function Editor() {
  const tabId = useTabId()
  const container = useRef()
  const value = useSelector(MainEditor.getValue)
  const markers = useSelector(MainEditor.getMarkers)
  const editor = useRef(new EditorHandler()).current

  return (
    <div
      ref={container}
      className={styles.container}
      onKeyDownCapture={(e) => editor.onKey(e)}
    >
      <ZedEditor
        value={value}
        onChange={(value) => editor.onChange(value)}
        path={tabId}
        testId="main-editor"
        markers={markers}
      />
      <EditorResizer container={container} />
    </div>
  )
}
