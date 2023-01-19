import {zed} from "@brimdata/zealot"
import {ReactNode} from "react"
import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import {field} from "../templates/field"
import {InspectArgs, RenderMode} from "../types"

export class View<T extends any = any> {
  static when(_args: InspectArgs) {
    return true
  }

  constructor(public args: InspectArgs) {}

  get ctx() {
    return this.args.ctx
  }

  get value(): T {
    return this.args.value as T
  }

  get type() {
    return this.args.type
  }

  get key() {
    return this.args.key
  }

  get id() {
    return this.args.indexPath.join(",")
  }

  get className() {
    return zedTypeClassName(this.value as any)
  }

  get showKey() {
    return !!this.args.key && !this.ctx.hideKeys
  }

  get showSyntax() {
    return !this.ctx.hideSyntax
  }

  get isLast() {
    return this.args.last
  }

  rowCount() {
    return 1
  }

  isExpanded() {
    return this.ctx.isExpanded(this.id)
  }

  render(_mode?: RenderMode): ReactNode {
    return this.value.toString()
  }

  inspect() {
    return this.ctx.push(field(this, "single"))
  }
}
