import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"

const schema = {
  value: {type: String, default: ""},
  pins: {type: Array, default: []}, // Maybe use the pin classes
  sessionId: {type: String, default: null},
  queryId: {type: String, default: null},
}

type Attributes = AttributeTypes<typeof schema>

export class Snapshot extends ApplicationEntity<Attributes> {
  static schema = schema
  static actionPrefix = "$snapshots"
}
