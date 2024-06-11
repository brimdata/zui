import {nanoid} from "@reduxjs/toolkit"
import {isEqual} from "lodash"
import {queryPath} from "src/app/router/utils/paths"
import {DomainModel} from "src/core/domain-model"
import buildPin from "src/js/state/Editor/models/build-pin"
import {QueryPin, QueryPinInterface} from "src/js/state/Editor/types"
import QueryVersions from "src/js/state/QueryVersions"
import {SourceSet} from "./editor-snapshot/source-set"
import {Validator} from "./editor-snapshot/validator"

type Attrs = {
  version: string
  ts: string // aka lastRanAt
  parentId: string | null
  value: string
  pins: QueryPin[]
}

export class EditorSnapshot extends DomainModel<Attrs> {
  validator = new Validator()

  constructor(attrs: Partial<Attrs> = {}) {
    super({
      version: nanoid(),
      ts: new Date().toISOString(),
      value: "",
      pins: [],
      parentId: null,
      ...attrs,
    })
  }

  static find(parentId: string, id: string) {
    const attrs = this.select((state) =>
      QueryVersions.at(parentId).find(state, id)
    )
    return attrs ? new EditorSnapshot({...attrs, parentId}) : null
  }

  static where(args: {parentId: string}) {
    return this.select(QueryVersions.at(args.parentId).all).map(
      (attrs) => new EditorSnapshot({...attrs, parentId: args.parentId})
    )
  }

  get id() {
    return this.attrs.version
  }

  get pathname() {
    return queryPath(this.attrs.parentId, this.attrs.version)
  }

  get parentId() {
    return this.attrs.parentId
  }

  activePins() {
    return this.attrs.pins
      .filter((pin) => !pin.disabled)
      .map<QueryPinInterface>((attrs) => buildPin(attrs))
  }

  toSourceSet() {
    return new SourceSet(
      this.activePins().map((pin) => pin.toZed()),
      this.attrs.value
    )
  }

  toQueryText() {
    return this.toSourceSet().contents
  }

  equals(other: EditorSnapshot) {
    return (
      isEqual(this.attrs.pins, other.attrs.pins) &&
      isEqual(this.attrs.value, other.attrs.value)
    )
  }

  save() {
    const {parentId, ...rest} = this.attrs
    this.dispatch(QueryVersions.at(parentId).create({...rest}))
  }

  clone(attrs: Partial<Attrs>) {
    return new EditorSnapshot({...this.attrs, ...attrs})
  }

  async isValid() {
    return this.validator.validate(this)
  }

  get errors() {
    return this.validator.errors
  }
}
