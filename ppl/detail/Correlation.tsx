import {useSelector} from "react-redux"
import React, {memo, useCallback, useMemo} from "react"

import {reactElementProps} from "src/js/test/integration"
import LogDetails from "src/js/state/LogDetails"
import {Caption, ChartWrap, TableWrap} from "app/detail/Shared"
import PanelHeading from "app/detail/PanelHeading"
import EventTimeline from "ppl/detail/EventTimeline"
import {BrimEvent} from "ppl/detail/models/BrimEvent"
import {sort} from "ppl/detail/util/sort"
import {Data, Name, Value} from "app/core/Data"
import formatDur from "ppl/detail/util/formatDur"
import {isEqual} from "lodash"
import Panel from "app/detail/Panel"
import {getCorrelationQuery} from "./flows/get-correlation-query"
import EventLimit from "./EventLimit"
import {showContextMenu} from "src/js/lib/System"
import {zed} from "zealot"

export default memo(function UidPanel({record}: {record: zed.Record}) {
  const query = useMemo(() => getCorrelationQuery(record), [record])
  const isLoading = useSelector(LogDetails.getUidStatus) === "FETCHING"
  const logs = useSelector(LogDetails.getUidLogs)

  const events = useMemo(() => {
    return sort(logs).map(BrimEvent.build)
  }, [logs])

  const conn = useMemo(() => {
    return events.find((e) => e.getType() === "conn")
  }, [events])

  const index = useMemo(() => {
    return events.findIndex((e) => isEqual(e.getRecord(), record))
  }, [record, events])

  const onContextMenu = useCallback(() => {
    showContextMenu([{role: "copy"}])
  }, [])

  return (
    <section {...reactElementProps("correlationPanel")}>
      <PanelHeading isLoading={isLoading}>Correlation</PanelHeading>
      <Panel isLoading={isLoading && events.length === 0}>
        <ChartWrap>
          <EventTimeline events={events} current={index} />
          <EventLimit query={query} count={events.length} />
        </ChartWrap>
        <TableWrap>
          <Data>
            <Name>Duration</Name>
            <Value onContextMenu={onContextMenu}>
              {formatDur(conn?.getTime(), conn?.getEndTime())}
            </Value>
          </Data>
        </TableWrap>
      </Panel>
      <Caption>Populated by uid & community_id</Caption>
    </section>
  )
})
