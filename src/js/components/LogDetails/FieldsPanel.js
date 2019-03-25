/* @flow */

import React from "react"

import type {PanelProps} from "./"
import FieldsTable from "../FieldsTable"
import PanelHeading from "./PanelHeading"

const FieldsPanel = ({log}: PanelProps) => (
  <div className="fields-table-panel detail-panel">
    <PanelHeading>Fields</PanelHeading>
    <FieldsTable log={log} />
  </div>
)

export default FieldsPanel
