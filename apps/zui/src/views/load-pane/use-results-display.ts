import {useState, useCallback} from "react"
import {useMemoObject} from "src/util/hooks/use-memo-object"
export type ResultDisplay = "list" | "table"
export type ResultDimension = "values" | "types"

export function useResultsDisplay() {
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
