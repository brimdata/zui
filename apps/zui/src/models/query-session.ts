import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"
import {EntityState} from "@reduxjs/toolkit"
import {BrowserTab} from "./browser-tab"
import Tabs from "src/js/state/Tabs"
import {actions} from "src/js/state/SessionHistories/reducer"
import {getById} from "src/js/state/SessionHistories/selectors"
import {queryPath} from "src/app/router/utils/paths"
import {last} from "lodash"
import cmd from "src/cmd"
import {SnapshotAttrs} from "./snapshot"
import {Active} from "./active"
import {snapshotShow} from "src/app/router/routes"

const schema = {
  name: {type: String, default: null as string},
  title: {type: String, default: "(New Session)"},
}

type Attributes = AttributeTypes<typeof schema>

export type QuerySessionState = EntityState<Attributes, string>

export class QuerySession extends ApplicationEntity<Attributes> {
  static schema = schema
  static actionPrefix = "$querySessions"
  static sliceName = "querySessions"

  static activateOrCreate() {
    const tab = BrowserTab.findByRoute(snapshotShow.path)
    tab ? tab.activate() : this.createWithTab()
  }

  static createWithTab() {
    const instance = this.create()
    instance.createTab()
    return instance
  }

  createTab() {
    return BrowserTab.create({
      id: this.id,
      lastFocused: new Date().toISOString(),
    })
  }

  activate() {
    if (this.tab) this.tab.activate()
    else this.restore()
  }

  navigate(attrs: Partial<SnapshotAttrs>) {
    const next = Active.snapshot.clone(attrs)
    next.save()
    this.update({title: next.queryText})
    this.tab.load(next.pathname)
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  get history() {
    return this.select(getById(this.id)) || []
  }

  get displayName() {
    return this.attributes.name || this.attributes.title
  }

  get isActive() {
    return this.select(Tabs.getActive) === this.id
  }

  restore() {
    const history = this.history
    const entry = history && last(history)
    if (entry) {
      const url = queryPath(entry.queryId, entry.version)
      this.dispatch(Tabs.create(url, this.id))
    } else {
      const snapshot = new EditorSnapshot({
        pins: [],
        value: "",
        parentId: this.id,
      })
      snapshot.save()
      this.dispatch(Tabs.create(snapshot.pathname, this.id))
    }
  }

  destroy() {
    super.destroy()
    this.dispatch(actions.deleteById({sessionId: this.id}))
    global.tabHistories.delete(this.id)
    if (this.isActive) {
      cmd.tabs.closeActive()
    } else {
      this.dispatch(Tabs.remove(this.id))
    }
  }
}
