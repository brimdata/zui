import React from "react"
import ConnLog from "./ConnLog"
import GenericLog from "./GenericLog"
import BasicLog from "./BasicLog"

export default class BroLogDetail extends React.Component {
  constructor(props) {
    super(props)
    const uid = props.broLog.cast("uid")
    if (uid && props.fetchUid) props.fetchUid(uid)
  }

  render() {
    const {broLog, correlatedEvents, showModal} = this.props
    const path = broLog.getField("_path").toString()
    const uid = broLog.getField("uid").cast()

    if (path === "conn") {
      return (
        <ConnLog
          broLog={broLog}
          correlatedEvents={correlatedEvents}
          showModal={showModal}
        />
      )
    }

    if (uid) {
      return (
        <GenericLog
          broLog={broLog}
          correlatedEvents={correlatedEvents}
          showModal={showModal}
        />
      )
    }

    return <BasicLog broLog={broLog} />
  }
}
