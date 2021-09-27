import {nanoid} from "@reduxjs/toolkit"
import {isString, remove} from "lodash"

export type Abortable<Meta extends any = any> = {
  id: string
  tab?: string
  tag?: string
  meta?: Meta
  abort: () => void | Promise<void>
}

type NewAbortable = Omit<Abortable, "id">

export class Abortables {
  registry: Abortable[] = []

  async abort(predicate: string | Partial<Abortable>) {
    if (isString(predicate)) {
      const a = this.get(predicate)
      if (a) return await a.abort()
    } else {
      return Promise.all(this.filter(predicate).map((a) => a.abort()))
    }
  }

  async abortAll() {
    return Promise.all(this.all().map((a) => a.abort()))
  }

  add(a: Abortable | NewAbortable) {
    const id = "id" in a ? a.id : nanoid()
    this.registry.push({id, ...a})
    return id
  }

  all() {
    return [...this.registry]
  }

  filter(predicate?: Partial<Abortable>) {
    if (!predicate) return this.all()
    return this.registry.filter(this.matchFn(predicate))
  }

  get(id: string) {
    return this.registry.find((a) => a.id === id) || null
  }

  remove(predicate?: string | Partial<Abortable>) {
    if (!predicate) {
      this.registry = []
    } else if (isString(predicate)) {
      remove(this.registry, (a) => a.id === predicate)
    } else {
      remove(this.registry, this.matchFn(predicate))
    }
  }

  private matchFn(predicate) {
    return (a) =>
      Object.keys(predicate).every((key) => a[key] === predicate[key])
  }
}
