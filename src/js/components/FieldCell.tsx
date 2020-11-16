import React from "react"
import classNames from "classnames"

import {createCell} from "../brim/cell"
import {zng} from "zealot"

type Props = {field: zng.Field}

export default function FieldCell({field}: Props) {
  const cell = createCell(field)
  return (
    <div
      className={classNames("field-cell", field.name, field.data.getType(), {
        [`${cell.stringValue()}-bg-color`]: field.name === "_path",
        null: field.data.value === null
      })}
    >
      {cell.display()}
    </div>
  )
}
