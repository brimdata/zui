import * as zed from "../../../../../../packages/superdb-types/dist"
import {createView} from "./create"
import {ContainerView} from "./container-view"

export class TypeUnionView extends ContainerView<zed.TypeUnion> {
  name() {
    return "Union"
  }

  count() {
    return this.value.types.length
  }

  openToken() {
    return "("
  }

  closeToken() {
    return ")"
  }

  *iterate(n?: number) {
    const types = this.value.types
    const length = n ? Math.min(n, types.length) : types.length

    for (let i = 0; i < types.length; ++i) {
      const type = types[i]
      const last = i === length - 1
      yield createView({
        ...this.args,
        value: type,
        // @ts-ignore need to think about rendering types
        field: null,
        last,
        key: this.isExpanded() ? i.toString() : null,
        type: type,
        indexPath: [...this.args.indexPath, i],
      })
      if (last) break
    }
  }
}
