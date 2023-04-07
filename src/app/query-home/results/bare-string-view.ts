import {zed} from "@brimdata/zed-js"
import {InspectArgs} from "src/app/features/inspector/types"
import {StringView} from "src/app/features/inspector/views/string-view"

export class BareStringView extends StringView {
  static when(args: InspectArgs) {
    return zed.baseValue(args.value) instanceof zed.String
  }

  render() {
    return this.value.toString().replaceAll("\n", "\\n") // Escape all new lines
  }
}
