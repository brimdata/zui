import {MenuItemConstructorOptions} from "electron/main"
import {isEqual} from "lodash"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {ZealotContext} from "zealot"
import {zed} from "zealot"

export default function detailFieldContextMenu(
  program: string,
  columns: string[]
) {
  return function(
    field: zed.Field,
    log: zed.Record,
    compound: boolean
  ): MenuItemConstructorOptions[] {
    const isTime = field.data instanceof zed.Time
    const isGroupBy = hasGroupByProc(program)
    const isIp = field.data instanceof zed.Ip
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(log.columns.sort(), columns.sort())
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
    const recordData = ZealotContext.encodeRecord(log)

    return [
      detailMenuActions.include.menuItem([fieldData], {
        enabled: hasCol,
        visible: !compound
      }),
      detailMenuActions.exclude.menuItem([fieldData], {
        enabled: hasCol,
        visible: !compound
      }),
      detailMenuActions.in.menuItem([fieldData], {
        visible: !!compound
      }),
      detailMenuActions.notIn.menuItem([fieldData], {
        visible: !!compound
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
      })
    ]
  }
}
