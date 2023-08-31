import React, {forwardRef, useImperativeHandle, useMemo} from "react"
import {Provider} from "../../components/zed-table/context"
import {Grid} from "../../components/zed-table/grid"
import classNames from "classnames"
import {TableViewArgs} from "../core/table-view/types"
import {ReactAdapterProps} from "./types"
import {defaultTableViewState} from "../core/table-view/state"
import {TableViewApi} from "../core/table-view/table-view-api"
import {useStateControllers} from "./use-state-controllers"
import * as zed from "@brimdata/zed-js"

function useEnsureRecord(shape, values) {
  return useMemo(() => {
    if (shape instanceof zed.TypeRecord) {
      return [shape, values]
    } else {
      const wrappedValues = values.map((value) =>
        zed.createRecord({this: value})
      )
      const wrappedShape = wrappedValues[0]?.type
      return [wrappedShape, wrappedValues]
    }
  }, [shape, values])
}

export const TableView = forwardRef(function TableView(
  props: TableViewArgs & ReactAdapterProps,
  ref
) {
  const [shape, values] = useEnsureRecord(props.shape, props.values)
  const controllers = useStateControllers(props, defaultTableViewState)
  const args = {...props, ...controllers, shape, values}
  const api = useMemo(
    () => new TableViewApi(args),
    [
      values,
      shape,
      args.columnVisibleState.value,
      args.columnExpandedState.value,
    ]
  )

  api.update(args)

  useImperativeHandle(ref, () => api, [api])

  return (
    <Provider value={api}>
      <div
        role="table"
        className={classNames("zed-table", {
          "zed-table--resizing": api.isResizing,
        })}
        ref={(node) => (api.element = node)}
      >
        <Grid />
      </div>
    </Provider>
  )
})
