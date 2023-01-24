import {View} from "./view"

export class StringView extends View {
  render() {
    return `"${this.args.value.toString().replaceAll("\n", "\\n")}"`
  }
}
