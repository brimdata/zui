import {zed} from "@brimdata/zealot"
import {InspectArgs} from "src/app/features/inspector/types"
import {View} from "src/app/features/inspector/views/view"

export class AlertView extends View {
  static when(args: InspectArgs) {
    return (
      args.type === zed.TypeString &&
      args.field?.name === "event_type" &&
      args.value.toString() == "alert"
    )
  }

  get severity() {
    try {
      return this.args.field.parent.get(["alert", "severity"]).toString()
    } catch (_) {
      return "?"
    }
  }

  get className() {
    const type = `alert-${this.severity}`
    return `zeek-path-tag ${type}-bg-color`
  }

  render() {
    return `alert (${this.severity})`
  }
}
