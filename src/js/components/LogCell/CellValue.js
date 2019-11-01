/* @flow */

import React from "react"

import type {$Field} from "../../brim"
import {format} from "../../lib/Time"

type Props = {field: $Field}

const CellValue = ({field}: Props) => {
  if (field.name === "_path")
    return (
      <span className={`${field.name} ${field.value}-bg-color cell-value`}>
        {field.display()}
      </span>
    )
  if (field.type === "time")
    return (
      <div className="cell-value">
        <span className="date">{format(field.toDate(), "MM/DD/YY")}</span>
        <span className="time">{format(field.toDate(), "HH:mm")}</span>
        <span className="seconds">{format(field.toDate(), "ss.SSSS")}</span>
      </div>
    )

  return <span className="cell-value">{field.display()}</span>
}

export default CellValue
