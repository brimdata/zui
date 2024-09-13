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
import {create} from "src/domain/named-queries/handlers"
import {editQuery} from "src/domain/session/handlers"

export class ToolbarHandler extends ViewHandler {
  nav = nav
  menuItems: MenuItem[]
  isSaved: boolean
  isModified: boolean
  isEditing: boolean
  snapshot: Snapshot
  oldApi: ZuiApi

  constructor() {
    super()
    this.oldApi = useZuiApi()
    this.snapshot = useSelector(Current.getSnapshot)
    this.isModified = useSelector(get.isModified)
    this.isSaved = useSelector(get.isSaved)
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
      if (this.isSaved && !this.isModified) {
        this.oldApi.queries.rename(this.queryId, name)
      } else {
        create(name)
      }
    }
    this.hideForm()
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

  get queryName() {
    return this.snapshot.query.name
  }

  get queryId() {
    return this.snapshot.queryId
  }

  private hideForm() {
    this.dispatch(Layout.hideTitleForm())
  }
}
