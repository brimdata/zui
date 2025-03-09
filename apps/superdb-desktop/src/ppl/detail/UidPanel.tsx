import {useSelector} from "react-redux"
import React, {memo, useCallback, useMemo} from "react"

import {Caption, TableWrap} from "src/views/detail-pane/Shared"
import PanelHeading from "src/views/detail-pane/PanelHeading"
import EventTimeline from "src/ppl/detail/EventTimeline"
import {SecurityEvent} from "src/ppl/detail/models/security-event"
import {sort} from "src/ppl/detail/util/sort"
import {Data, Name, Value} from "src/components/data"
import formatDur from "src/ppl/detail/util/formatDur"
import {isEqual} from "lodash"
import Panel from "src/views/detail-pane/Panel"
import EventLimit from "./EventLimit"
import {showContextMenu} from "src/core/menu"
import * as zed from "../../../../../packages/superdb-types/dist"
import Results from "src/js/state/Results"
import {UID_CORRELATION} from "src/plugins/brimcap/zeek/ids"

const id = UID_CORRELATION

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
    <section className="sidebar-card box">
      <PanelHeading isLoading={isLoading}>Correlation</PanelHeading>
      <Panel isLoading={isLoading && events.length === 0}>
        <div>
          <EventTimeline events={events} current={index} />
          <EventLimit query={query} count={events.length} limit={perPage} />
        </div>
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
