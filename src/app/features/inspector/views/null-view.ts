import {View} from "./view"
import {zed} from "@brimdata/zed-js"

export class NullView extends View<zed.Any> {
  render() {
    return "null"
  }
}
