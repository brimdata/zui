import {Data, Name, Value} from "src/app/core/Data"
import Panel from "src/app/detail/Panel"
import PanelHeading from "src/app/detail/PanelHeading"
import {Caption, ChartWrap, TableWrap} from "src/app/detail/Shared"
import {isEqual} from "lodash"
import {SecurityEvent} from "src/ppl/detail/models/security-event"
import React, {memo, useCallback, useMemo} from "react"
import {showContextMenu} from "src/js/lib/System"
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
