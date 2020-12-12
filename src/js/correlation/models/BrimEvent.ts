import {zng} from "../../../../zealot/dist"
import {UnknownEvent} from "./UnknownEvent"
import {SuricataEvent} from "./SuricataEvent"
import {ZeekEvent} from "./ZeekEvent"

export interface BrimEventInterface {
  getType: () => string
  getTime: () => Date
}

export class BrimEvent {
  static build(r: zng.Record) {
    if (r.has("_path")) {
      return new ZeekEvent(r)
    } else if (r.has("event_type")) {
      return new SuricataEvent(r)
    } else {
      return new UnknownEvent(r)
    }
  }
}
