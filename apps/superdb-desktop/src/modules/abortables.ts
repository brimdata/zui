import {nanoid} from "@reduxjs/toolkit"
import {isString, remove} from "lodash"

export type Abortable<Meta = any> = {
  id: string
  tab?: string
  tag?: string
  meta?: Meta
  abort: () => void | Promise<void>
}

type NewAbortable = Omit<Abortable, "id">
type Predicate = string | Partial<Abortable>

export class Abortables {
  registry: Abortable[] = []

  async abort(predicate: string | Partial<Abortable>) {
    const aborts = this.filter(predicate)
    this.remove(predicate)
    return await Promise.all(aborts.map((a) => a.abort()))
  }

  async abortAll() {
    return Promise.all(this.all().map((a) => a.abort()))
  }

  create(id: string) {
    const ctl = new AbortController()
    this.add({id, abort: () => ctl.abort()})
    return ctl
  }

  add(a: Abortable | NewAbortable) {
    const id = "id" in a ? a.id : nanoid()
    this.registry.push({id, ...a})
    return id
  }

  all() {
    return [...this.registry]
  }

  filter(predicate?: Predicate) {
    if (!predicate) return this.all()
    return this.registry.filter(this.matchFn(predicate))
  }

  get(id: string) {
    return this.registry.find((a) => a.id === id) || null
  }

  remove(predicate?: Predicate) {
    if (!predicate) {
      this.registry = []
    } else {
      remove(this.registry, this.matchFn(predicate))
    }
  }

  private matchFn(predicate: Predicate) {
    return (a: Abortable) => {
      if (isString(predicate)) {
        return a.id === predicate
      } else {
        return Object.keys(predicate).every((key) => a[key] === predicate[key])
      }
    }
  }
}
