import {nanoid} from "@reduxjs/toolkit"
import {orderBy} from "lodash"
import {matchPath} from "react-router"
import {DomainModel} from "src/core/domain-model"
import Tabs from "src/js/state/Tabs"
import {QuerySession} from "./query-session"
import {whichRoute} from "src/app/router/routes"
import {IconName} from "src/components/icon"
import {Snapshot} from "./snapshot"
import Pools from "src/js/state/Pools"
import Current from "src/js/state/Current"

type Attrs = {
  id: string
  lastFocused: string
}

export class BrowserTab extends DomainModel<Attrs> {
  get id() {
    return this.attrs.id
  }

  static findByRoute(routePattern: string) {
    return this.orderBy("lastFocused", "desc").find((tab) =>
      tab.matchesPath(routePattern)
    )
  }

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

  static get count() {
    return this.all.length
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

  static get active() {
    return this.find(this.select(Tabs.getActive))
  }

  load(pathname: string) {
    if (this.history.location.pathname === pathname) {
      this.history.replace(pathname)
    } else {
      // Whenever a tab is created it constructs itself with a root entry "/".
      // This can mess up the tab history back button, allowing the user to
      // get back to this "root" url which does not contain forward/back buttons.
      // Instead, this if statement resets the entries and index for this tab
      // if the only url in the entries array is "/", making it the
      // first entry in the history the first pathname given to browerTab.load()
      if (this.history.length == 1 && this.history.location.pathname === "/") {
        this.history.entries = []
        this.history.index = -1
      }
      this.history.push(pathname)
    }
  }

  reload() {
    this.history.replace(this.history.location.pathname)
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

  destroy() {
    const session = QuerySession.find(this.attrs.id)
    if (session && session.history.length === 0) {
      session.destroy()
    }
    this.remove()
  }

  get route() {
    return whichRoute(this.history.location.pathname)
  }

  get iconName(): IconName {
    return this.route?.icon || "zui"
  }

  setTitle(title: string) {
    this.dispatch(Tabs.setTitle({tabId: this.attrs.id, title}))
  }

  remove() {
    this.dispatch(Tabs.remove(this.attrs.id))
  }

  get params(): any {
    return matchPath(this.pathname, this.route.path).params ?? {}
  }

  get pathname() {
    return this.history.location.pathname
  }

  updateTitle() {
    // Not the prettiest of code
    const lakeId = this.select(Current.getLakeId)
    switch (this.route.name) {
      case "snapshot":
        var id = this.params.id
        var snapshot = Snapshot.find(id)
        this.setTitle(snapshot?.title || "Query Session")
        break
      case "poolShow":
        var id = this.params.poolId
        var pool = this.select(Pools.get(lakeId, id))
        if (pool) {
          this.setTitle(pool.name)
        } else {
          this.setTitle("Pool")
        }
        break
      case "welcome":
        this.setTitle("Welcome")
        break
      case "releaseNotes":
        this.setTitle("Release Notes")
        break
      case "root":
        // not sure yet
        break
    }
  }
}
