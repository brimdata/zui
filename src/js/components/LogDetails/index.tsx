import {useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import LogDetails from "../../state/LogDetails"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"
import menu from "../../electron/menu"
import {createZeekLog} from "../../brim/zeekLog"

export default function LogDetailComponent() {
  const log = useSelector(LogDetails.build)
  const zeek = createZeekLog(log)
  console.log(log)
  if (!log) return <NoSelection />

  return (
    <div className="log-detail-wrapper">
      <div className="log-detail">
        <FieldsPanel log={log} contextMenu={menu.searchFieldContextMenu} />
        {zeek.correlationId() && <UidPanel log={log} />}
        <ConnPanel log={log} contextMenu={menu.searchFieldContextMenu} />
        {log.has("md5") && (
          <Md5Panel log={log} contextMenu={menu.searchFieldContextMenu} />
        )}
      </div>
    </div>
  )
}
