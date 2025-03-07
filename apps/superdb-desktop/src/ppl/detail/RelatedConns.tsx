import {Data, Name, Value} from "src/components/data"
import Panel from "src/views/detail-pane/Panel"
import PanelHeading from "src/views/detail-pane/PanelHeading"
import {Caption, TableWrap} from "src/views/detail-pane/Shared"
import {
  SecurityEvent,
  SecurityEventInterface,
} from "src/ppl/detail/models/security-event"
import React, {memo, useCallback, useMemo} from "react"
import {showContextMenu} from "src/core/menu"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {SURICATA_CONNS} from "src/plugins/brimcap/suricata/ids"
import time from "src/js/models/time"

const id = SURICATA_CONNS

export default memo(function RelatedConns() {
  const records = useSelector(Results.getValues(id))
  const isFetching = useSelector(Results.isFetching(id))
  const query = useSelector(Results.getQuery(id))
  const perPage = useSelector(Results.getPerPage(id))
  const events = useMemo(() => records.map(SecurityEvent.build), [records])
  const [first, last] = firstLast<SecurityEventInterface>(events)
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
      <PanelHeading isLoading={isFetching}>Related Connections</PanelHeading>
      <Panel>
        <div>
          <EventTimeline events={events} />
          <EventLimit query={query} count={events.length} limit={perPage} />
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
