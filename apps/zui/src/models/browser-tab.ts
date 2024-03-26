import {nanoid} from "@reduxjs/toolkit"
import {orderBy} from "lodash"
import {matchPath} from "react-router"
import {DomainModel} from "src/core/domain-model"
import Tabs from "src/js/state/Tabs"

type Attrs = {
  id: string
  lastFocused: string
}

export class BrowserTab extends DomainModel<Attrs> {
  static find(id: string) {
    const attrs = this.select(Tabs.findById(id))
    return attrs ? new BrowserTab(attrs) : null
  }

  static get all() {
    return this.select(Tabs.getData).map((data) => {
      const {id, lastFocused} = data
      return new BrowserTab({id, lastFocused})
    })
  }

  static orderBy(attr: keyof Attrs, direction: "asc" | "desc") {
    return orderBy(this.all, [(tab) => tab.attrs[attr]], [direction])
  }

  static create(attrs: Partial<Attrs> = {}) {
    const id = attrs.id || nanoid()
    const lastFocused = attrs.lastFocused || new Date().toISOString()
    globalThis.tabHistories.create(id, [], -1)
    this.dispatch(Tabs.add(id))
    return new BrowserTab({id, lastFocused})
  }

  load(pathname: string) {
    if (this.history.location.pathname === pathname) {
      this.history.replace(pathname)
    } else {
      this.history.push(pathname)
    }
  }

  activate() {
    this.dispatch(Tabs.activate(this.attrs.id))
  }

  matchesPath(path) {
    return !!matchPath(this.history.location.pathname, {path, exact: true})
  }

  get history() {
    return globalThis.tabHistories.getOrCreate(this.attrs.id)
  }
}
