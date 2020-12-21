import {zng} from "zealot"
import {BrimEventInterface} from "./BrimEvent"

export class SuricataEvent implements BrimEventInterface {
  constructor(private r: zng.Record) {}

  getTime() {
    return (this.r.get("ts") as zng.Primitive).toDate()
  }

  getType() {
    return this.r.get("event_type").toString()
  }
}
