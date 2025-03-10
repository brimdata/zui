import {View} from "./view"

export class StringView extends View {
  render() {
    return `"${this.value.toString().replaceAll("\n", "\\n")}"` // Escape all new lines
  }
}
