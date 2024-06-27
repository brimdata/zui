import * as zed from "@brimdata/zed-js"
import {ContainerView} from "./container-view"
import {createView} from "./create"

export class ErrorView extends ContainerView<zed.Error> {
  name(): string {
    return "Error"
  }

  count() {
    const {value: view} = this.iterate().next()
    if (view instanceof ContainerView) return view.count()
    else return 1
  }

  openToken(): string {
    return "error("
  }

  closeToken(): string {
    return ")"
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
