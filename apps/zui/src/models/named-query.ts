import {DomainModel} from "src/core/domain-model"
import Queries from "src/js/state/Queries"
import {nanoid} from "@reduxjs/toolkit"
import {QueryPin} from "src/js/state/Editor/types"
import {Query} from "src/js/state/Queries/types"
import {Snapshot} from "./snapshot"

type Attrs = {
  name: string
  id: string
  value: string
  pins: QueryPin[]
}

export class NamedQuery extends DomainModel<Attrs> {
  static find(id: string) {
    const attrs = this.select((state) => Queries.find(state.queries, id))
    if (!attrs) return null
    return new NamedQuery(attrs)
  }

  static create(args: {
    name: string
    pins: QueryPin[]
    value: string
    parentId?: string
  }) {
    const id = nanoid()
    const {name, pins, value, parentId} = args
    const attrs = {id, pins, value, name}
    this.dispatch(Queries.addItem(attrs, parentId))
    return this.find(id)
  }

  get id() {
    return this.attrs.id
  }

  get pins() {
    return this.attrs.pins
  }

  get value() {
    return this.attrs.value
  }

  get lastSnapshot() {
    return this.snapshots[this.snapshots.length - 1]
  }

  get snapshots() {
    return Snapshot.where({queryId: this.attrs.id})
  }

  update(changes: Partial<Query>) {
    this.dispatch(Queries.editItem({id: this.id, changes}))
  }
}
