import {connect} from "react-redux"
import DownloadProgress from "../components/DownloadProgress"

const stateToProps = _state => ({
  fileName: "r43crdxzzws54sfd234s.pcap",
  percent: 99
})

export default connect(stateToProps)(DownloadProgress)
