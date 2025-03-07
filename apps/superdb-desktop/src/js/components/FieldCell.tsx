import {useZedFormatter} from "src/components/format"
import {zedTypeClassName} from "src/components/zed-type-class-name"
import classNames from "classnames"
import React from "react"
import * as zed from "../../../../../packages/superdb-types/dist"

type Props = {field: zed.Field; record: zed.Record}

function getBackground(field, record) {
  if (field.name === "event_type" && field.data.toString() === "alert") {
    const severity = record.try("alert.severity")?.toString()
    return `alert-${severity}-bg-color`
  }
  if (field.name === "_path") {
    return `${field.data.toString()}-bg-color`
  }
}

export default function FieldCell({field, record}: Props) {
  const format = useZedFormatter()
  return (
    <div
      className={classNames(
        "field-cell",
        field.name,
        zedTypeClassName(field.data),
        getBackground(field, record)
      )}
    >
      {format(field.data as zed.Primitive)}
    </div>
  )
}
