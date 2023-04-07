import {SecurityEvent} from "src/ppl/detail/models/security-event"
import {Correlation} from "src/ppl/detail/models/Correlation"
import {SuricataEvent} from "src/ppl/detail/models/SuricataEvent"
import {ZeekEvent} from "src/ppl/detail/models/ZeekEvent"
import RelatedAlerts from "src/ppl/detail/RelatedAlerts"
import RelatedConns from "src/ppl/detail/RelatedConns"
import UidPanel from "src/ppl/detail/UidPanel"
import React, {useLayoutEffect, memo, useMemo, useRef} from "react"
import {useSelector} from "react-redux"
import ConnPanel from "src/js/components/LogDetails/ConnPanel"
import {Md5Panel} from "src/js/components/LogDetails/Md5Panel"
import LogDetails from "src/js/state/LogDetails"
import styled from "styled-components"
import Fields from "./Fields"
import NoSelection from "./NoSelection"
import {zed} from "@brimdata/zed-js"

const BG = styled.div`
  padding: 12px;

  section {
    margin-bottom: 24px;
  }
`

type Props = {
  record: zed.Record
}

const Content = memo<Props>(function Content({record}) {
  const event = useMemo(() => SecurityEvent.build(record), [record])
  const isZeek = event instanceof ZeekEvent
  const isSuricata = event instanceof SuricataEvent
  const {uid, cid} = new Correlation(record).getIds()
  const isConn = isZeek && record.try("_path")?.toString() === "conn"
  const hasMd5 = isZeek && record.has("md5")

  return (
    <BG className="detail-pane-content">
      <div className="column">
        <Fields record={record} />
      </div>
      <div className="column">
        {isZeek && uid && <UidPanel record={record} />}
        {isSuricata && cid && <RelatedAlerts record={record} />}
        {isSuricata && cid && <RelatedConns />}
        {isConn && <ConnPanel record={record} />}
        {hasMd5 && <Md5Panel />}
      </div>
    </BG>
  )
})

const Wrap = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

export default function Pane() {
  const record = useSelector(LogDetails.build)
  const ref = useRef<HTMLDivElement>()

  useLayoutEffect(() => {
    const node = ref.current
    if (node) node.scrollTop = 0
  }, [record])

  return (
    <Wrap ref={ref}>
      {record && record instanceof zed.Record ? (
        <Content record={record} />
      ) : (
        <NoSelection />
      )}
    </Wrap>
  )
}
