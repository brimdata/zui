import {Data, Name, Value} from "src/app/core/Data"
import Panel from "src/app/detail/Panel"
import PanelHeading from "src/app/detail/PanelHeading"
import {Caption, ChartWrap, TableWrap} from "src/app/detail/Shared"
import {isEqual} from "lodash"
import {BrimEvent} from "src/ppl/detail/models/BrimEvent"
import React, {memo, useCallback, useMemo} from "react"
import brim from "src/js/brim"
import {showContextMenu} from "src/js/lib/System"
import {zed} from "@brimdata/zealot"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"
import {SURICATA_ALERTS} from "src/js/api/correlations/run-suricata-alerts"
import {useSelector} from "react-redux"
import Results from "src/js/state/Results"

type Props = {record: zed.Record}

export default memo(function RelatedAlerts({record}: Props) {
  const records = useSelector(Results.getValues(SURICATA_ALERTS))
  const isFetching = useSelector(Results.isFetching(SURICATA_ALERTS))
  const query = useSelector(Results.getQuery(SURICATA_ALERTS))
  const perPage = useSelector(Results.getPerPage(SURICATA_ALERTS))
  const events = useMemo(() => records.map(BrimEvent.build), [records])
  const [first, last] = firstLast(events)
  const current = useMemo(
    () => events.findIndex((e) => isEqual(e.getRecord(), record)),
    [events, record]
  )
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
      <PanelHeading isLoading={isFetching}>Related Alerts</PanelHeading>
      <Panel>
        <ChartWrap>
          <EventTimeline events={events} current={current}></EventTimeline>
          <EventLimit count={events.length} query={query} limit={perPage} />
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
