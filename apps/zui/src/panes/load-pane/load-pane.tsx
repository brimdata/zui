import {useSelector} from "react-redux"

import styles from "./load-pane.module.css"
import {ModalRoot} from "src/components/modal-root"
import * as _ from "lodash"
import {IconButton} from "src/components/icon-button"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {useDispatch} from "src/app/core/state"
import {useEffect, useRef} from "react"
import {ZedEditor} from "src/app/query-home/search-area/zed-editor"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import Config from "src/js/state/Config"
import {Form} from "./form"
import Current from "src/js/state/Current"
import DragAnchor from "src/components/drag-anchor"
import useSelect from "src/app/core/hooks/use-select"
import {Results, useResultsControl} from "./results"

export function LoadPane() {
  const dispatch = useDispatch()
  const shaper = useSelector(LoadDataForm.getShaper)
  const files = useSelector(LoadDataForm.getFiles)
  const format = useSelector(LoadDataForm.getFormat)
  const original = useResultsControl("*", files, format)
  const preview = useResultsControl(shaper, files, format)
  const [_props, ref] = useFilesDrop({
    onDrop: (files: File[]) => addFiles(files.map((f) => f.path)),
  })
  const lake = useSelector(Current.getLake)
  const size = useRef(0)
  const select = useSelect()
  const mainStyle = useSelector(LoadDataForm.getMainStyle)
  const editor = useRef<HTMLDivElement>()

  const onStart = () => {
    size.current = select(LoadDataForm.getEditorSize)
  }
  const onDrag = (e, {dy}) => {
    dispatch(LoadDataForm.setEditorSize(size.current + dy))
  }

  const onEnd = () => {
    const el = editor.current
    if (!el) return
    dispatch(LoadDataForm.setEditorSize(el.getBoundingClientRect().height))
  }

  const initialize = () => {
    original.queryAll()
    preview.queryAll()
  }

  const submit = () => {
    preview.queryAll()
  }

  const onKeyDown = useZedEditorKeyboardSubmit(submit)

  function setShaper(text: string) {
    dispatch(LoadDataForm.setShaper(text))
  }

  function addFiles(paths: string[]) {
    dispatch(LoadDataForm.addFiles(paths))
  }

  useEffect(initialize, [files, format])

  if (files.length === 0) return null

  return (
    <ModalRoot>
      <div className={styles.grid} ref={ref}>
        <main className={styles.main} style={mainStyle}>
          <section className={styles.titlebar}>{lake.name}</section>
          <section className={styles.shaper} ref={editor}>
            <div className={styles.toolbar}>
              <div>
                <h2 className={styles.title}>Shaper Script</h2>
              </div>
              <div className={styles.toolbarActions}>
                <IconButton iconName="run" onClick={submit} />
              </div>
            </div>
            <div onKeyDownCapture={onKeyDown} className={styles.editor}>
              <ZedEditor
                path="preview"
                value={shaper}
                onChange={(s) => setShaper(s)}
              />
            </div>
            <DragAnchor
              position="bottom"
              onStart={onStart}
              onDrag={onDrag}
              onEnd={onEnd}
            />
          </section>

          <section className={styles.resultsGroup}>
            <Results
              className={styles.original}
              title="Original"
              {...original}
            />
            <Results className={styles.shaped} title="Preview" {...preview} />
          </section>
        </main>
        <aside className={styles.aside}>
          <header>
            <h2 className={styles.formTitle}>
              Load Data
              <hr />
            </h2>
          </header>
          <Form />
        </aside>
      </div>
    </ModalRoot>
  )
}

/**
 *
 * @param onSubmit Function
 * @returns onKeyDownListener attach to parent in capture phase
 */
function useZedEditorKeyboardSubmit(onSubmit: () => void) {
  const runOnEnter = useSelector(Config.getRunOnEnter)
  return (e: React.KeyboardEvent) => {
    const isEnterKey = e.key === "Enter"
    const isModKey = e.shiftKey || cmdOrCtrl(e)
    if (isEnterKey) {
      if ((runOnEnter && !isModKey) || (!runOnEnter && isModKey)) {
        e.preventDefault()
        onSubmit()
      }
    }
  }
}
