import {MenuItemConstructorOptions} from "electron"
import {isEqual} from "lodash"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {RightClickBuilder} from "src/js/types"
import {ZealotContext, zed} from "zealot"

export default function searchFieldContextMenu(
  program: string,
  columns: string[]
): RightClickBuilder {
  return function(
    field: zed.Field,
    log: zed.Record,
    compound: boolean
  ): MenuItemConstructorOptions[] {
    const isTime = field.data instanceof zed.Time
    const isGroupBy = hasGroupByProc(program)
    const isIp = field.data instanceof zed.Ip
    const hasCol = columns.includes(field.name)
    const flatColNames = log.flatten().columns
    const sameCols = isEqual(flatColNames.sort(), columns.sort())
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

    const fieldData = ZealotContext.encodeField(field)
    const recordData = ZealotContext.encodeRecord(log)

    return [
      searchMenuActions.include.menuItem([fieldData], {
        enabled: hasCol,
        visible: !compound
      }),
      searchMenuActions.exclude.menuItem([fieldData], {
        enabled: hasCol,
        visible: !compound
      }),
      searchMenuActions.in.menuItem([fieldData], {
        visible: !!compound
      }),
      searchMenuActions.notIn.menuItem([fieldData], {
        visible: !!compound
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
      })
    ]
  }
}
