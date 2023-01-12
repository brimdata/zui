import {zed} from "@brimdata/zealot"
import {isEqual} from "lodash"
import {ZedTableApi} from "src/components/zed-table/zed-table-api"
import {ZedColumn} from "src/components/zed-table/column"
import BrimApi from "src/js/api"
import {
  appendQueryCountBy,
  appendQuerySortBy,
} from "src/js/flows/searchBar/actions"
import submitSearch from "../query-home/flows/submit-search"
import {createMenu} from "src/core/menu"

function getWhenContext(api: BrimApi, column: ZedColumn) {
  const query = api.current.query
  const ast = query.toAst()
  return {
    isRecord: column.isRecordType,
    isGrouped: column.isGrouped,
    isSortedAsc: column.isSortedAsc,
    isSortedDesc: column.isSortedDesc,
    isSummarized: ast.isSummarized,
  }
}

export const headerContextMenu = createMenu(
  "headerContextMenu",
  (ctx, api: ZedTableApi, column: ZedColumn) => {
    const when = getWhenContext(ctx.api, column)
    const dispatch = ctx.api.dispatch
    return [
      {
        label: "Sort Ascending",
        enabled: !when.isSortedAsc,
        click: () => {
          dispatch(appendQuerySortBy(column.path, "asc"))
          dispatch(submitSearch())
        },
      },
      {
        label: "Sort Descending",
        enabled: !when.isSortedDesc,
        click: () => {
          dispatch(appendQuerySortBy(column.path, "desc"))
          dispatch(submitSearch())
        },
      },
      {
        type: "separator",
      },
      {
        label: "Count by Field",
        enabled: !when.isSummarized,
        click: () => {
          dispatch(appendQueryCountBy(column.field))
          dispatch(submitSearch())
        },
      },
      {
        type: "separator",
      },
      {
        label: "Expand Headers",
        click: () => column.expand(),
        visible: when.isRecord,
        enabled: !when.isGrouped,
      },
      {
        label: "Collapse Headers",
        click: () => column.collapse(),
        visible: when.isRecord,
        enabled: when.isGrouped,
      },
      {type: "separator"},
      {
        label: "Hide Column",
        click: () => column.hide(),
      },
    ]
  }
)
