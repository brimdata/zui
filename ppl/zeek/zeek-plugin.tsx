/**
 * Move this code in to a zeek plugin
 */

import React from "react"
import {zed} from "zealot"
import {isStringy} from "zealot/zed"

export function isPath(field) {
  return field.name === "_path" && isStringy(field.value)
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
