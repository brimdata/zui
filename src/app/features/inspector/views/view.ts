import {zed} from "@brimdata/zealot"
import {ReactNode} from "react"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import {field} from "../templates/field"
import {InspectArgs, RenderMode} from "../types"

export class View {
  static when(_args: InspectArgs) {
    return true
  }

  constructor(public args: InspectArgs) {}

  get ctx() {
    return this.args.ctx
  }

  get value(): zed.Any {
    return this.args.value
  }

  get key() {
    return this.args.indexPath.join(",")
  }

  get className() {
    return zedTypeClassName(this.value)
  }

  rowCount() {
    return 1
  }

  isExpanded() {
    return this.args.ctx.props.isExpanded(this.key)
  }

  render(_mode?: RenderMode): ReactNode {
    return this.args.value.toString()
  }

  inspect() {
    return this.args.ctx.push(field(this, "single"))
  }
}
