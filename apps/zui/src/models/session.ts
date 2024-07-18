<<<<<<< HEAD
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
=======
import {queryPath} from "src/app/router/utils/paths"
import {DomainModel} from "src/core/domain-model"
import Inspector from "src/js/state/Inspector"
import Table from "src/js/state/Table"
import Selection from "src/js/state/Selection"
import {EditorSnapshot} from "./editor-snapshot"
import {SessionHistory} from "./session-history"
import {NamedQuery} from "./named-query"
import {BrowserTab} from "./browser-tab"
import SessionQueries from "src/js/state/SessionQueries"
import {nanoid} from "@reduxjs/toolkit"
import {queryVersion} from "src/app/router/routes"

type Attrs = {
  id: string
  parentId?: string
  snapshotId?: string
}

export class Session extends DomainModel<Attrs> {
  static activateLastFocused() {
    const tab = BrowserTab.orderBy("lastFocused", "desc").find((tab) =>
      tab.matchesPath(queryVersion.path)
    )
    if (tab) {
      tab.activate()
    } else {
      Session.create().tab.activate()
    }
  }

  static create() {
    const id = nanoid()
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
>>>>>>> parent of d14fd4d20 (Renamed session to session-location)
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

<<<<<<< HEAD
  navigate(snapshot: Snapshot) {
    snapshot.save()
    this.tab.load(snapshot.pathname)
=======
  navigate(snapshot: EditorSnapshot, namedQuery?: NamedQuery) {
    const sessionSnapshot = snapshot.clone({parentId: this.id})
    sessionSnapshot.save()
    new Session({
      id: this.id,
      parentId: namedQuery ? namedQuery.id : this.id,
      snapshotId: sessionSnapshot.id,
    }).load()
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
>>>>>>> parent of d14fd4d20 (Renamed session to session-location)
  }
}
