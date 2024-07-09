import {Data, Name, Value} from "src/components/data"
import Panel from "src/views/detail-pane/Panel"
import PanelHeading from "src/views/detail-pane/PanelHeading"
import {Caption, TableWrap} from "src/views/detail-pane/Shared"
import {isEqual} from "lodash"
import {SecurityEvent} from "src/ppl/detail/models/security-event"
import React, {memo, useCallback, useMemo} from "react"
import {showContextMenu} from "src/core/menu"
import * as zed from "@brimdata/zed-js"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {SURICATA_ALERTS} from "src/plugins/brimcap/suricata/ids"
import time from "src/js/models/time"

type Props = {record: zed.Record}

const id = SURICATA_ALERTS

export default memo(function RelatedAlerts({record}: Props) {
  const records = useSelector(Results.getValues(id))
  const isFetching = useSelector(Results.isFetching(id))
  const query = useSelector(Results.getQuery(id))
  const perPage = useSelector(Results.getPerPage(id))
  const events = useMemo(() => records.map(SecurityEvent.build), [records])
  const [first, last] = firstLast(events)
  const current = useMemo(
    () => events.findIndex((e) => isEqual(e.getRecord(), record)),
    [events, record]
  )
  const data = [
    ["Count", events.length],
    ["First ts", first ? time(first.getTime()).format() : "Not available"],
    ["Last ts", last ? time(last.getTime()).format() : "Not available"],
    ["Duration", formatDur(first?.getTime(), last?.getTime())],
  ]

  const onContextMenu = useCallback(() => {
    showContextMenu([{role: "copy"}])
  }, [])

  return (
    <section className="sidebar-card box">
      <PanelHeading isLoading={isFetching}>Related Alerts</PanelHeading>
      <Panel>
        <div>
          <EventTimeline events={events} current={current}></EventTimeline>
          <EventLimit count={events.length} query={query} limit={perPage} />
        </div>
        <TableWrap>
          {data.map(([name, value]) => (
            <Data key={name}>
              <Name>{name}</Name>
              <Value onContextMenu={onContextMenu}>{value}</Value>
            </Data>
          ))}
        </TableWrap>
      </Panel>
      <Caption>Populated by community_id</Caption>
    </section>
  )
})
