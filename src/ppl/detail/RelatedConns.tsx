import {Data, Name, Value} from "src/app/core/Data"
import Panel from "src/app/detail/Panel"
import PanelHeading from "src/app/detail/PanelHeading"
import {Caption, ChartWrap, TableWrap} from "src/app/detail/Shared"
import {BrimEvent, BrimEventInterface} from "src/ppl/detail/models/BrimEvent"
import React, {memo, useCallback, useMemo} from "react"
import brim from "src/js/brim"
import {showContextMenu} from "src/js/lib/System"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"
import {SURICATA_CONNS} from "src/js/api/correlations/run-suricata-conns"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"

export default memo(function RelatedConns() {
  const records = useSelector(Results.getValues(SURICATA_CONNS))
  const isFetching = useSelector(Results.isFetching(SURICATA_CONNS))
  const query = useSelector(Results.getQuery(SURICATA_CONNS))
  const perPage = useSelector(Results.getPerPage(SURICATA_CONNS))
  const events = useMemo(() => records.map(BrimEvent.build), [records])
  const [first, last] = firstLast<BrimEventInterface>(events)
  const data = [
    ["Count", events.length],
    ["First ts", first ? brim.time(first.getTime()).format() : "Not available"],
    ["Last ts", last ? brim.time(last.getTime()).format() : "Not available"],
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
