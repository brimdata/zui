import {encode, zed} from "@brimdata/zealot"
import {isEqual} from "lodash"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {showContextMenu} from "src/js/lib/System"
import Columns from "src/js/state/Columns"
import SearchBar from "src/js/state/SearchBar"
import {Thunk} from "src/js/state/types"

type Args = {
  field: zed.Field
  record: zed.Record
  value: zed.Value
}

// Anything done here usually needs to be copied to detailFieldContextMenu
export default function searchFieldContextMenu({
  field,
  record,
  value,
}: Args): Thunk {
  return (_, getState, {api}) => {
    const columns = Columns.getCurrentTableColumns(getState())
      .getColumns()
      .map((c) => c.name)
    const program = SearchBar.getSearchProgram(getState())
    const isTime = value instanceof zed.Time
    const isGroupBy = hasGroupByProc(program)
    const isIp = value instanceof zed.Ip
    const hasCol = !!columns.find((c) => isEqual([].concat(c), field.path))
    const sameCols = isEqual(record.flatColumns.sort(), columns.sort())
    const isPrimitive = zed.isPrimitive(field.value)
    const isArrayish = zed.isIterable(field.value)
    let index = -1
    if (zed.isIterable(field.value)) {
      index = field.value.indexOf(value)
    }

    const virusTotal = [
      "hassh",
      "host",
      "ja3",
      "ja3s",
      "md5",
      "sha1",
      "sha256",
      "server_name",
      "query",
    ].includes(field.name)

    const searchMenuActions = menu.actions.search
    const fieldData = encode(field)
    const recordData = encode(record)
    const pluginMenuItems = api.contextMenus.search
      .list()
      .map((ctxBuilder) => ctxBuilder({record, field}))

    showContextMenu([
      searchMenuActions.include.menuItem([fieldData], {
        enabled: hasCol,
        visible: isPrimitive,
      }),
      searchMenuActions.exclude.menuItem([fieldData], {
        enabled: hasCol,
        visible: isPrimitive,
      }),
      searchMenuActions.in.menuItem([fieldData, index], {
        visible: isArrayish,
      }),
      searchMenuActions.notIn.menuItem([fieldData, index], {
        visible: isArrayish,
      }),
      searchMenuActions.freshInclude.menuItem([fieldData], {enabled: true}),
      menu.separator(),
      searchMenuActions.groupByDrillDown.menuItem([program, recordData], {
        enabled: isGroupBy && sameCols,
      }),
      searchMenuActions.countBy.menuItem([fieldData], {enabled: !isGroupBy}),
      menu.separator(),
      searchMenuActions.copy.menuItem([fieldData]),
      menu.separator(),
      searchMenuActions.sortAsc.menuItem([fieldData], {enabled: hasCol}),
      searchMenuActions.sortDesc.menuItem([fieldData], {enabled: hasCol}),
      menu.separator(),
      searchMenuActions.fromTime.menuItem([fieldData], {enabled: isTime}),
      searchMenuActions.toTime.menuItem([fieldData], {enabled: isTime}),
      searchMenuActions.jumpToTime.menuItem([fieldData, recordData], {
        enabled: isTime,
      }),
      menu.separator(),
      searchMenuActions.detail.menuItem([recordData], {enabled: true}),
      menu.separator(),
      searchMenuActions.whoisRightclick.menuItem([fieldData], {enabled: isIp}),
      searchMenuActions.virusTotalRightclick.menuItem([fieldData], {
        enabled: virusTotal || isIp,
      }),
      menu.separator(),
      searchMenuActions.logResult.menuItem([fieldData, recordData], {
        enabled: true,
      }),
      ...pluginMenuItems,
    ])
  }
}
