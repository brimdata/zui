import {useMemo} from "react"
import {useSelector} from "react-redux"
import ConnPanel from "src/js/components/LogDetails/ConnPanel"
import {Md5Panel} from "src/js/components/LogDetails/Md5Panel"
import LogDetails from "src/js/state/LogDetails"
import RelatedAlerts from "src/ppl/detail/RelatedAlerts"
import RelatedConns from "src/ppl/detail/RelatedConns"
import UidPanel from "src/ppl/detail/UidPanel"
import {Correlation} from "src/ppl/detail/models/Correlation"
import {SuricataEvent} from "src/ppl/detail/models/SuricataEvent"
import {ZeekEvent} from "src/ppl/detail/models/ZeekEvent"
import {SecurityEvent} from "src/ppl/detail/models/security-event"
import {EmptyText} from "src/components/empty-text"

export function CorrelationsPane() {
  const record = useSelector(LogDetails.build)
  if (record) {
    return <Correlations record={record} />
  } else {
    return (
      <EmptyText>Select a value in the results to run correlations.</EmptyText>
    )
  }
}

function Correlations({record}) {
  const event = useMemo(() => SecurityEvent.build(record), [record])
  const isZeek = event instanceof ZeekEvent
  const isSuricata = event instanceof SuricataEvent
  const {uid, cid} = new Correlation(record).getIds()
  const isConn = isZeek && record.try("_path")?.toString() === "conn"
  const hasMd5 = isZeek && record.has("md5")
  return (
    <div className="box stack gap-xl region region-space-l scroll-y">
      {isZeek && uid && <UidPanel record={record} />}
      {isSuricata && cid && <RelatedAlerts record={record} />}
      {isSuricata && cid && <RelatedConns />}
      {isConn && <ConnPanel record={record} />}
      {hasMd5 && <Md5Panel />}
    </div>
  )
}
