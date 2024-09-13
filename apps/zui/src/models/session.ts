import {queryPath, snapshotPath} from "src/app/router/utils/paths"
import {DomainModel} from "src/core/domain-model"
import Inspector from "src/js/state/Inspector"
import Table from "src/js/state/Table"
import Selection from "src/js/state/Selection"
import {EditorSnapshot} from "./editor-snapshot"
import {SessionHistory} from "./session-history"
import {NamedQuery} from "./named-query"
import {BrowserTab} from "./browser-tab"
import SessionQueries from "src/js/state/SessionQueries"
import {snapshotShow} from "src/app/router/routes"
import {Snapshot} from "./snapshot"
import {QuerySession} from "./query-session"

type Attrs = {
  id: string
  parentId?: string
  snapshotId?: string
}

export class Session extends DomainModel<Attrs> {
  static activateLastFocused() {
    const tab = BrowserTab.orderBy("lastFocused", "desc").find((tab) =>
      tab.matchesPath(snapshotShow.path)
    )
    if (tab) {
      tab.activate()
    } else {
      Session.create().tab.activate()
    }
  }

  static create() {
    const {id} = QuerySession.create()
    const now = new Date().toISOString()
    this.dispatch(SessionQueries.init(id))
    BrowserTab.create({id, lastFocused: now})
    return new Session({id})
  }

  get hasUrl() {
    return !!this.parentId && !!this.snapshotId
  }

  get id() {
    return this.attrs.id
  }

  get parentId() {
    return this.attrs.parentId
  }

  get snapshotId() {
    return this.attrs.snapshotId
  }

  get pathname() {
    return queryPath(this.parentId, this.snapshotId)
  }

  get snapshot() {
    let snapshot = EditorSnapshot.find(this.id, this.snapshotId)
    if (snapshot) {
      return snapshot
    } else {
      console.warn(
        "Did not find snapshot on the session, falling back to named query snapshot"
      )
      return EditorSnapshot.find(this.attrs.parentId, this.attrs.snapshotId) // remove after some time has gone by
    }
  }

  get snapshots() {
    return EditorSnapshot.where({parentId: this.id})
  }

  get history() {
    return new SessionHistory({id: this.id})
  }

  get hasNamedQuery() {
    return this.parentId && this.id !== this.parentId
  }

  get namedQuery() {
    return this.hasNamedQuery ? NamedQuery.find(this.parentId) : null
  }

  get isModified() {
    return (
      this.hasNamedQuery &&
      !!this.namedQuery &&
      this.snapshot.equals(this.namedQuery.lastSnapshot)
    )
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  navigate(snapshot: Snapshot) {
    this.reset()
    this.tab.load(snapshot.pathname)
  }

  load() {
    this.reset()
    this.tab.load(this.pathname)
  }

  pushHistory() {
    if (!this.history.contains(this.parentId, this.snapshotId)) {
      this.history.push(this.parentId, this.snapshotId)
    }
  }

  reset() {
    this.dispatch(Selection.reset())
    this.dispatch(Table.setScrollPosition({top: 0, left: 0}))
    this.dispatch(Inspector.setScrollPosition({top: 0, left: 0}))
  }
}
