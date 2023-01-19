import {View} from "./view"
import {zed} from "@brimdata/zealot"

export class StringView extends View {
  render() {
    return `"${this.args.value.toString().replaceAll("\n", "\\n")}"`
  }
}
