/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import LogDetails from "../../state/LogDetails"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"

export default function LogDetailComponent() {
  let log = useSelector(LogDetails.build)
  let isGoingBack = useSelector(LogDetails.getIsGoingBack)

  if (!log) return <NoSelection />

  return (
    <NavAnimation log={log} prev={isGoingBack}>
      <div className="log-detail">
        <FieldsPanel log={log} />
        {log.correlationId() && <UidPanel log={log} />}
        <ConnPanel log={log} />
        {log.get("md5") && <Md5Panel log={log} />}
      </div>
    </NavAnimation>
  )
}
