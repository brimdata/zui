/* @flow */

import React from "react"

import FieldsTable from "../FieldsTable"
import Log from "../../models/Log"

type Props = {log: Log}

const FieldsPanel = ({log}: Props) => (
  <div className="fields-table-panel detail-panel">
    <h4 className="small-heading">Fields</h4>
    <FieldsTable log={log} />
  </div>
)

export default FieldsPanel
