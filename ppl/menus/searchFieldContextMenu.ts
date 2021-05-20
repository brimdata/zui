import {isEqual} from "lodash"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {showContextMenu} from "src/js/lib/System"
import Columns from "src/js/state/Columns"
import SearchBar from "src/js/state/SearchBar"
import {ZealotContext, zed} from "zealot"

export default function searchFieldContextMenu({field, record, value}) {
  return (_, getState, {api}) => {
    const columns = Columns.getCurrentTableColumns(getState())
      .getColumns()
      .map((c) => c.name)
    const program = SearchBar.getSearchProgram(getState())
    const isTime = value instanceof zed.Time
    const isGroupBy = hasGroupByProc(program)
    const isIp = value instanceof zed.Ip
    const hasCol = columns.includes(field.name)
    const flatColNames = record.flatten().columns
    const sameCols = isEqual(flatColNames.sort(), columns.sort())
    const isPrimitive = field.value instanceof zed.Primitive
    const isArrayish =
      field.value instanceof zed.Array || field.value instanceof zed.Set

    const virusTotal = [
      "hassh",
      "host",
      "ja3",
      "ja3s",
      "md5",
      "sha1",
      "sha256",
      "server_name",
      "query"
    ].includes(field.name)

    const searchMenuActions = menu.actions.search
    // A bit of a hack
    field.value = value
    const fieldData = ZealotContext.encodeField(field)
    const recordData = ZealotContext.encodeRecord(record)

    const pluginMenuItems = api.contextMenus.search
      .list()
      .map((ctxBuilder) => ctxBuilder({record, field}))

    showContextMenu([
      searchMenuActions.include.menuItem([fieldData], {
        enabled: hasCol,
        visible: isPrimitive
      }),
      searchMenuActions.exclude.menuItem([fieldData], {
        enabled: hasCol,
        visible: isPrimitive
      }),
      searchMenuActions.in.menuItem([fieldData], {
        visible: isArrayish
      }),
      searchMenuActions.notIn.menuItem([fieldData], {
        visible: isArrayish
      }),
      searchMenuActions.freshInclude.menuItem([fieldData], {enabled: true}),
      menu.separator(),
      searchMenuActions.groupByDrillDown.menuItem([program, recordData], {
        enabled: isGroupBy && sameCols
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
        enabled: isTime
      }),
      menu.separator(),
      searchMenuActions.detail.menuItem([recordData], {enabled: true}),
      menu.separator(),
      searchMenuActions.whoisRightclick.menuItem([fieldData], {enabled: isIp}),
      searchMenuActions.virusTotalRightclick.menuItem([fieldData], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      searchMenuActions.logResult.menuItem([fieldData, recordData], {
        enabled: true
      }),
      ...pluginMenuItems
    ])
  }
}
