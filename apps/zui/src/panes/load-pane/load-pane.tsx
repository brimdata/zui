import {useSelector} from "react-redux"
import styles from "./load-pane.module.css"
import {ModalRoot} from "src/components/modal-root"

import classNames from "classnames"
import {IconButton} from "src/components/icon-button"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {useDispatch} from "src/app/core/state"
import {useEffect, useState, useTransition} from "react"
import {invoke} from "src/core/invoke"
import {Type, decode} from "@brimdata/zed-js"
import {ListView} from "src/zui-kit"
import {ZedEditor} from "src/app/query-home/search-area/zed-editor"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import Config from "src/js/state/Config"
import {Form} from "./form"
import Link from "src/js/components/common/Link"
import {ZedScript} from "src/app/core/models/zed-script"
import Current from "src/js/state/Current"

export function LoadPane() {
  const [original, setOriginal] = useState([])
  const [shaped, setShaped] = useState([])
  const [originalError, setOriginalError] = useState("")
  const [shapedError, setShapedError] = useState("")
  const [_pending, start] = useTransition()
  const shaper = useSelector(LoadDataForm.getShaper)
  const files = useSelector(LoadDataForm.getFiles)
  const dispatch = useDispatch()
  const [shapedTypes, setShapedTypes] = useState([])
  const [_shapedTypesError, setShapedTypesError] = useState("")
  const [shapedView, setShapedView] = useState("results")

  function setShaper(text: string) {
    dispatch(LoadDataForm.setShaper(text))
  }

  function addFiles(paths: string[]) {
    dispatch(LoadDataForm.addFiles(paths))
  }

  const [_props, ref] = useFilesDrop({
    onDrop: (files: File[]) => addFiles(files.map((f) => f.path)),
  })

  function append(script: string, suffix: string) {
    const zed = new ZedScript(script)
    const s = zed.isEmpty() ? "*" : script
    return s + "\n" + suffix
  }

  function limit(script: string) {
    return append(script, " | head 100")
  }

  async function run(script, onData, onError) {
    const {data, error} = await invoke("loaders.previewShaper", files, script)
    start(() => {
      error && onError(error)
      onData(decode(data))
    })
  }

  function runOriginal() {
    run(limit("*"), setOriginal, setOriginalError)
  }

  function runShaper() {
    run(limit(shaper), setShaped, setShapedError)
  }

  function runShaperTypes() {
    run(
      append(shaper, " | by typeof(this)"),
      setShapedTypes,
      setShapedTypesError
    )
  }

  const [shapedCount, setShapedCount] = useState([])
  const [_shapedCountError, setShapedCountError] = useState("")
  function runShaperCount() {
    const onData = (values) => {
      console.log(values)
      setShapedCount(values[0]?.toJS())
    }
    run(append(shaper, " | count()"), onData, setShapedCountError)
  }

  useEffect(() => {
    runOriginal()
    submit()
  }, [files])

  const submit = () => {
    runShaper()
    runShaperTypes()
    runShaperCount()
  }

  const shapes = new Set<Type>()
  original.forEach((o) => shapes.add(o.type))

  const runOnEnter = useSelector(Config.getRunOnEnter)
  const onKey = (e: React.KeyboardEvent) => {
    const isEnterKey = e.key === "Enter"
    const isModKey = e.shiftKey || cmdOrCtrl(e)
    if (isEnterKey) {
      if ((runOnEnter && !isModKey) || (!runOnEnter && isModKey)) {
        e.preventDefault()
        submit()
      }
    }
  }

  if (files.length === 0) return null

  return (
    <ModalRoot>
      <div className={styles.grid} ref={ref}>
        <main className={styles.main}>
          <div className={styles.toolbar}>
            <div></div>
            <div>
              <h2 className={styles.title}>Shaper Script</h2>
            </div>
            <div className={styles.toolbarActions}>
              <IconButton iconName="run" onClick={submit} />
            </div>
          </div>
          <div onKeyDownCapture={onKey} className={styles.shaper}>
            <ZedEditor
              path="preview"
              value={shaper}
              onChange={(s) => setShaper(s)}
            />
          </div>
          <div className={classNames(styles.original, styles.results)}>
            <header>
              <label>Original</label>
            </header>
            <section>
              {originalError ? (
                originalError.toString()
              ) : (
                <ListView values={original} />
              )}
            </section>
            <footer>Types</footer>
          </div>
          <div className={classNames(styles.shaped, styles.results)}>
            <header>
              <label>Preview</label>
            </header>
            <section>
              {shapedError ? (
                shapedError.toString()
              ) : (
                <ListView
                  values={shapedView === "results" ? shaped : shapedTypes}
                />
              )}
            </section>
            <footer>
              <Link onClick={() => setShapedView("types")}>
                Types: {shapedTypes.length.toString()}
              </Link>
              <Link onClick={() => setShapedView("results")}>
                Results: {shaped.length.toString()} of {shapedCount}
              </Link>
            </footer>
          </div>
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
