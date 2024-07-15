import {BrowserTab} from "./browser-tab"
import {Snapshot} from "./snapshot"
import {ApplicationEntity} from "./application-entity"

export class Session extends ApplicationEntity {
  static attributes = {
    name: [{type: String, default: null}],
  }

  static createWithTab(attrs = {}) {
    const session = this.create(attrs)
    const tab = BrowserTab.create({id: session.id})
    const snapshot = Snapshot.create()
    tab.activate()
    tab.load(snapshot.pathname)
    return session
  }
}
