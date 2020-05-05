/* @flow */
import {isEqual} from "lodash"

import type {$Field} from "../../brim"
import type {Space} from "../../state/Spaces/types"
import {hasGroupByProc} from "../../lib/Program"
import Log from "../../models/Log"
import menu from "./"

export default function searchFieldContextMenu(
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

    const searchMenuActions = menu.actions.search

    return [
      searchMenuActions.include.menuItem([field], {
        enabled: hasCol,
        visible: !compound
      }),
      searchMenuActions.exclude.menuItem([field], {
        enabled: hasCol,
        visible: !compound
      }),
      searchMenuActions.in.menuItem([field], {
        visible: !!compound
      }),
      searchMenuActions.notIn.menuItem([field], {
        visible: !!compound
      }),
      searchMenuActions.freshInclude.menuItem([field], {enabled: true}),
      menu.separator(),
      searchMenuActions.groupByDrillDown.menuItem([program, log], {
        enabled: isGroupBy && sameCols
      }),
      searchMenuActions.countBy.menuItem([field], {enabled: !isGroupBy}),
      menu.separator(),
      searchMenuActions.sortAsc.menuItem([field], {enabled: hasCol}),
      searchMenuActions.sortDesc.menuItem([field], {enabled: hasCol}),
      menu.separator(),
      searchMenuActions.fromTime.menuItem([field], {enabled: isTime}),
      searchMenuActions.toTime.menuItem([field], {enabled: isTime}),
      menu.separator(),
      searchMenuActions.pcaps.menuItem([log], {enabled: isConn && hasPackets}),
      searchMenuActions.detail.menuItem([log], {enabled: true}),
      menu.separator(),
      searchMenuActions.whoisRightclick.menuItem([field], {enabled: isIp}),
      searchMenuActions.virusTotalRightclick.menuItem([field], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      searchMenuActions.logResult.menuItem([field, log], {enabled: true})
    ]
  }
}
