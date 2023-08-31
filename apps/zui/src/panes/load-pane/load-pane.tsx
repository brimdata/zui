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
import {bounded} from "src/util/bounded"

function useSidebarDrag() {
  const start = useRef(0)
  const select = useSelect()
  const dispatch = useDispatch()
  const set = LoadDataForm.setSidebarSize
  const get = LoadDataForm.getSidebarSize
  const ref = useRef<HTMLElement>()

  const onStart = () => {
    start.current = select(get)
  }
  const onDrag = (e, {dx}) => {
    dispatch(set(start.current - dx))
  }
  const onEnd = () => {
    const el = ref.current
    if (!el) return
    dispatch(set(el.getBoundingClientRect().width))
  }

  return {anchorProps: {onStart, onDrag, onEnd}, ref}
}

function useEditorDrag() {
  const select = useSelect()
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>()
  const size = useRef(0)
  const onStart = () => {
    size.current = select(LoadDataForm.getEditorSize)
  }
  const onDrag = (e, {dy}) => {
    dispatch(LoadDataForm.setEditorSize(size.current + dy))
  }

  const onEnd = () => {
    const el = ref.current
    if (!el) return
    dispatch(LoadDataForm.setEditorSize(el.getBoundingClientRect().height))
  }

  return {anchorProps: {onStart, onDrag, onEnd}, ref}
}

function useResultsDrag() {
  const ref = useRef<HTMLElement>()
  const dispatch = useDispatch()
  const total = useRef(0)
  const left = useRef(0)

  const onStart = () => {
    const el = ref.current
    if (!el) return
    total.current = el.getBoundingClientRect().width
    left.current = el.children[0].getBoundingClientRect().width
  }

  const onDrag = (e, {dx}) => {
    const leftSize = left.current + dx
    const ratio = bounded(leftSize / total.current, [0.2, 0.8])

    dispatch(LoadDataForm.setResultsRatio(ratio))
  }

  return {anchorProps: {onStart, onDrag}, ref}
}

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

  const mainStyle = useSelector(LoadDataForm.getMainStyle)
  const gridStyle = useSelector(LoadDataForm.getGridStyle)
  const resultsStyle = useSelector(LoadDataForm.getResultsStyle)

  const sidebarDrag = useSidebarDrag()
  const editorDrag = useEditorDrag()
  const resultsDrag = useResultsDrag()

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
      <div className={styles.grid} ref={ref} style={gridStyle}>
        <main className={styles.main} style={mainStyle}>
          <section className={styles.titlebar}>{lake.name}</section>
          <section className={styles.shaper} ref={editorDrag.ref}>
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
              showOnHover
              {...editorDrag.anchorProps}
            />
          </section>

          <section
            className={styles.resultsGroup}
            ref={resultsDrag.ref}
            style={resultsStyle}
          >
            <div className={styles.resultsContainer}>
              <Results
                className={styles.original}
                title="Original"
                {...original}
              />
              <DragAnchor
                position="right"
                showOnHover
                {...resultsDrag.anchorProps}
              />
            </div>
            <div className={styles.resultsContainer}>
              <Results className={styles.shaped} title="Preview" {...preview} />
            </div>
          </section>
        </main>
        <aside className={styles.aside} ref={sidebarDrag.ref}>
          <header>
            <h2 className={styles.formTitle}>
              Load Data
              <hr />
            </h2>
          </header>
          <Form />
          <DragAnchor
            position="left"
            {...sidebarDrag.anchorProps}
            showOnHover
          />
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
