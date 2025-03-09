import * as zed from "../../../../../packages/superdb-types/dist"
import {InspectArgs} from "src/views/inspector/types"
import {StringView} from "src/views/inspector/views/string-view"

export class BareStringView extends StringView {
  static when(args: InspectArgs) {
    return zed.baseValue(args.value) instanceof zed.String
  }

  render() {
    return this.value.toString().replaceAll("\n", "\\n") // Escape all new lines
  }
}
