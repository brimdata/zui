import {isEqual} from "lodash"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {showContextMenu} from "src/js/lib/System"
import Columns from "src/js/state/Columns"
import SearchBar from "src/js/state/SearchBar"
import {ZealotContext, zed} from "zealot"

export default function detailFieldContextMenu({field, record, value}) {
  return (_, getState, {api}) => {
    const columns = Columns.getCurrentTableColumns(getState())
      .getColumns()
      .map((c) => c.name)
    const program = SearchBar.getSearchProgram(getState())
    const isTime = value instanceof zed.Time
    const isGroupBy = hasGroupByProc(program)
    const isIp = value instanceof zed.Ip
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(record.columns.sort(), columns.sort())
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

    const detailMenuActions = menu.actions.detail

    const fieldData = ZealotContext.encodeField(field)
    const recordData = ZealotContext.encodeRecord(record)

    const pluginMenuItems = api.contextMenus.detail
      .list()
      .map((ctxBuilder) => ctxBuilder({record, field}))

    showContextMenu([
      detailMenuActions.include.menuItem([fieldData], {
        enabled: hasCol,
        visible: isPrimitive
      }),
      detailMenuActions.exclude.menuItem([fieldData], {
        enabled: hasCol,
        visible: isPrimitive
      }),
      detailMenuActions.in.menuItem([fieldData], {
        visible: isArrayish
      }),
      detailMenuActions.notIn.menuItem([fieldData], {
        visible: isArrayish
      }),
      detailMenuActions.freshInclude.menuItem([fieldData], {enabled: true}),
      menu.separator(),
      detailMenuActions.groupByDrillDown.menuItem([program, recordData], {
        enabled: isGroupBy && sameCols
      }),
      detailMenuActions.countBy.menuItem([fieldData], {enabled: !isGroupBy}),
      menu.separator(),
      detailMenuActions.copy.menuItem([fieldData]),
      menu.separator(),
      detailMenuActions.sortAsc.menuItem([fieldData], {enabled: hasCol}),
      detailMenuActions.sortDesc.menuItem([fieldData], {enabled: hasCol}),
      menu.separator(),
      detailMenuActions.fromTime.menuItem([fieldData], {enabled: isTime}),
      detailMenuActions.toTime.menuItem([fieldData], {enabled: isTime}),
      menu.separator(),
      detailMenuActions.detail.menuItem([recordData], {enabled: true}),
      menu.separator(),
      detailMenuActions.whoisRightclick.menuItem([fieldData], {enabled: isIp}),
      detailMenuActions.virusTotalRightclick.menuItem([fieldData], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      detailMenuActions.logResult.menuItem([fieldData, recordData], {
        enabled: true
      }),
      ...pluginMenuItems
    ])
  }
}
