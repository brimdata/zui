import {Data, Name, Value} from "src/app/core/Data"
import Panel from "src/app/detail/Panel"
import PanelHeading from "src/app/detail/PanelHeading"
import {Caption, ChartWrap, TableWrap} from "src/app/detail/Shared"
import {BrimEvent, BrimEventInterface} from "src/ppl/detail/models/BrimEvent"
import React, {memo, useCallback, useMemo} from "react"
import brim from "src/js/brim"
import {showContextMenu} from "src/js/lib/System"
import {relatedConns} from "src/js/searches/programs"
import {zed} from "@brimdata/zealot"
import EventLimit from "./EventLimit"
import EventTimeline from "./EventTimeline"
import firstLast from "./util/firstLast"
import formatDur from "./util/formatDur"
import useQuery from "src/app/core/hooks/use-query"

type Props = {
  record: zed.Record
}

const LIMIT = 100

export default memo(function RelatedConns({record}: Props) {
  const cid = record.get("community_id").toString()
  const [records, isFetching] = useQuery(
    relatedConns(cid, LIMIT),
    {id: "related-conns"},
    [record]
  )
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
          <EventLimit query={relatedConns(cid)} count={events.length} />
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
