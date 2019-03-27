/* @flow */

import React from "react"

import type {PanelProps} from "./"
import PanelHeading from "./PanelHeading"
import VerticalTable from "../Tables/VerticalTable"

export default function FieldsPanel({log}: PanelProps) {
  const logSubset = log.exclude("_td")
  const data = logSubset.getFields().map(f => ({...f}))

  return (
    <div className="fields-table-panel detail-panel">
      <PanelHeading>Fields</PanelHeading>
      <VerticalTable headers={logSubset.descriptor} data={data} />
    </div>
  )
}
