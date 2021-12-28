import {zed} from "@brimdata/zealot"
import {isNumber} from "lodash"
import React, {useMemo, useRef, useState} from "react"
import {useDispatch} from "react-redux"
import {InspectorContext} from "./context"
import {inspect} from "./inspect"
import {List} from "./list.styled"
import {Row} from "./row"
import {IsExpanded, RowData, SetExpanded} from "./types"

export function Inspector(props: {
  values: zed.Value[]
  isExpanded: IsExpanded
  setExpanded: SetExpanded
  loadMore: Function
  height: number
  width: number
}) {
  const dispatch = useDispatch()
  const [visRange, setVisRange] = useState([0, 30])

  const {rowToValue, valueToRow, totalSize} = useMemo(() => {
    let rowToValue = []
    let valueToRow = []
    let totalSize = 0
    props.values.forEach((v, valIndex) => {
      const size = getRowCount(v, props.isExpanded)
      rowToValue = rowToValue.concat(Array(size).fill(valIndex))
      valueToRow.push(totalSize)
      totalSize += size
    })
    return {rowToValue, valueToRow, totalSize}
  }, [props])

  const rows = useRef<(RowData | undefined)[]>([])
  useMemo(() => {
    rows.current = Array(totalSize).fill(null)
  }, [props])

  const [visStart, visEnd] = visRange
  const valStart = rowToValue[visStart]
  const valStop = rowToValue[visEnd]

  // This little loop should be in the inspector context
  const context = new InspectorContext(
    dispatch,
    props.isExpanded,
    props.setExpanded
  )
  if (isNumber(valStart) && isNumber(valStop)) {
    for (let index = valStart; index <= valStop; index++) {
      context.rows = []

      const rowStart = valueToRow[index]
      if (rows.current[rowStart]) continue

      const newRows = inspect({
        ctx: context,
        value: props.values[index],
        field: null,
        key: null,
        last: true,
        type: props.values[index].type,
        rootValueIndex: index,
        rootValueStartIndex: 0 // not needed anymore
      })
      rows.current.splice(rowStart, newRows.length, ...newRows)
    }
  }

  return (
    <List
      height={props.height}
      width={props.width}
      itemCount={rows.current.length}
      itemSize={20}
      itemData={[...rows.current]}
      itemKey={(i) => i.toString()}
      onItemsRendered={(args) => {
        setVisRange([args.overscanStartIndex, args.overscanStopIndex])
        if (args.overscanStopIndex > rows.current.length - 10) props.loadMore()
      }}
    >
      {Row}
    </List>
  )
}

function getRowCount(value: zed.Value | zed.Type, isExpanded) {
  if (zed.isType(value)) {
    if (value instanceof zed.TypeRecord) {
      if (!isExpanded(value)) return 1
      return value.fields.reduce((sum, field) => {
        return sum + getRowCount(field.type, isExpanded)
      }, 2)
    }
    if (value instanceof zed.TypeUnion) {
      if (!isExpanded(value)) return 1
      return value.types.reduce((sum, type) => {
        return sum + getRowCount(type, isExpanded)
      }, 2)
    }
    return 1
  } else {
    if (value.isUnset()) return 1
    if (zed.isPrimitive(value)) return 1

    if (value instanceof zed.Record) {
      if (!isExpanded(value)) return 1
      return value.fields.reduce((sum, field) => {
        return sum + getRowCount(field.data, isExpanded)
      }, 2) // The two is for the open and closing brackets
    }
    if (value instanceof zed.Array) {
      if (!isExpanded(value)) return 1
      return value.items.reduce((sum, item) => {
        return sum + getRowCount(item, isExpanded)
      }, 2)
    }
    if (value instanceof zed.Set) {
      if (!isExpanded(value)) return 1
      return value.items.reduce((sum, item) => {
        return sum + getRowCount(item, isExpanded)
      }, 2)
    }
    if (value instanceof zed.Map) {
      if (!isExpanded(value)) return 1
      return Array.from(value.value.values()).reduce((sum, value) => {
        return sum + getRowCount(value, isExpanded)
      }, 2)
    }
    if (value instanceof zed.Union) {
      return getRowCount(value.value, isExpanded)
    }
    if (value instanceof zed.TypeValue) {
      return getRowCount(value.value, isExpanded)
    }
    return 1
  }
}
