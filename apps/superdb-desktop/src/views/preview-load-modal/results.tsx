import * as zed from "../../../../../packages/superdb-types/dist"
import classNames from "classnames"
import {memo, useCallback, useState} from "react"
import {ZedScript} from "src/models/zed-script"
import {ButtonMenu} from "src/components/button-menu"
import {ToolbarTabs} from "src/components/toolbar-tabs"
import {pluralize} from "src/util/pluralize"
import {TableView, ListView} from "src/zui-kit"
import styles from "./results.module.css"
import {Pill} from "src/components/pill"
import useResizeObserver from "use-resize-observer"
import {useMemoObject} from "src/util/hooks/use-memo-object"
import {ErrorWell} from "src/components/error-well"
import {isNumber} from "lodash"
import {useZq} from "./use-zq"
import {ResultDimension, ResultDisplay} from "./use-results-display"
import {PathView} from "../results-pane/path-view"
import {BareStringView} from "../results-pane/bare-string-view"

const HEAD_LIMIT = 100

function append(script: string, suffix: string) {
  const zed = new ZedScript(script)
  const s = zed.isEmpty() ? "pass" : script
  return s + "\n" + suffix
}

function limit(script: string) {
  return append(script, ` | head ${HEAD_LIMIT}`)
}

export function useResultsControl(files: string[], format: zed.LoadFormat) {
  const values = useZq(files, format)
  const types = useZq(files, format)
  const count = useZq(files, format)
  const [dimension, setDimension] = useState<ResultDimension>("values")

  const queryAll = useCallback(
    (script: string) => {
      const abortValues = values.query(limit(script))
      const abortTypes = types.query(append(script, " | by typeof(this)"))
      const abortCount = count.query(append(script, " | count()"))
      return () => {
        abortValues()
        abortTypes()
        abortCount()
      }
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
    isLoading: current.isLoading,
    rowCount: count.isLoading ? undefined : count.data[0]?.toJS(),
    typeCount: types.isLoading ? undefined : types.data.length,
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
          name="resultsView"
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
                  ? "expand_horizontal"
                  : "expand",
              label: "Expand All",
              click: () => props.display.expandAll(),
            },
            {
              iconName:
                props.display.format === "table"
                  ? "collapse_horizontal"
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
          <ErrorWell
            title="Shaper Error"
            error={props.error}
            className={styles.error}
          />
        ) : props.isLoading ? (
          <Loading />
        ) : (
          <ResultsBody
            values={props.values}
            state={props.display.state}
            format={props.display.format}
            typeCount={props.typeCount}
          />
        )}
      </section>
      <footer>
        <button onClick={() => props.setDimension("types")}>
          {isNumber(props.typeCount) ? (
            <>
              <b>{props.typeCount}</b> {pluralize("Type", props.typeCount)}
            </>
          ) : (
            "Loading Types..."
          )}
        </button>
        <button onClick={() => props.setDimension("values")}>
          {isNumber(props.rowCount) ? (
            <>
              <b>{props.rowCount}</b> {pluralize("Row", props.rowCount)}
              {props.rowCount > HEAD_LIMIT && ` (First ${HEAD_LIMIT} Shown)`}
            </>
          ) : (
            "Loading Count..."
          )}
        </button>
      </footer>
    </div>
  )
})

const ResultsBody = memo(function ResultsBody(props: {
  format: ResultDisplay
  state: {value; onChange}
  values: zed.Value[]
  typeCount: number
}) {
  if (props.format === "table") {
    if (props.typeCount > 1) {
      return (
        <ErrorWell
          title="Unable To Render Table"
          error={
            "This data has more than one type.\nUse the 'fuse' operator to combine the types into one."
          }
          className={styles.error}
        />
      )
    }
    return (
      <TableView
        values={props.values}
        state={props.state}
        shape={props.values[0]?.type}
        viewConfig={{
          customViews: [PathView, BareStringView],
        }}
      />
    )
  }
  if (props.format === "list") {
    return (
      <ListView
        values={props.values}
        state={props.state}
        viewConfig={{customViews: [PathView]}}
      />
    )
  }
  throw new Error("Unknown Display")
})

export function Loading() {
  return (
    <div className={styles.loading}>
      <p>Loading...</p>
    </div>
  )
}
