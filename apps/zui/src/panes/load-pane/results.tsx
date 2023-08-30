import * as zed from "@brimdata/zed-js"
import classNames from "classnames"
import {useState, useTransition} from "react"
import {ZedScript} from "src/app/core/models/zed-script"
import {ButtonMenu} from "src/components/button-menu"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {pluralize} from "src/util/pluralize"
import {TableView, ListView} from "src/zui-kit"
import styles from "./results.module.css"
import {Pill} from "src/components/pill"
import {invoke} from "src/core/invoke"
import useResizeObserver from "use-resize-observer"

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
      setData(zed.decode(data))
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

export function useResultsControl(script: string, files: string[]) {
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

export function Results(
  props: {
    title: string
    className?: string
  } & ResultsControl
) {
  const {width, ref} = useResizeObserver()
  const smallWidth = width && width < 400
  return (
    <div className={classNames(styles.results, props.className)} ref={ref}>
      <header className={styles.toolbar}>
        <div className={styles.left}>
          <Pill>{props.title}</Pill>
        </div>
        <div className={styles.middle}>
          <ToolbarTabs
            onlyIcon={smallWidth}
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
        </div>
        <div className={styles.right}>
          <ButtonMenu
            items={[
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
                label: "Collapse All",
                click: () => props.display.collapseAll(),
              },
            ]}
            label="preview-results-menu"
          />
        </div>
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
        shape={props.values[0]?.type}
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
    <div className={styles.error}>
      <h3 className={styles.errorTitle}>ZQ Error</h3>
      <p>{props.error.toString().replaceAll("Error:", "").trim()}</p>
    </div>
  )
}
