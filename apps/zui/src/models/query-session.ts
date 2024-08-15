import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"
import {EntityState} from "@reduxjs/toolkit"
import {BrowserTab} from "./browser-tab"
import Tabs from "src/js/state/Tabs"
import {actions} from "src/js/state/SessionHistories/reducer"
import {getById} from "src/js/state/SessionHistories/selectors"
import {queryPath} from "src/app/router/utils/paths"
import {last} from "lodash"
import {EditorSnapshot} from "./editor-snapshot"

const schema = {
  name: {type: String, default: null as string},
}

type Attributes = AttributeTypes<typeof schema>

export type QuerySessionState = EntityState<Attributes, string>

export class QuerySession extends ApplicationEntity<Attributes> {
  static schema = schema
  static actionPrefix = "$querySessions"
  static sliceName = "querySessions"

  activate() {
    if (this.tab) this.tab.activate()
    else this.restore()
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  get history() {
    return this.select(getById(this.id)) || []
  }

  get lastSnapshot() {
    const entry = last(this.history)
    if (!entry) return null
    return EditorSnapshot.find(entry.queryId, entry.version)
  }

  get displayName() {
    const snapshot = this.lastSnapshot
    if (snapshot) return snapshot.toQueryText()
    else return "(New Session)"
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
      this.dispatch(Tabs.closeActive())
    } else {
      this.dispatch(Tabs.remove(this.id))
    }
  }
}
