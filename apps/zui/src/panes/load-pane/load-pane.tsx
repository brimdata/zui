import {useSelector} from "react-redux"
import * as zed from "@brimdata/zed-js"
import styles from "./load-pane.module.css"
import {ModalRoot} from "src/components/modal-root"
import * as _ from "lodash"
import classNames from "classnames"
import {IconButton} from "src/components/icon-button"
import LoadDataForm from "src/js/state/LoadDataForm"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {useDispatch} from "src/app/core/state"
import {useEffect, useRef, useState, useTransition} from "react"
import {invoke} from "src/core/invoke"
import {decode} from "@brimdata/zed-js"
import {ListView, TableView} from "src/zui-kit"
import {ZedEditor} from "src/app/query-home/search-area/zed-editor"
import {cmdOrCtrl} from "src/app/core/utils/keyboard"
import Config from "src/js/state/Config"
import {Form} from "./form"
import Link from "src/js/components/common/Link"
import {ZedScript} from "src/app/core/models/zed-script"
import Current from "src/js/state/Current"
import {pluralize} from "src/util/pluralize"
import DragAnchor from "src/components/drag-anchor"
import useSelect from "src/app/core/hooks/use-select"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {pill} from "src/components/pill.module.css"
import {ButtonMenu} from "src/components/button-menu"

export function LoadPane() {
  const dispatch = useDispatch()
  const shaper = useSelector(LoadDataForm.getShaper)
  const files = useSelector(LoadDataForm.getFiles)
  const original = useResultsControl("*", files)
  const preview = useResultsControl(shaper, files)
  const [_props, ref] = useFilesDrop({
    onDrop: (files: File[]) => addFiles(files.map((f) => f.path)),
  })
  const lake = useSelector(Current.getLake)
  const editorHeight = useSelector(LoadDataForm.editorSize)
  const size = useRef(0)
  const select = useSelect()
  const onStart = () => {
    size.current = select(LoadDataForm.editorSize)
  }
  const onDrag = (e, {dy}) => {
    dispatch(LoadDataForm.setEditorSize(size.current + dy))
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

  useEffect(initialize, [files])

  if (files.length === 0) return null

  return (
    <ModalRoot>
      <div className={styles.grid} ref={ref}>
        <main className={styles.main}>
          <section className={styles.titlebar}>{lake.name}</section>
          <section className={styles.shaper} style={{height: editorHeight}}>
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
            <DragAnchor position="bottom" onStart={onStart} onDrag={onDrag} />
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

function append(script: string, suffix: string) {
  const zed = new ZedScript(script)
  const s = zed.isEmpty() ? "*" : script
  return s + "\n" + suffix
}

function limit(script: string) {
  return append(script, " | head 100")
}

function useZq(script: string, files: string[]) {
  const [_, start] = useTransition()
  const [error, setError] = useState("")
  const [data, setData] = useState<zed.Value[]>([])
  const display = useResultsDisplay()

  async function query() {
    const {data, error} = await invoke("loaders.previewShaper", files, script)
    start(() => {
      setError(error)
      setData(decode(data))
    })
  }

  return {
    error,
    data,
    query,
    display,
  }
}

function useResultsDisplay() {
  const [format, setFormat] = useState<ResultDisplay>("list")
  const [listState, setListState] = useState({valueExpandedDefault: true})
  const [tableState, setTableState] = useState({})

  function getDisplayState() {
    if (format === "list") return {value: listState, onChange: setListState}
    if (format === "table") return {value: tableState, onChange: setTableState}
    throw new Error("Unknown Format")
  }

  function expandAll() {
    if (format === "list") {
      setListState((prev) => ({
        ...prev,
        valueExpanded: {},
        valueExpandedDefault: true,
      }))
    }
    if (format === "table") {
      setTableState((prev) => ({
        ...prev,
        columnExpanded: {},
        columnExpandedDefault: true,
      }))
    }
  }

  function collapseAll() {
    if (format == "list") {
      setListState((prev) => ({
        ...prev,
        valueExpanded: {},
        valueExpandedDefault: false,
      }))
    }

    if (format === "table") {
      setTableState((prev) => ({
        ...prev,
        columnExpanded: {},
        columnExpandedDefault: false,
      }))
    }
  }

  return {
    format,
    setFormat,
    state: getDisplayState(),
    expandAll,
    collapseAll,
  }
}

type ResultDisplay = "list" | "table"
type ResultDimension = "values" | "types"

function useResultsControl(script: string, files: string[]) {
  const values = useZq(limit(script), files)
  const types = useZq(append(script, " | by typeof(this)"), files)
  const count = useZq(append(script, " | count()"), files)
  const [dimension, setDimension] = useState<ResultDimension>("values")

  function queryAll() {
    values.query()
    types.query()
    count.query()
  }

  function getDimension() {
    if (dimension === "values") return values
    if (dimension === "types") return types
    throw new Error("Unknown Dimension")
  }

  const current = getDimension()

  return {
    queryAll,
    dimension,
    setDimension,
    display: current.display,
    values: current.data,
    error: current.error,
    rowCount: count.data[0]?.toJS(),
    typeCount: types.data.length,
  }
}

type ResultsControl = ReturnType<typeof useResultsControl>

function Results(
  props: {
    title: string
    className?: string
  } & ResultsControl
) {
  return (
    <div className={classNames(styles.results, props.className)}>
      <header>
        <label className={pill}>{props.title}</label>
        <ToolbarTabs
          options={[
            {
              label: "Table",
              iconName: "columns",
              checked: props.display.format === "table",
              click: () => props.display.setFormat("table"),
            },
            {
              label: "Inspector",
              iconName: "braces",
              checked: props.display.format === "list",
              click: () => props.display.setFormat("list"),
            },
          ]}
        />
        <ButtonMenu
          menu={{
            items: [
              {
                iconName:
                  props.display.format === "table"
                    ? "expand-horizontal"
                    : "expand",
                label: "Expand All",
                click: () => props.display.expandAll(),
              },
              {
                iconName:
                  props.display.format === "table"
                    ? "collapse-horizontal"
                    : "collapse",
                label: "Collapse",
                click: () => props.display.collapseAll(),
              },
            ],
            label: "preview-results-menu",
          }}
        />
      </header>
      <section>
        {props.error ? (
          <ResultsError error={props.error} />
        ) : (
          <ResultsBody
            values={props.values}
            state={props.display.state}
            format={props.display.format}
          />
        )}
      </section>
      <footer>
        <button onClick={() => props.setDimension("types")}>
          <b>{props.typeCount}</b> {pluralize("Type", props.typeCount)}
        </button>
        <button onClick={() => props.setDimension("values")}>
          <b>{props.rowCount}</b> {pluralize("Row", props.rowCount)}
        </button>
      </footer>
    </div>
  )
}

function ResultsBody(props: {
  format: ResultDisplay
  state: {value; onChange}
  values: zed.Value[]
}) {
  if (props.format === "table") {
    return (
      <TableView
        values={props.values}
        state={props.state}
        shape={props.values[0].type}
      />
    )
  }
  if (props.format === "list") {
    return <ListView values={props.values} state={props.state} />
  }
  throw new Error("Unknown Display")
}

function ResultsError(props: {error: string}) {
  return (
    <div className={styles.zqError}>
      <h3 className={styles.zqErrorTitle}>ZQ Error</h3>
      <p>{props.error.replaceAll("Error:", "").trim()}</p>
    </div>
  )
}
