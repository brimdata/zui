import {isEqual} from "lodash"

import {$Field} from "../../brim"
import {Space} from "../../state/Spaces/types"
import {hasGroupByProc} from "../../lib/Program"
import Log from "../../models/Log"
import menu from "./"

export default function detailFieldContextMenu(
  program: string,
  columns: string[],
  space: Space
) {
  return function(field: $Field, log: Log, compound: boolean) {
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

    const detailMenuActions = menu.actions.detail

    const fieldData = field.serialize()
    const logData = log.serialize()

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
      detailMenuActions.groupByDrillDown.menuItem([program, logData], {
        enabled: isGroupBy && sameCols
      }),
      detailMenuActions.countBy.menuItem([fieldData], {enabled: !isGroupBy}),
      menu.separator(),
      detailMenuActions.sortAsc.menuItem([fieldData], {enabled: hasCol}),
      detailMenuActions.sortDesc.menuItem([fieldData], {enabled: hasCol}),
      menu.separator(),
      detailMenuActions.fromTime.menuItem([fieldData], {enabled: isTime}),
      detailMenuActions.toTime.menuItem([fieldData], {enabled: isTime}),
      menu.separator(),
      detailMenuActions.pcaps.menuItem([logData], {
        enabled: isConn && hasPackets
      }),
      detailMenuActions.detail.menuItem([logData], {enabled: true}),
      menu.separator(),
      detailMenuActions.whoisRightclick.menuItem([fieldData], {enabled: isIp}),
      detailMenuActions.virusTotalRightclick.menuItem([fieldData], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      detailMenuActions.logResult.menuItem([fieldData, logData], {
        enabled: true
      })
    ]
  }
}
