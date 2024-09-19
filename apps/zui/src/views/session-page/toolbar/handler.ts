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
import {plusOne} from "src/util/plus-one"

export class ToolbarHandler extends ViewHandler {
  nav = nav
  menuItems: MenuItem[]
  isEditing: boolean
  snapshot: Snapshot
  oldApi: ZuiApi
  isModified: boolean = false
  isSubmitting = false

  constructor() {
    super()
    this.oldApi = useZuiApi()
    this.snapshot = useSelector(Current.getSnapshot)
    this.isEditing = useSelector(Layout.getIsEditingTitle)
    this.menuItems = useMenuExtension(
      "results.toolbarMenu",
      createMenu(),
      useSelector(get.whenContext)
    )
    this.listen({
      "session.resetQuery": () => this.onDetach(),
      "session.saveAsNewQuery": () => this.onSaveAs(),
    })
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    if (this.isSubmitting) return
    this.isSubmitting = true
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

  onSaveAs() {
    const name = this.queryName
    const newName = plusOne(name)
    this.onCreate(newName)
    setTimeout(() => {
      this.dispatch(Layout.showTitleForm())
    })
  }

  onReset() {
    this.hideForm()
  }

  onDetach() {
    const session = Active.querySession
    const next = Snapshot.create({
      sessionId: session.id,
      queryId: null,
      ...Active.editorState,
    })
    session.tab.load(next.pathname)
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
