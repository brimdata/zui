/**
 * Move this code in to a zeek plugin
 */

import React from "react"
import {zed} from "zealot"

export function isPath(name: string | string[], value: zed.AnyValue) {
  return name === "_path" && zed.isStringy(value)
}

export default function pathClassNames(field: zed.Field) {
  const path = field.value.toString()
  return `path-tag ${path}-bg-color`
}

export function ZeekPath(props) {
  return (
    <span className={pathClassNames(props.field)}>
      {props.field.value.toString()}
    </span>
  )
}
