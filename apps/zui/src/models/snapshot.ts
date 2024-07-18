import {queryPath} from "src/app/router/utils/paths"
import {SourceSet} from "./editor-snapshot/source-set"
import buildPin from "src/js/state/Editor/models/build-pin"
// import {isEqual} from "lodash"
// import {Validator} from "./editor-snapshot/validator"
import {QueryPin} from "src/js/state/Editor/types"
import {ApplicationEntity} from "./application-entity"
import {AttributeTypes} from "bullet"

const schema = {
  value: {type: String, default: "" as string},
  pins: {type: Array /*  item: Pin */, default: [] as QueryPin[]},
  sessionId: {type: String, default: null as string},
  queryId: {type: String, default: null as string},
}

type Attributes = AttributeTypes<typeof schema>

export class Snapshot extends ApplicationEntity<Attributes> {
  static schema = schema
  pins: Attributes["pins"]
  queryId: Attributes["queryId"]
  sessionId: Attributes["sessionId"]
  value: Attributes["value"]

  get pathname() {
    return queryPath(this.parentId, this.id)
  }

  get parentId() {
    return this.queryId ?? this.sessionId
  }

  get activePins() {
    return this.pins
      .filter((pin) => !pin.disabled)
      .map((attrs) => buildPin(attrs))
  }
  //
  get sourceSet() {
    return new SourceSet(
      this.activePins.map((pin) => pin.toZed()),
      this.value
    )
  }

  get queryText() {
    return this.sourceSet.contents
  }
  //
  //   equals(other: Snapshot) {
  //     return isEqual(this.pins, other.pins) && isEqual(this.value, other.value)
  //   }
  //
  //   clone(attrs: Partial<Attributes>) {
  //     return new Snapshot({...this.attributes, ...attrs})
  //   }

  // public validator = new Validator()
  // async isValid() {
  //   return this.validator.validate(this)
  // }

  // get errors() {
  //   return this.validator.errors
  // }
}
