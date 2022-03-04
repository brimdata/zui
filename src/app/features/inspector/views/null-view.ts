import {View} from "./view"
import {zed} from "@brimdata/zealot"

export class NullView extends View<zed.Any> {
  render() {
    return "null"
  }
}
