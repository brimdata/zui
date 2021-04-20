import {ZedRecord} from "zealot/zed"
import {SuricataEvent} from "./SuricataEvent"
import {UnknownEvent} from "./UnknownEvent"
import {ZeekEvent} from "./ZeekEvent"

export interface BrimEventInterface {
  getType: () => string
  getTime: () => Date
  getRecord: () => ZedRecord
  getEndTime: () => Date | null
}

export class BrimEvent {
  static build(r: ZedRecord) {
    if (r.has("_path")) {
      return new ZeekEvent(r)
    } else if (r.has("event_type")) {
      return new SuricataEvent(r)
    } else {
      return new UnknownEvent(r)
    }
  }
}
