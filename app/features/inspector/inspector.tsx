// @ts-strict
import React, {ReactNode, useState} from "react"
import {FixedSizeListProps} from "react-window"
import {zed} from "zealot"
import {inspect} from "./inspect"
import {List} from "./list.styled"
import {RowData} from "./types"

type Props = {
  height: number
  width: number
  values: zed.AnyValue[]
}

export function Inspector(props: Props) {
  const [expanded, setExpanded] = useState(new Map())
  const defaultExpanded = true
  const context = {
    rows: [],
    push(render: ReactNode, indent: number) {
      this.rows.push({render, indent})
    },
    isExpanded: (value: zed.AnyValue) => {
      if (expanded.has(value)) return expanded.get(value)
      else return defaultExpanded
    },
    setExpanded: (value: zed.AnyValue, bool: boolean) => {
      expanded.set(value, bool)
      setExpanded(new Map(expanded.entries()))
    }
  }

  for (const v of props.values) {
    inspect(context, v, 0, null, true)
  }

  return (
    <List
      height={props.height}
      width={props.width}
      itemCount={context.rows.length}
      itemSize={18}
      itemData={context.rows}
    >
      {Row}
    </List>
  )
}

const Row: FixedSizeListProps["children"] = ({style, index, data}) => {
  const {render, indent}: RowData = data[index]
  const innerStyle = {textIndent: indent + "rem", paddingLeft: 18}
  return (
    <div className="inspector-row" style={{...style, ...innerStyle}}>
      {render}
    </div>
  )
}
