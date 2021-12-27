import {zed} from "@brimdata/zealot"
import {ReactNode} from "react"
import {InspectArgs, RowData} from "./types"

// This seems not needed anymore
export class InspectorContext {
  indent = 0
  rows = [] as RowData[]

  constructor(public dispatch, public isExpanded, public setExpanded) {}

  get onContextMenu() {
    return function() {
      throw new Error("Not implemented yet")
    }
  }

  nest() {
    this.indent += 1
  }

  unnest() {
    this.indent -= 1
  }

  push(args: InspectArgs, render: ReactNode) {
    if (isNaN(args.rootValueIndex)) console.log(args)
    this.rows.push({
      render,
      indent: this.indent,
      rootValueIndex: args.rootValueIndex
    })
  }

  old_isExpanded(value: zed.Value | zed.Type) {
    // if (this.expanded.has(value)) return this.expanded.get(value)
    // else return this.defaultExpanded
  }

  old_setExpanded(args: InspectArgs, isExpanded: boolean) {
    // const {rootValueStartIndex} = args
    // this.dispatch(Inspector.setExpanded({args, isExpanded}))
    // this.dispatch(Inspector.spliceRows(rootValueStartIndex))
    // this.dispatch(updateRows())
  }
}
