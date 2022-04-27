import {zed} from "@brimdata/zealot"
import {ContainerView} from "./container-view"
import {createView} from "./create"
import {field} from "../templates/field"
import {syntax} from "../templates/syntax"

export class ErrorView extends ContainerView<zed.Error> {
  openToken(): string {
    return "("
  }
  closeToken(): string {
    return ")"
  }
  name(): string {
    return "Error"
  }
  render() {
    const {value} = this.iterate().next()
    return ["Error", syntax("("), field(value), syntax(")")]
  }
  *iterate() {
    yield createView({
      ...this.args,
      value: this.value.value,
      key: null,
      last: true,
      indexPath: [...this.args.indexPath, 0],
    })
  }
}
