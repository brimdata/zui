import {zed} from "@brimdata/zealot"
import {ReactNode} from "react"
import {field} from "../templates/field"
import {InspectArgs} from "../types"

export class View<T extends zed.Any = zed.Any> {
  constructor(public args: InspectArgs) {}

  get value(): T {
    return this.args.value as T
  }

  rowCount() {
    return 1
  }

  isExpanded() {
    return this.args.ctx.props.isExpanded(this.args.indexPath.join(","))
  }

  render(): ReactNode {
    return this.args.value.toString()
  }

  inspect() {
    return this.args.ctx.push(field(this))
  }
}
