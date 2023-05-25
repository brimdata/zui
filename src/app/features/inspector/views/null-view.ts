import {View} from "./view"
import * as zed from "@brimdata/zed-js"

export class NullView extends View<zed.Any> {
  render() {
    return "null"
  }
}
