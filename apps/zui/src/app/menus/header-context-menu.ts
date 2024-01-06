import {TableViewApi} from "src/zui-kit/core/table-view/table-view-api"
import {ZedColumn} from "src/components/zed-table/column"
import ZuiApi from "src/js/api/zui-api"
import {
  appendQueryCountBy,
  appendQuerySortBy,
} from "src/js/flows/searchBar/actions"
import {createMenu} from "src/core/menu"
import {submitSearch} from "src/domain/session/handlers"

function getWhenContext(api: ZuiApi, column: ZedColumn) {
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
  (ctx, api: TableViewApi, column: ZedColumn) => {
    const when = getWhenContext(ctx.api, column)
    const dispatch = ctx.api.dispatch
    return [
      {
        label: "Sort Asc",
        enabled: !when.isSortedAsc,
        click: () => {
          dispatch(appendQuerySortBy(column.path, "asc"))
          submitSearch()
        },
      },
      {
        label: "Sort Desc",
        enabled: !when.isSortedDesc,
        click: () => {
          dispatch(appendQuerySortBy(column.path, "desc"))
          submitSearch()
        },
      },
      {
        type: "separator",
      },
      {
        label: "Count by Field",
        enabled: !when.isSummarized,
        click: () => {
          dispatch(appendQueryCountBy(column.path))
          submitSearch()
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
