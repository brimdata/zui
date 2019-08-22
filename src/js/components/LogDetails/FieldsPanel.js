/* @flow */

import React from "react"

import type {PanelProps} from "./"
import {useDetailMenu} from "../../rightclick/detailMenu"
import PanelHeading from "./PanelHeading"
import VerticalTable from "../Tables/VerticalTable"

export default function FieldsPanel({log}: PanelProps) {
  log = log.exclude("_td")
  let detailMenu = useDetailMenu()

  return (
    <div className="fields-table-panel detail-panel">
      <PanelHeading>Fields</PanelHeading>
      <VerticalTable
        descriptor={log.descriptor}
        log={log}
        rightClick={detailMenu}
      />
    </div>
  )
}
