import {zed} from "@brimdata/zealot"
import {ContainerView} from "./container-view"
import {createView} from "./create"
import {field} from "../templates/field"
import {syntax} from "../templates/syntax"
import {RenderMode} from "../types"
import {space} from "../templates/space"

export class ErrorView extends ContainerView<zed.Error> {
  name(): string {
    return "Error"
  }

  count() {
    return this.iterate().next().value.count()
  }

  openToken(): string {
    return "("
  }

  closeToken(): string {
    return ")"
  }

  render(mode: RenderMode) {
    const {value: view} = this.iterate().next()
    return [
      this.name(),
      space(),
      syntax(this.openToken()),
      field(view, mode),
      syntax(this.closeToken()),
    ]
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
