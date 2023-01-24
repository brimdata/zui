import {Data, Name, Value} from "src/app/core/Data"
import {useZedFormatter} from "src/app/core/format"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import React, {memo, useCallback, useMemo, useState} from "react"
import BrimTooltip from "src/js/components/BrimTooltip"
import ColumnDescription from "src/js/components/LogDetails/ColumnDescription"
import {zed} from "@brimdata/zealot"
import Panel from "./Panel"
import PanelHeading from "./PanelHeading"

type Props = {
  record: zed.Record
}

type DTProps = {
  fields: zed.Field[]
  onHover: (f: zed.Field) => void
  format: (f: zed.Value) => string
}
const LIMIT = 500
const DataPanel = React.memo<DTProps>(function DataTable({
  fields,
  onHover,
  format,
}: DTProps) {
  const items = fields.slice(0, LIMIT).filter((f) => !!f)
  return (
    <Panel>
      {items.map((field, index) => (
        <Data key={index} onMouseEnter={() => onHover(field)}>
          <Name>
            <TooltipAnchor>{field.path.join(" ‣ ")}</TooltipAnchor>
          </Name>
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

function TooltipAnchor({children}) {
  return (
    <span
      data-tip="column-description"
      data-for="column-description"
      data-place="left"
      data-effect="solid"
      data-delay-show={500}
    >
      {children}
    </span>
  )
}

function Tooltip({field, record}) {
  return (
    <BrimTooltip id="column-description" className="brim-tooltip-show-hover">
      <ColumnDescription
        column={field}
        path={record.try("_path")?.toString()}
      />
    </BrimTooltip>
  )
}

export default memo(function Fields({record}: Props) {
  const [hovered, setHovered] = useState({name: "", type: ""})
  const format = useZedFormatter()
  const onHover = useCallback((field: any) => {
    setHovered(field)
  }, [])

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
      <DataPanel format={format} fields={fields} onHover={onHover} />
      <Tooltip field={hovered} record={record} />
    </section>
  )
})
