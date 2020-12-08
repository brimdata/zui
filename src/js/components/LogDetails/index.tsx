import {useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import LogDetails from "../../state/LogDetails"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"
import menu from "../../electron/menu"
import {Correlation} from "../../correlation/models/Correlation"

export default function LogDetailComponent() {
  const record = useSelector(LogDetails.build)
  if (!record) return <NoSelection />

  const correlation = new Correlation(record)
  return (
    <div className="log-detail-wrapper">
      <div className="log-detail">
        <FieldsPanel log={record} contextMenu={menu.searchFieldContextMenu} />
        {correlation.getUid() && <UidPanel log={record} />}
        <ConnPanel log={record} contextMenu={menu.searchFieldContextMenu} />
        {record.has("md5") && (
          <Md5Panel log={record} contextMenu={menu.searchFieldContextMenu} />
        )}
      </div>
    </div>
  )
}
