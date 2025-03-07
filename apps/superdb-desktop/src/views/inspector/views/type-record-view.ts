import * as zed from "../../../../../../packages/superdb-types/dist"
import {createView} from "./create"
import {ContainerView} from "./container-view"

export class TypeRecordView extends ContainerView<zed.TypeRecord> {
  name() {
    return "Record"
  }

  count() {
    return this.value.fields?.length || 0
  }

  openToken() {
    return "<{"
  }

  closeToken() {
    return "}>"
  }

  *iterate(n?: number) {
    const fields = this.value.fields
    if (!fields) return
    const length = n ? Math.min(n, fields.length) : fields.length

    for (let i = 0; i < fields.length; ++i) {
      const field = fields[i]
      const last = i === length - 1
      yield createView({
        ...this.args,
        value: field.type,
        // @ts-ignore need to think about rendering types
        field,
        last,
        key: field.name,
        type: field.type,
        indexPath: [...this.args.indexPath, i],
      })
      if (last) break
    }
  }
}
