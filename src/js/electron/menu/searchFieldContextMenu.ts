import {isEqual} from "lodash"

import {$Field} from "../../brim"
import {Space} from "../../state/Spaces/types"
import {hasGroupByProc} from "../../lib/Program"
import Log from "../../models/Log"
import menu from "./"
import {RightClickBuilder} from "src/js/types"
import {MenuItemConstructorOptions} from "electron"

export default function searchFieldContextMenu(
  program: string,
  columns: string[],
  space: Space
): RightClickBuilder {
  return function(
    field: $Field,
    log: Log,
    compound: boolean
  ): MenuItemConstructorOptions[] {
    const isTime = field.type === "time"
    const isConn = log.isPath("conn")
    const isGroupBy = hasGroupByProc(program)
    const isIp = ["addr", "set[addr]"].includes(field.type)
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(
      log.descriptor.map((d) => d.name).sort(),
      columns.sort()
    )
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

    const searchMenuActions = menu.actions.search

    const fieldData = field.serialize()
    const logData = log.serialize()

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
      searchMenuActions.groupByDrillDown.menuItem([program, logData], {
        enabled: isGroupBy && sameCols
      }),
      searchMenuActions.countBy.menuItem([fieldData], {enabled: !isGroupBy}),
      menu.separator(),
      searchMenuActions.sortAsc.menuItem([fieldData], {enabled: hasCol}),
      searchMenuActions.sortDesc.menuItem([fieldData], {enabled: hasCol}),
      menu.separator(),
      searchMenuActions.fromTime.menuItem([fieldData], {enabled: isTime}),
      searchMenuActions.toTime.menuItem([fieldData], {enabled: isTime}),
      searchMenuActions.jumpToTime.menuItem([fieldData, logData], {
        enabled: isTime
      }),
      menu.separator(),
      searchMenuActions.pcaps.menuItem([logData], {
        enabled: isConn && hasPackets
      }),
      searchMenuActions.detail.menuItem([logData], {enabled: true}),
      menu.separator(),
      searchMenuActions.whoisRightclick.menuItem([fieldData], {enabled: isIp}),
      searchMenuActions.virusTotalRightclick.menuItem([fieldData], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      searchMenuActions.logResult.menuItem([fieldData, logData], {
        enabled: true
      })
    ]
  }
}
