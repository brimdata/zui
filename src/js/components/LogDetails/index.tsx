import {useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import LogDetails from "../../state/LogDetails"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"
import menu from "../../electron/menu"

export default function LogDetailComponent() {
  const log = useSelector(LogDetails.build)
  const isGoingBack = useSelector(LogDetails.getIsGoingBack)

  if (!log) return <NoSelection />

  return (
    <NavAnimation log={log} prev={isGoingBack}>
      <div className="log-detail">
        <FieldsPanel log={log} contextMenu={menu.searchFieldContextMenu} />
        {log.correlationId() && <UidPanel log={log} />}
        <ConnPanel log={log} contextMenu={menu.searchFieldContextMenu} />
        {log.getString("md5") && (
          <Md5Panel log={log} contextMenu={menu.searchFieldContextMenu} />
        )}
      </div>
    </NavAnimation>
  )
}
