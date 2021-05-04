import {zed} from "zealot"
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
    if (r.has("_path")) {
      return new ZeekEvent(r)
    } else if (r.has("event_type")) {
      return new SuricataEvent(r)
    } else {
      return new UnknownEvent(r)
    }
  }
}
