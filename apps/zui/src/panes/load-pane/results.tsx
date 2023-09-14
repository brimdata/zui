import * as zed from "@brimdata/zed-js"
import classNames from "classnames"
import {memo, useCallback, useState, useTransition} from "react"
import {ZedScript} from "src/app/core/models/zed-script"
import {ButtonMenu} from "src/components/button-menu"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {pluralize} from "src/util/pluralize"
import {TableView, ListView} from "src/zui-kit"
import styles from "./results.module.css"
import {Pill} from "src/components/pill"
import {invoke} from "src/core/invoke"
import useResizeObserver from "use-resize-observer"
import {useMemoObject} from "src/util/hooks/use-memo-object"
import {ErrorWell} from "src/components/error-well"

function append(script: string, suffix: string) {
  const zed = new ZedScript(script)
  const s = zed.isEmpty() ? "*" : script
  return s + "\n" + suffix
}

function limit(script: string) {
  return append(script, " | head 100")
}

function useZq(files: string[], format: zed.LoadFormat) {
  const [_, start] = useTransition()
  const [error, setError] = useState("")
  const [data, setData] = useState<zed.Value[]>([])
  const display = useResultsDisplay()

  const query = useCallback(
    async (script: string) => {
      const {data, error} = await invoke(
        "loaders.previewShaper",
        files,
        script,
        format
      )
      start(() => {
        setError(error)
        setData(zed.decode(data))
      })
    },
    [files, format]
  )

  return useMemoObject({error, data, query, display})
}

function useResultsDisplay() {
  const [format, setFormat] = useState<ResultDisplay>("list")
  const [listState, setListState] = useState({valueExpandedDefault: true})
  const [tableState, setTableState] = useState({})

  const listControl = useMemoObject({value: listState, onChange: setListState})
  const tableControl = useMemoObject({
    value: tableState,
    onChange: setTableState,
  })

  const expandAll = useCallback(
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
    },
    [format]
  )

  const collapseAll = useCallback(
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
    },
    [format]
  )

  const state = format === "list" ? listControl : tableControl

  return useMemoObject({format, setFormat, state, expandAll, collapseAll})
}

type ResultDisplay = "list" | "table"
type ResultDimension = "values" | "types"

export function useResultsControl(files: string[], format: zed.LoadFormat) {
  const values = useZq(files, format)
  const types = useZq(files, format)
  const count = useZq(files, format)
  const [dimension, setDimension] = useState<ResultDimension>("values")

  const queryAll = useCallback(
    (script: string) => {
      values.query(limit(script))
      types.query(append(script, " | by typeof(this)"))
      count.query(append(script, " | count()"))
    },
    [values, types, count]
  )

  function getDimension() {
    if (dimension === "values") return values
    if (dimension === "types") return types
    throw new Error("Unknown Dimension")
  }

  const current = getDimension()

  return useMemoObject({
    queryAll,
    dimension,
    setDimension,
    display: current.display,
    values: current.data,
    error: current.error,
    rowCount: count.data[0]?.toJS(),
    typeCount: types.data.length,
  })
}

export type ResultsControl = ReturnType<typeof useResultsControl>

function Toolbar(props: {
  title: string
  display: ResultsControl["display"]
  smallWidth: boolean
}) {
  return (
    <header className={styles.toolbar}>
      <div className={styles.left}>
        <Pill>{props.title}</Pill>
      </div>
      <div className={styles.middle}>
        <ToolbarTabs
          onlyIcon={props.smallWidth}
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
  )
}

export const Results = memo(function Results(
  props: {
    title: string
    className?: string
  } & ResultsControl
) {
  const {width, ref} = useResizeObserver()
  const smallWidth = width && width < 400
  return (
    <div className={classNames(styles.results, props.className)} ref={ref}>
      <Toolbar
        display={props.display}
        title={props.title}
        smallWidth={smallWidth}
      />
      <section>
        {props.error ? (
          <ErrorWell title="ZQ Error" error={props.error} />
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
})

const ResultsBody = memo(function ResultsBody(props: {
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
})
