/* @flow */

import React from "react"
import classNames from "classnames"

import type {$Field} from "../brim"
import {format} from "../lib/Time"

type Props = {field: $Field}

export default function FieldCell({field}: Props) {
  return (
    <div
      className={classNames("field-cell", field.name, field.type, {
        [`${field.value}-bg-color`]: field.name === "_path"
      })}
    >
      <FieldDisplay field={field} />
    </div>
  )
}

function FieldDisplay({field}) {
  if (field.type === "time") {
    return (
      <>
        <span className="date">{format(field.toDate(), "MM/DD/YY")}</span>
        <span className="time">{format(field.toDate(), "HH:mm")}</span>
        <span className="seconds">{format(field.toDate(), "ss.SSSS")}</span>
      </>
    )
  } else {
    return field.display()
  }
}
