import {Data, Name, Value} from "src/app/core/Data"
import Panel from "src/app/detail/Panel"
import PanelHeading from "src/app/detail/PanelHeading"
import {Caption, ChartWrap, TableWrap} from "src/app/detail/Shared"
import {
  SecurityEvent,
  SecurityEventInterface,
} from "src/ppl/detail/models/security-event"
import React, {memo, useCallback, useMemo} from "react"
import {showContextMenu} from "src/js/lib/System"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"
import {SURICATA_CONNS} from "src/plugins/zui-suricata"
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
    <section>
      <PanelHeading isLoading={isFetching}>Related Connections</PanelHeading>
      <Panel>
        <ChartWrap>
          <EventTimeline events={events} />
          <EventLimit query={query} count={events.length} limit={perPage} />
        </ChartWrap>
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
