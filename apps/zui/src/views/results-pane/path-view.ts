import * as zed from "@brimdata/zed-js"
import {InspectArgs} from "src/app/features/inspector/types"
import {BareStringView} from "./bare-string-view"

export class PathView extends BareStringView {
  static when(args: InspectArgs) {
    return args.type === zed.TypeString && args.field?.name === "_path"
  }

  get className() {
    const path = this.value.toString()
    return `zeek-path-tag ${path}-bg-color`
  }
}
