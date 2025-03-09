import * as zed from "../../../../../packages/superdb-types/dist"
import {InspectArgs} from "src/views/inspector/types"
import {View} from "src/views/inspector/views/view"

export class AlertView extends View {
  static when(args: InspectArgs) {
    return (
      args.type === zed.TypeString &&
      args.field?.name === "event_type" &&
      args.value.toString() == "alert" &&
      args.field.rootRecord?.has(["alert", "severity"])
    )
  }

  get severity() {
    try {
      return this.args.field.rootRecord.get(["alert", "severity"]).toString()
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
