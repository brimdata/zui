/* @flow */
import {isEqual} from "lodash"

import type {$Field} from "../../brim"
import type {Space} from "../../state/Spaces/types"
import {hasGroupByProc} from "../../lib/Program"
import Log from "../../models/Log"
import menu from "./"

export default function fieldContextMenu(
  program: string,
  columns: string[],
  space: Space
) {
  return function(field: $Field, log: Log, compound: boolean) {
    const isTime = field.type === "time"
    const isConn = log.isPath("conn")
    const isGroupBy = hasGroupByProc(program)
    const isIp = ["ip", "set[ip]"].includes(field.type)
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(
      log.descriptor.map((d) => d.name).sort(),
      columns.sort()
    )
    const hasPackets = space && space.packet_support
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

    return [
      menu.actions.include.menuItem([field], {
        enabled: hasCol,
        visible: !compound
      }),
      menu.actions.exclude.menuItem([field], {
        enabled: hasCol,
        visible: !compound
      }),
      menu.actions.in.menuItem([field], {
        visible: !!compound
      }),
      menu.actions.notIn.menuItem([field], {
        visible: !!compound
      }),
      menu.actions.freshInclude.menuItem([field], {enabled: true}),
      menu.separator(),
      menu.actions.groupByDrillDown.menuItem([program, log], {
        enabled: isGroupBy && sameCols
      }),
      menu.actions.countBy.menuItem([field], {enabled: !isGroupBy}),
      menu.separator(),
      menu.actions.sortAsc.menuItem([field], {enabled: hasCol}),
      menu.actions.sortDesc.menuItem([field], {enabled: hasCol}),
      menu.separator(),
      menu.actions.fromTime.menuItem([field], {enabled: isTime}),
      menu.actions.toTime.menuItem([field], {enabled: isTime}),
      menu.separator(),
      menu.actions.pcaps.menuItem([log], {enabled: isConn && hasPackets}),
      menu.actions.detail.menuItem([log], {enabled: true}),
      menu.separator(),
      menu.actions.whoisRightclick.menuItem([field], {enabled: isIp}),
      menu.actions.virusTotalRightclick.menuItem([field], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      menu.actions.logResult.menuItem([field, log], {enabled: true})
    ]
  }
}
