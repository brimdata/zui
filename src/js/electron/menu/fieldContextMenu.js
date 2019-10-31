/* @flow */
import {isEqual} from "lodash"

import type {Space} from "../../lib/Space"
import {hasGroupByProc} from "../../lib/Program"
import Field, {TimeField} from "../../models/Field"
import Log from "../../models/Log"
import menu from "./"

export default function fieldContextMenu(
  program: string,
  columns: string[],
  space: Space
) {
  return function(field: Field, log: Log) {
    const isTime = field instanceof TimeField
    const isConn = log.isPath("conn")
    const isGroupBy = hasGroupByProc(program)
    const isAddr = ["addr", "set[addr]"].includes(field.type)
    const hasCol = columns.includes(field.name)
    const sameCols = isEqual(
      log.descriptor.map((d) => d.name).sort(),
      columns.sort()
    )
    const hasPackets = space.packet_support
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
      menu.actions.include.menuItem([field], {enabled: !isTime && hasCol}),
      menu.actions.exclude.menuItem([field], {enabled: !isTime && hasCol}),
      menu.actions.freshInclude.menuItem([field], {enabled: true}),
      menu.separator(),
      menu.actions.groupByDrillDown.menuItem([program, log], {
        enabled: isGroupBy && sameCols
      }),
      menu.actions.countBy.menuItem([field], {enabled: !isTime && !isGroupBy}),
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
      menu.actions.whoisRightclick.menuItem([field], {enabled: isAddr}),
      menu.actions.virusTotalRightclick.menuItem([field], {
        enabled: virusTotal || isAddr
      }),
      menu.separator(),
      menu.actions.logResult.menuItem([field, log], {enabled: true})
    ]
  }
}
