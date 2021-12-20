import {zed} from "@brimdata/zealot"
import {ReactNode} from "react"
import {inspect} from "./inspect"
import {InspectArgs, InspectorProps, RowData} from "./types"

export class InspectorContext {
  indent = 0
  rows = [] as RowData[]
  valueStart = 0

  constructor(public props: InspectorProps) {}

  get onContextMenu() {
    return this.props.onContextMenu
  }

  nest() {
    this.indent += 1
  }

  unnest() {
    this.indent -= 1
  }

  push(args: InspectArgs, render: ReactNode) {
    this.rows.push({
      render,
      indent: this.indent,
      rootValueIndex: args.rootValueIndex
    })
  }

  isExpanded(value: zed.Value | zed.Type) {
    if (this.props.expanded.has(value)) return this.props.expanded.get(value)
    else return this.props.defaultExpanded
  }

  setExpanded(args: InspectArgs, bool: boolean) {
    const newMap = new Map(this.props.expanded.entries())
    newMap.set(args.value, bool)
    this.props.setExpanded(newMap)
    this.valueStart = args.rootValueIndex
    this.rows.splice(args.rootValueIndex)
  }

  buildRows(stop: number) {
    console.log(this.rows.length, stop)
    let i = this.valueStart
    for (; this.rows.length <= stop && i < this.props.values.length; i++) {
      const value = this.props.values[i]
      inspect({
        ctx: this,
        value,
        field: null,
        key: null,
        last: true,
        type: value.type,
        rootValueIndex: i
      })
    }
    this.valueStart = i
    console.log("when done", this.rows.length)
  }
}
