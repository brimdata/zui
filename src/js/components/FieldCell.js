/* @flow */

import React from "react"
import classNames from "classnames"

import brim, {type $Field} from "../brim"

type Props = {field: $Field}

export default function FieldCell({field}: Props) {
  return (
    <div
      className={classNames("field-cell", field.name, field.type, {
        [`${field.stringValue()}-bg-color`]: field.name === "_path",
        null: field.value === null
      })}
    >
      <FieldDisplay field={field} />
    </div>
  )
}

function FieldDisplay({field}) {
  if (field.type === "time") {
    let t = brim.time(field.toDate())
    return (
      <>
        <span className="date">{t.format("MM/DD/YY")}</span>
        <span className="time">{t.format("HH:mm")}</span>
        <span className="seconds">{t.format("ss.SSSS")}</span>
      </>
    )
  } else {
    return field.display()
  }
}
