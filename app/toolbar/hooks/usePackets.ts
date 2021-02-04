import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import useDebouncedEffect from "src/js/components/hooks/useDebouncedEffect"
import {downloadPcap} from "src/js/flows/downloadPcap"
import Current from "src/js/state/Current"
import LogDetails from "src/js/state/LogDetails"
import {reactElementProps} from "src/js/test/integration"
import {ToolbarActionProps} from "../action"

export default function usePackets(): ToolbarActionProps {
  const dispatch = useDispatch()
  const conn = useSelector(LogDetails.getConnLog)
  const space = useSelector(Current.mustGetSpace)
  const [enabled, setEnabled] = useState(!!conn && space.pcap_support)

  useDebouncedEffect(() => setEnabled(!!conn && space.pcap_support), 100, [
    conn,
    space.pcap_support
  ])

  function getTitle() {
    if (!space.pcap_support) return "This space has no pcap support."
    if (conn) return "Open packets from this connection."
    else return "No connection record found."
  }

  return {
    label: "Packets",
    icon: "sharkfin",
    disabled: !enabled,
    title: getTitle(),
    click() {
      if (conn) dispatch(downloadPcap(conn))
    },
    buttonProps: reactElementProps("pcapsButton")
  }
}
