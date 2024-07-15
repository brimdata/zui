import {queryPath} from "src/app/router/utils/paths"
import {ApplicationEntity} from "./application-entity"
import {SourceSet} from "./editor-snapshot/source-set"
import buildPin from "src/js/state/Editor/models/build-pin"

export class Snapshot extends ApplicationEntity {
  static attributes = {
    value: [{type: String, default: ""}],
    pins: [{type: Array /*  item: Pin */, default: []}],
    sessionId: [{type: String, default: null}],
    queryId: [{type: String, default: null}],
  }

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

  get sourceSet() {
    return new SourceSet(
      this.activePins().map((pin) => pin.toZed()),
      this.attrs.value
    )
  }

  get queryText() {
    return this.sourceSet.contents
  }
}
