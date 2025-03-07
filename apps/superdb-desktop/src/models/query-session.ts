import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"
import {EntityState} from "@reduxjs/toolkit"
import {BrowserTab} from "./browser-tab"
import Tabs from "src/js/state/Tabs"
import {last} from "lodash"
import cmd from "src/cmd"
import {Snapshot, SnapshotAttrs} from "./snapshot"
import {snapshotShow} from "src/app/router/routes"

const schema = {
  name: {type: String, default: null as string},
  title: {type: String, default: null as string},
}

type Attributes = AttributeTypes<typeof schema>

export type QuerySessionState = EntityState<Attributes, string>

export class QuerySession extends ApplicationEntity<Attributes> {
  static schema = schema
  static actionPrefix = "$querySessions"
  static sliceName = "querySessions"

  static load(snapshot: Snapshot) {
    const session = this.activateOrCreate()
    session.load(snapshot)
  }

  static findLastFocused() {
    const tab = BrowserTab.findByRoute(snapshotShow.path)
    return tab ? this.find(tab.id) : null
  }

  static activateOrCreate() {
    const session = this.findLastFocused() || this.createWithTab()
    session.activate()
    return session
  }

  static createWithTab() {
    const instance = this.create()
    instance.createTab()
    return instance
  }

  static createAndActivate() {
    const session = this.createWithTab()
    session.activate()
    session.navigate({value: "", pins: []})
  }

  createTab() {
    if (this.tab) return
    return BrowserTab.create({
      id: this.id,
      lastFocused: new Date().toISOString(),
    })
  }

  activate() {
    if (this.tab) this.tab.activate()
    else this.restore()
  }

  /* Navigate creates a new snapshot based on the last one */
  navigate(attrs: Partial<SnapshotAttrs>) {
    const next = this.lastSnapshot
      ? this.lastSnapshot.clone(attrs)
      : new Snapshot({sessionId: this.id, ...attrs})
    next.save()
    this.load(next)
  }

  /* Load is used when you already have a saved snapshot */
  load(snapshot: Snapshot) {
    this.update({title: snapshot.title})
    this.tab.setTitle(snapshot.title)
    this.tab.load(snapshot.pathname)
  }

  /* Reload */
  reload() {
    this.tab.reload()
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  get history() {
    return Snapshot.where({sessionId: this.id})
  }

  get displayName() {
    return (
      this.attributes.name ||
      this.attributes.title ||
      this.lastSnapshot?.queryText ||
      "(New Session)"
    )
  }

  get isActive() {
    return this.select(Tabs.getActive) === this.id
  }

  get lastSnapshot() {
    return last(this.history)
  }

  restore() {
    this.createTab()
    this.tab.activate()
    const prev = this.lastSnapshot
    if (prev) {
      this.load(prev)
    } else {
      this.navigate({
        pins: [],
        value: "",
        sessionId: this.id,
      })
    }
  }

  destroy() {
    super.destroy()
    this.history.forEach((snapshot) => snapshot.destroy())
    global.tabHistories.delete(this.id)
    if (this.isActive) {
      cmd.tabs.closeActive()
    } else {
      this.tab.remove()
    }
  }
}
