import {BrimEvent} from "ppl/detail/models/BrimEvent"
import React, {memo, useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "src/js/brim"
import LogDetails from "src/js/state/LogDetails"

import {SuricataEvent} from "./models/SuricataEvent"
import EventTimeline from "./EventTimeline"
import {Caption, ChartWrap, TableWrap} from "app/detail/Spacing"
import {Data, Name, Value} from "app/core/Data"
import formatDur from "./util/formatDur"
import PanelHeading from "app/detail/PanelHeading"
import Panel from "app/detail/Panel"
import {isEqual} from "lodash"
import {zng} from "zealot"
import zql from "src/js/zql"
import EventLimit from "./EventLimit"

type Props = {
  record: zng.Record
}

export default memo(function RelatedAlerts({record}: Props) {
  const logs = useSelector(LogDetails.getUidLogs)
  const isLoading = useSelector(LogDetails.getUidStatus) === "FETCHING"
  const events = useMemo(
    () =>
      logs
        .map(BrimEvent.build)
        .filter((e) => e instanceof SuricataEvent)
        .sort((a, b) => a.getTime().getTime() - b.getTime().getTime()),
    [logs]
  )
  const current = useMemo(() => {
    return events.findIndex((e) => isEqual(e.getRecord(), record))
  }, [events, record])
  const first = events[0]
  const last = events.length == 1 ? null : events[events.length - 1]
  const query = useMemo(
    () => zql`event_type=alert community_id=${record.get("community_id")}`,
    [record]
  )
  return (
    <section>
      <PanelHeading isLoading={isLoading}>Related Alerts</PanelHeading>
      <Panel>
        <ChartWrap>
          <EventTimeline events={events} current={current}></EventTimeline>
          <EventLimit count={events.length} query={query} />
        </ChartWrap>
        <TableWrap>
          <Data>
            <Name>Count</Name>
            <Value>{events.length}</Value>
          </Data>
          <Data>
            <Name>First ts</Name>
            <Value>
              {first ? brim.time(first.getTime()).format() : "Not available"}
            </Value>
          </Data>
          <Data>
            <Name>Last ts</Name>
            <Value>
              {last ? brim.time(last.getTime()).format() : "Not available"}
            </Value>
          </Data>
          <Data>
            <Name>Duration</Name>
            <Value>{formatDur(first?.getTime(), last?.getTime())}</Value>
          </Data>
        </TableWrap>
      </Panel>
      <Caption>Populated by community_id</Caption>
    </section>
  )
})
