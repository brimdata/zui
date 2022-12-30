import {zed} from "@brimdata/zealot"
import {isEqual} from "lodash"
import {ZedTableApi} from "src/components/zed-table/api"
import {Column} from "src/components/zed-table/column"
import BrimApi from "src/js/api"
import {
  appendQueryCountBy,
  appendQuerySortBy,
} from "src/js/flows/searchBar/actions"
import submitSearch from "../query-home/flows/submit-search"
import {createMenu} from "src/core/menu"

function getWhenContext(api: BrimApi, column: Column) {
  const query = api.current.query
  const ast = query.toAst()
  const sorts = ast.sorts
  return {
    isRecord: zed.trueType(column.type) instanceof zed.TypeRecord,
    isGrouped: column.isGrouped,
    isSortedAsc: !!sorts.find((sort) => isEqual(sort, [column.path, "asc"])),
    isSortedDesc: !!sorts.find((sort) => isEqual(sort, [column.path, "desc"])),
    isSummarized: ast.isSummarized,
  }
}

export const headerContextMenu = createMenu(
  "headerContextMenu",
  (ctx, api: ZedTableApi, column: Column) => {
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
