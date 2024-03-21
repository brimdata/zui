import {isEqual} from "lodash"
import {queryPath} from "src/app/router/utils/paths"
import {DomainModel} from "src/core/domain-model"
import {QueryPin} from "src/js/state/Editor/types"
import QueryVersions from "src/js/state/QueryVersions"

type Attrs = {
  version: string
  ts: string // aka lastRanAt
  value: string
  pins: QueryPin[]
  parentId: string
}

export class EditorSnapshot extends DomainModel<Attrs> {
  static where(args: {parentId: string}) {
    return this.select(QueryVersions.at(args.parentId).all).map(
      (attrs) => new EditorSnapshot({...attrs, parentId: args.parentId})
    )
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

  get pathname() {
    return queryPath(this.attrs.parentId, this.attrs.version)
  }

  load() {}
}
