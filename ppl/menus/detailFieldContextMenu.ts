import {MenuItemConstructorOptions} from "electron/main"
import {isEqual} from "lodash"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {Space} from "src/js/state/Spaces/types"
import {ZedField, ZedPrimitive, ZedRecord} from "zealot/zed"

export default function detailFieldContextMenu(
  program: string,
  columns: string[],
  space: Space
) {
  return function(
    field: ZedField,
    log: ZedRecord,
    compound: boolean
  ): MenuItemConstructorOptions[] {
    const isTime =
      field.data instanceof ZedPrimitive && field.data.type === "time"
    const isConn = log.try("_path")?.toString() === "conn"
    const isGroupBy = hasGroupByProc(program)
    const isIp = field.data instanceof ZedPrimitive && field.data.type === "ip"
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(log.columns.sort(), columns.sort())
    const hasPackets = space && space.pcap_support
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

    const fieldData = field.serialize()
    const recordData = log.serialize()

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
      detailMenuActions.pcaps.menuItem([recordData], {
        enabled: isConn && hasPackets
      }),
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
