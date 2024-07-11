import {last} from "lodash"
import {ApplicationModel} from "./application-model"
import {EditorSnapshot} from "./editor-snapshot"
import {BrowserTab} from "./browser-tab"

export class SessionEntry extends ApplicationModel {
  static attributes = {
    name: {type: String, default: null},
  }

  get displayName() {
    const snapshot = this.lastSnapshot
    return snapshot ? snapshot.toQueryText() : "New Session"
  }

  get snapshots() {
    return EditorSnapshot.where({parentId: this.id})
  }

  get lastSnapshot() {
    return last(this.snapshots)
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  get isOpen() {
    return !!this.tab
  }

  activate() {
    if (this.isOpen) this.tab.activate()
    else this.restore()
  }

  restore() {
    BrowserTab.restore(this.id)
  }
}

globalThis.SessionEntry = SessionEntry
