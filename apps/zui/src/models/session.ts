import {AttributeTypes} from "bullet"
import {BrowserTab} from "./browser-tab"
import {Snapshot} from "./snapshot"
import {ApplicationEntity} from "./application-entity"

const schema = {
  name: {type: String, default: null as string},
}

type Attributes = AttributeTypes<typeof schema>

export class Session extends ApplicationEntity<Attributes> {
  static schema = schema

  name: Attributes["name"]

  static createWithTab(attrs: Partial<Attributes> = {}) {
    const session = this.create(attrs)
    const tab = BrowserTab.create({id: session.id})
    const snapshot = Snapshot.create({sessionId: session.id})
    tab.activate()
    tab.load(snapshot.pathname)
    return session
  }

  get snapshots() {
    return Snapshot.where({sessionId: this.id})
  }

  get snapshot() {
    const snapshots = this.snapshots
    return snapshots[snapshots.length - 1]
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  navigate(snapshot: Snapshot) {
    snapshot.save()
    this.tab.load(snapshot.pathname)
  }
}
