import {zed} from "@brimdata/zealot"
import {SuricataEvent} from "./SuricataEvent"
import {UnknownEvent} from "./UnknownEvent"
import {ZeekEvent} from "./ZeekEvent"

export interface BrimEventInterface {
  getType: () => string
  getTime: () => Date
  getRecord: () => zed.Record
  getEndTime: () => Date | null
}

export class BrimEvent {
  static build(r: zed.Record) {
    if (
      r.has("_path", zed.TypeString, zed.TypeBString) &&
      r.has("ts", zed.TypeTime)
    ) {
      return new ZeekEvent(r)
    } else if (
      r.has("event_type", zed.TypeString, zed.TypeBString) &&
      r.has("ts", zed.TypeTime)
    ) {
      return new SuricataEvent(r)
    } else {
      return new UnknownEvent(r)
    }
  }
}
