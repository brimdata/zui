import * as nav from "src/domain/session/handlers/navigation"
import {ViewHandler} from "src/core/view-handler"
import {useSelector} from "react-redux"
import {MenuItem, useMenuExtension} from "src/core/menu"
import * as get from "./selectors"
import {createMenu} from "./menu"
import {FormEvent} from "react"
import Current from "src/js/state/Current"
import {Snapshot} from "src/models/snapshot"
import {useZuiApi} from "src/views/application/context"
import ZuiApi from "src/js/api/zui-api"
import Layout from "src/js/state/Layout"
import {editQuery} from "src/domain/session/handlers"
import {Active} from "src/models/active"
import {NamedQuery} from "src/models/named-query"

export class ToolbarHandler extends ViewHandler {
  nav = nav
  menuItems: MenuItem[]
  isEditing: boolean
  snapshot: Snapshot
  oldApi: ZuiApi
  isModified: boolean = false

  constructor() {
    super()
    this.oldApi = useZuiApi()
    this.snapshot = useSelector(Current.getSnapshot)
    this.isEditing = useSelector(Layout.getIsEditingTitle)
    const context = useSelector(get.whenContext)
    const defaultItems = createMenu(this)
    this.menuItems = useMenuExtension(
      "results.toolbarMenu",
      defaultItems,
      context
    )
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("query-name") as any
    const name = input.value.trim() || ""
    if (name.length) {
      this.hasQuery ? this.onRename(name) : this.onCreate(name)
    }
    this.hideForm()
  }

  onCreate(name: string) {
    const {pins, value} = Active.editorState
    const session = Active.querySession
    const query = NamedQuery.create({name, value, pins})
    const snapshot = Snapshot.create({
      queryId: query.id,
      sessionId: session.id,
      pins,
      value,
    })
    session.tab.load(snapshot.pathname)
  }

  onRename(name: string) {
    const query = NamedQuery.find(this.queryId)
    query.update({name})
  }

  onReset() {
    this.hideForm()
  }

  onBlur(e: FormEvent<any>) {
    if (this.isEditing) this.onSubmit(e)
  }

  onKeyUp(e: any) {
    switch (e.key) {
      case "Escape":
        this.onReset()
        break
      case "Enter":
        this.onSubmit(e)
        break
    }
  }

  onEdit() {
    editQuery()
  }

  get hasQuery() {
    return !!this.snapshot.query
  }

  get queryName() {
    if (this.hasQuery) {
      return this.snapshot.query.name
    } else {
      return undefined
    }
  }

  get queryId() {
    return this.snapshot.queryId
  }

  private hideForm() {
    this.dispatch(Layout.hideTitleForm())
  }
}
