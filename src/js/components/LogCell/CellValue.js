/* @flow */

import React from "react"

import type {$Field} from "../../brim"
import {TimeField} from "../../models/Field"
import {format} from "../../lib/Time"
import {withCommas} from "../../lib/fmt"

type Props = {field: $Field}

const CellValue = ({field}: Props) => {
  if (field.name === "_path")
    return (
      <span className={`${field.name} ${field.value}-bg-color `}>
        {field.value}
      </span>
    )
  if (field.type === "time")
    return (
      <div>
        <span className="date">{format(field.toDate(), "MM/DD/YY")}</span>
        <span className="time">{format(field.toDate(), "HH:mm")}</span>
        <span className="seconds">{format(field.toDate(), "ss.SSSS")}</span>
      </div>
    )
  if (field.type === "count") {
    return <span>{withCommas(field.value)}</span>
  }
  return <span>{field.value}</span>
}

export default CellValue
