/* @flow */
import {isEqual} from "lodash"

import type {$Field} from "../../brim"
import type {Space} from "../../state/Spaces/types"
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

    return [
      detailMenuActions.include.menuItem([field], {
        enabled: hasCol,
        visible: !compound
      }),
      detailMenuActions.exclude.menuItem([field], {
        enabled: hasCol,
        visible: !compound
      }),
      detailMenuActions.in.menuItem([field], {
        visible: !!compound
      }),
      detailMenuActions.notIn.menuItem([field], {
        visible: !!compound
      }),
      detailMenuActions.freshInclude.menuItem([field], {enabled: true}),
      menu.separator(),
      detailMenuActions.groupByDrillDown.menuItem([program, log], {
        enabled: isGroupBy && sameCols
      }),
      detailMenuActions.countBy.menuItem([field], {enabled: !isGroupBy}),
      menu.separator(),
      detailMenuActions.sortAsc.menuItem([field], {enabled: hasCol}),
      detailMenuActions.sortDesc.menuItem([field], {enabled: hasCol}),
      menu.separator(),
      detailMenuActions.fromTime.menuItem([field], {enabled: isTime}),
      detailMenuActions.toTime.menuItem([field], {enabled: isTime}),
      menu.separator(),
      detailMenuActions.pcaps.menuItem([log], {enabled: isConn && hasPackets}),
      detailMenuActions.detail.menuItem([log], {enabled: true}),
      menu.separator(),
      detailMenuActions.whoisRightclick.menuItem([field], {enabled: isIp}),
      detailMenuActions.virusTotalRightclick.menuItem([field], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      detailMenuActions.logResult.menuItem([field, log], {enabled: true})
    ]
  }
}
