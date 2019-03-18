/* @flow */

import React from "react"

import {format} from "../../lib/Time"
import {withCommas} from "../../lib/fmt"
import Field, {TimeField} from "../../models/Field"

type Props = {field: Field}

const CellValue = ({field}: Props) => {
  if (field.name === "_path")
    return (
      <span className={`${field.name} ${field.value}-bg-color `}>
        {field.value}
      </span>
    )
  if (field instanceof TimeField)
    return (
      <p>
        <span className="date">{format(field.toDate(), "MM/DD/YY")}</span>
        <span className="time">{format(field.toDate(), "HH:mm")}</span>
        <span className="seconds">{format(field.toDate(), "ss.SSSS")}</span>
      </p>
    )
  if (field.type === "count") {
    return <span>{withCommas(field.value)}</span>
  }
  return <span>{field.value}</span>
}

export default CellValue
