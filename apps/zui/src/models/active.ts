import {DomainModel} from "src/core/domain-model"
import {Session} from "./session"
import Current from "src/js/state/Current"
import {BrowserTab} from "./browser-tab"
import {Frame} from "./frame"
import {getActiveTab} from "src/js/state/Tabs/selectors"
import {Lake} from "./lake"
import {Snapshot} from "./snapshot"
import {QuerySession} from "./query-session"
import Editor from "src/js/state/Editor"

export class Active extends DomainModel {
  static get tab() {
    const {id, lastFocused} = this.select(getActiveTab)
    return new BrowserTab({id, lastFocused})
  }

  static get querySession() {
    const {id} = this.select(getActiveTab)
    return QuerySession.find(id)
  }

  static get editorState() {
    return this.select(Editor.getSnapshot)
  }

  static get snapshot() {
    const id = this.select(Current.getSnapshotId)
    return Snapshot.find(id)
  }

  static get frame() {
    return new Frame({
      id: globalThis.windowId,
    })
  }

  static get lake() {
    const id = this.select(Current.getLakeId)
    return Lake.find(id)
  }
}
