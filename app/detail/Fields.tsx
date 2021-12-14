import {Data, Name, Value} from "app/core/Data"
import {useZedFormatter} from "app/core/format"
import {zedTypeClassName} from "app/core/utils/zed-type-class-name"
import React, {memo, useCallback, useMemo, useState} from "react"
import {useDispatch} from "react-redux"
import BrimTooltip from "src/js/components/BrimTooltip"
import ColumnDescription from "src/js/components/LogDetails/ColumnDescription"
import {printColumnName} from "src/js/state/Columns/models/column"
import {zed} from "@brimdata/zealot"
import contextMenu from "./flows/contextMenu"
import Panel from "./Panel"
import PanelHeading from "./PanelHeading"

type Props = {
  record: zed.Record
}

type DTProps = {
  fields: zed.Field[]
  onRightClick: (f: zed.Field) => void
  onHover: (f: zed.Field) => void
  format: (f: zed.Primitive) => string
}

const DataPanel = React.memo<DTProps>(function DataTable({
  fields,
  onRightClick,
  onHover,
  format
}: DTProps) {
  return (
    <Panel>
      {fields.map((field, index) => (
        <Data key={index} onMouseEnter={() => onHover(field)}>
          <Name>
            <TooltipAnchor>{printColumnName(field.path)}</TooltipAnchor>
          </Name>
          <Value
            className={zedTypeClassName(field.data)}
            onContextMenu={() => onRightClick(field)}
          >
            {format(field.data as zed.Primitive)}
          </Value>
        </Data>
      ))}
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
  const dispatch = useDispatch()
  const [hovered, setHovered] = useState({name: "", type: ""})
  const format = useZedFormatter()
  const onHover = useCallback((field) => {
    setHovered(field)
  }, [])

  const onRightClick = useCallback(
    (field) => dispatch(contextMenu(field, record)),
    [record]
  )

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
      <DataPanel
        format={format}
        fields={fields}
        onRightClick={onRightClick}
        onHover={onHover}
      />
      <Tooltip field={hovered} record={record} />
    </section>
  )
})
