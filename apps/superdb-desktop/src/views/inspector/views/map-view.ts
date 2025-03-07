import * as zed from "../../../../../../packages/superdb-types/dist"
import {createView} from "./create"
import {ContainerView} from "./container-view"

export class MapView extends ContainerView<zed.Map> {
  name() {
    return "Map"
  }

  count(): number {
    return this.value.value.size
  }

  openToken() {
    return "|{"
  }

  closeToken() {
    return "}|"
  }

  *iterate(n?: number) {
    const map = this.value.value
    const length = n ? Math.min(n, map.size) : map.size

    let i = 0
    for (let key of map.keys()) {
      const last = i === length - 1
      const value = map.get(key)
      yield createView({
        ...this.args,
        type: value.type,
        value,
        last,
        key: key,
        indexPath: [...this.args.indexPath, i],
      })
      if (last) break
      i++
    }
  }
}
