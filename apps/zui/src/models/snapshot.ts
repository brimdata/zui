import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"
import {snapshotPath} from "src/app/router/utils/paths"
import {QueryPin} from "src/js/state/Editor/types"
import buildPin from "src/js/state/Editor/models/build-pin"
import {SourceSet} from "./snapshot/source-set"
import {Validator} from "./snapshot/validator"
import {isEqual} from "lodash"
import Queries from "src/js/state/Queries"

/* Schema */
const schema = {
  value: {type: String, default: ""},
  pins: {type: Array, default: []}, // Maybe use a serializable pin class
  sessionId: {type: String, default: null},
  queryId: {type: String, default: null},
}

/* Types */
type Attributes = AttributeTypes<typeof schema>

/* Model */
export class Snapshot extends ApplicationEntity<Attributes> {
  /* Configuration */
  static schema = schema
  static actionPrefix = "$snapshots"

  /* Attributes */
  value: string
  pins: QueryPin[]
  sessionId: string
  queryId: string
  /* Instance Methods */
  get pathname() {
    return snapshotPath(this.id)
  }

  get queryText() {
    return this.sourceSet.contents
  }

  get activePins() {
    return this.pins
      .filter((pin) => !pin.disabled)
      .map((attrs) => buildPin(attrs))
  }

  get sourceSet() {
    return new SourceSet(
      this.activePins.map((pin) => pin.toZed()),
      this.value
    )
  }

  validator = new Validator()
  async isValid() {
    return this.validator.validate(this)
  }

  get errors() {
    return this.validator.errors
  }

  equals(other: Snapshot) {
    return isEqual(this.pins, other.pins) && isEqual(this.value, other.value)
  }

  get query() {
    return this.select((state) => Queries.find(state, this.queryId))
  }

  get isSaved() {
    return !!this.query
  }
}
