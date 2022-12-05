import React from "react"
import SelectInput from "src/js/components/common/forms/SelectInput"

export function DataFormatSelect(props: JSX.IntrinsicElements["select"]) {
  return (
    <SelectInput {...props}>
      <option value="auto">Auto detect</option>
      <option value="csv">csv</option>
      <option value="json">json</option>
      <option value="line">line</option>
      <option value="ndjson">ndjson</option>
      <option value="parquet">parquet</option>
      <option value="auto">zeek</option>
      <option value="zng">zng</option>
      <option value="zson">zson</option>
    </SelectInput>
  )
}
