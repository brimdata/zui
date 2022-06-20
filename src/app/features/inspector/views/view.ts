import {zed} from "@brimdata/zealot"
import {ReactNode} from "react"
import {field} from "../templates/field"
import {InspectArgs, RenderMode} from "../types"

export class View<T extends zed.Any = zed.Any> {
  constructor(public args: InspectArgs) {}

  get value(): T {
    return this.args.value as T
  }

  get key() {
    return this.args.indexPath.join(",")
  }

  rowCount() {
    return 1
  }

  isExpanded() {
    return this.args.ctx.props.isExpanded(this.key)
  }

  render(_mode?: RenderMode): ReactNode | void {
    return this.args.value.toString()
  }

  inspect() {
    return this.args.ctx.push(field(this, "single"))
  }
}
