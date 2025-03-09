import React, {forwardRef, useImperativeHandle, useMemo} from "react"
import {Provider} from "./context"
import {Grid} from "./grid"
import classNames from "classnames"
import {TableViewArgs} from "../core/table-view/types"
import {ReactAdapterProps} from "../types/types"
import {defaultTableViewState} from "../core/table-view/state"
import {TableViewApi} from "./table-view-api"
import {useStateControllers} from "../utils/use-state-controllers"

export const TableView = forwardRef(function TableView(
  props: TableViewArgs & ReactAdapterProps,
  ref
) {
  const {shape, values} = props
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
        role="grid"
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
