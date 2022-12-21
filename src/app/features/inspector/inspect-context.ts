// Change the props to use only what it needs

import {ReactNode} from "react"
import {InspectContextArgs, RowData} from "./types"

export class InspectContext {
  rows = [] as RowData[]
  indent = 0

  constructor(public props: InspectContextArgs) {}

  // How many fields to show on a line
  get lineLimit() {
    return this.props.lineLimit ?? 15
  }

  // How many fields to show in a nested value
  get peekLimit() {
    return this.props.peekLimit ?? 2
  }

  // How many rows to show before prompting for the "next" page
  get rowsPerPage() {
    return this.props.rowsPerPage ?? 100
  }

  get rowLimit() {
    return this.props.rowLimit ?? Infinity
  }

  nest() {
    this.indent += 1
  }

  unnest() {
    this.indent -= 1
  }

  push(render: ReactNode) {
    this.rows.push({
      render,
      indent: this.indent,
    })
  }
}
