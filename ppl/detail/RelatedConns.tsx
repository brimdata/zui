import {Data, Name, Value} from "app/core/Data"
import {BrimEvent} from "ppl/detail/models/BrimEvent"
import React, {memo, useMemo} from "react"
import {useSelector} from "react-redux"
import brim from "src/js/brim"
import LogDetails from "src/js/state/LogDetails"
import {ZeekEvent} from "./models/ZeekEvent"
import EventTimeline from "./EventTimeline"
import {TableWrap, ChartWrap} from "app/detail/Spacing"
import formatDur from "./util/formatDur"
import PanelHeading from "app/detail/PanelHeading"
import Panel from "app/detail/Panel"
import {zng} from "zealot"
import zql from "src/js/zql"
import EventLimit from "./EventLimit"

type Props = {
  record: zng.Record
}

export default memo(function RelatedConns({record}: Props) {
  const query = useMemo(
    () => zql`_path=conn community_id=${record.get("community_id")}`,
    [record]
  )
  const logs = useSelector(LogDetails.getUidLogs)
  const events = useMemo(
    () =>
      logs
        .map(BrimEvent.build)
        .filter((e) => e instanceof ZeekEvent)
        .sort((a, b) => a.getTime().getTime() - b.getTime().getTime()),
    [logs]
  )
  const first = events[0]
  const last = events.length == 1 ? null : events[events.length - 1]

  return (
    <section>
      <PanelHeading>Related Connections</PanelHeading>
      <Panel>
        <ChartWrap>
          <EventTimeline events={events} />
          <EventLimit query={query} count={events.length} />
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
    </section>
  )
})
