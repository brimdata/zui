import {useSelector} from "react-redux"
import React, {memo, useCallback, useMemo} from "react"

import {Caption, ChartWrap, TableWrap} from "src/app/detail/Shared"
import PanelHeading from "src/app/detail/PanelHeading"
import EventTimeline from "src/ppl/detail/EventTimeline"
import {SecurityEvent} from "src/ppl/detail/models/security-event"
import {sort} from "src/ppl/detail/util/sort"
import {Data, Name, Value} from "src/app/core/Data"
import formatDur from "src/ppl/detail/util/formatDur"
import {isEqual} from "lodash"
import Panel from "src/app/detail/Panel"
import EventLimit from "./EventLimit"
import {showContextMenu} from "src/js/lib/System"
import {zed} from "@brimdata/zealot"
import Results from "src/js/state/Results"
import {uidCorrelation} from "src/plugins/zui-zeek/uid-correlations"

const id = uidCorrelation.id

export default memo(function UidPanel({record}: {record: zed.Record}) {
  const isLoading = useSelector(Results.getStatus(id)) === "FETCHING"
  const logs = useSelector(Results.getValues(id)) as zed.Record[]
  const query = useSelector(Results.getQuery(id))
  const perPage = useSelector(Results.getPerPage(id))

  const events = useMemo(() => {
    return sort(logs).map(SecurityEvent.build)
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
    <section>
      <PanelHeading isLoading={isLoading}>Correlation</PanelHeading>
      <Panel isLoading={isLoading && events.length === 0}>
        <ChartWrap>
          <EventTimeline events={events} current={index} />
          <EventLimit query={query} count={events.length} limit={perPage} />
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
