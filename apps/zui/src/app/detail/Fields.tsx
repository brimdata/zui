import {Data, Name, Value} from "src/app/core/Data"
import {useZedFormatter} from "src/app/core/format"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import React, {memo, useMemo} from "react"
import * as zed from "@brimdata/zed-js"
import Panel from "./Panel"
import PanelHeading from "./PanelHeading"

type Props = {
  record: zed.Record
}

type DTProps = {
  fields: zed.Field[]
  format: (f: zed.Value) => string
}
const LIMIT = 500
const DataPanel = React.memo<DTProps>(function DataTable({
  fields,
  format,
}: DTProps) {
  const items = fields.slice(0, LIMIT).filter((f) => !!f)
  return (
    <Panel>
      {items.map((field, index) => (
        <Data key={index}>
          <Name>{field.path.join(" ‣ ")}</Name>
          <Value className={zedTypeClassName(field.data)}>
            {format(field.data as zed.Primitive)}
          </Value>
        </Data>
      ))}
      {fields.length > LIMIT && (
        <Data>
          <Name>Limited to {LIMIT} fields</Name>
          <Value>Use the Inspector view to see all values.</Value>
        </Data>
      )}
    </Panel>
  )
})

export default memo(function Fields({record}: Props) {
  const format = useZedFormatter()

  const fields = useMemo(() => {
    if (record) {
      return record.flatColumns.map((c) => record.getField(c))
    } else {
      return []
    }
  }, [record])

  return (
    <section>
      <PanelHeading>Fields</PanelHeading>
      <DataPanel format={format} fields={fields} />
    </section>
  )
})
