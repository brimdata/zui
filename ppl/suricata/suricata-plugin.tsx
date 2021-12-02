/**
 * Move this code in to a suricata plugin
 */

import React from "react"
import {zed} from "zealot-old"

export function isEventType(name: string | string[], value: zed.AnyValue) {
  return name === "event_type" && zed.isStringy(value)
}

export default function eventTypeClassNames(record: zed.Record) {
  const severity = record.try(["alert", "severity"])
  if (severity instanceof zed.Primitive && severity.isSet()) {
    return `path-tag alert-${severity.toString()}-bg-color`
  } else return ""
}

export function SuricataEventType(props) {
  return (
    <span className={eventTypeClassNames(props.record)}>
      {props.field.value.toString()}
    </span>
  )
}
