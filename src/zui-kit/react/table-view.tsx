import React, {forwardRef, useImperativeHandle, useMemo} from "react"
import {Provider} from "../../components/zed-table/context"
import {Grid} from "../../components/zed-table/grid"
import classNames from "classnames"
import {TableViewArgs} from "../core/table-view/types"
import {ReactAdapterProps} from "./types"
import {defaultTableViewState} from "../core/table-view/state"
import {TableViewApi} from "../core/table-view/table-view-api"
import {useStateControllers} from "./use-state-controllers"

export const TableView = forwardRef(function TableView(
  props: TableViewArgs & ReactAdapterProps,
  ref
) {
  const controllers = useStateControllers(props, defaultTableViewState)
  const args = {...props, ...controllers}
  const api = useMemo(
    () => new TableViewApi(args),
    [
      args.values,
      args.shape,
      args.columnVisibleState.value,
      args.columnExpandedState.value,
    ]
  )

  api.update(args)

  useImperativeHandle(ref, () => api, [api])

  return (
    <Provider value={api}>
      <div
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
