import {useDispatch} from "react-redux"
import React, {memo, useCallback, useMemo, useState} from "react"

import {zng} from "zealot"
import {Data, Name, Value} from "app/core/Data"
import {createCell} from "src/js/brim/cell"
import BrimTooltip from "src/js/components/BrimTooltip"
import ColumnDescription from "src/js/components/LogDetails/ColumnDescription"

import PanelHeading from "./PanelHeading"
import Panel from "./Panel"
import contextMenu from "./flows/contextMenu"

type Props = {
  record: zng.Record
}

type DTProps = {
  fields: zng.Field[]
  onRightClick: (f: zng.Field) => void
  onHover: (f: zng.Field) => void
}

const DataPanel = React.memo<DTProps>(function DataTable({
  fields,
  onRightClick,
  onHover
}: DTProps) {
  return (
    <Panel>
      {fields.map((field, index) => (
        <Data
          key={index}
          onMouseEnter={() => onHover(field)}
          onContextMenu={() => onRightClick(field)}
        >
          <Name>
            <TooltipAnchor>{field.name}</TooltipAnchor>
          </Name>
          <Value className={field.data.getType()}>
            {createCell(field).display()}
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
    <BrimTooltip className="brim-tooltip-show-hover">
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

  const onHover = useCallback((field) => {
    setHovered(field)
  }, [])

  const onRightClick = useCallback(
    (field) => {
      window.getSelection().removeAllRanges()
      dispatch(contextMenu(field, record))
    },
    [record]
  )

  const fields = useMemo(() => {
    if (!record) return []
    else return record.flatten().getFields()
  }, [record])

  return (
    <section>
      <PanelHeading>Fields</PanelHeading>
      <DataPanel
        fields={fields}
        onRightClick={onRightClick}
        onHover={onHover}
      />
      <Tooltip field={hovered} record={record} />
    </section>
  )
})
