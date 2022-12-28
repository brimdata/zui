import {zed} from "@brimdata/zealot"
import {ZedTableApi} from "src/components/zed-table/api"
import {Column} from "src/components/zed-table/column"
import {appendQuerySortBy} from "src/js/flows/searchBar/actions"
import submitSearch from "../query-home/flows/submit-search"
import {createMenu} from "./create-menu"

function getWhenContext(api: ZedTableApi, column: Column) {
  return {
    isRecord: zed.trueType(column.type) instanceof zed.TypeRecord,
    isGrouped: column.isGrouped,
  }
}

export const headerContextMenu = createMenu(
  "headerContextMenu",
  (ctx, api: ZedTableApi, column: Column) => {
    const when = getWhenContext(api, column)
    const dispatch = ctx.api.dispatch
    return [
      {
        label: "Sort Asc",
        click: () => {
          dispatch(appendQuerySortBy(column.path, "asc"))
          dispatch(submitSearch())
        },
      },
      {
        label: "Sort Desc",
        click: () => {
          dispatch(appendQuerySortBy(column.path, "desc"))
          dispatch(submitSearch())
        },
      },
      {
        type: "separator",
      },
      {
        label: "Expand Nested Fields",
        click: () => column.expand(),
        visible: when.isRecord,
        enabled: !when.isGrouped,
      },
      {
        label: "Collapse Nested Fields",
        click: () => column.collapse(),
        visible: when.isRecord,
        enabled: when.isGrouped,
      },
    ]
  }
)
