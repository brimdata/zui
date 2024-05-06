import {FormEvent} from "react"
import Layout from "src/js/state/Layout"
import {ViewHandler} from "src/core/view-handler"
import {Props} from "."
import {Active} from "src/models/active"
import {NamedQuery} from "src/models/named-query"

export class ToolbarHandler extends ViewHandler {
  constructor(public props: Props) {
    super()
  }

  async onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("query-name") as any
    const name = input.value.trim() || ""
    if (name.length) {
      if (this.hasNamedQuery && !this.isModified) {
        alert("todo rename")
        this.request("files#rename", {path: this.namedQueryId, name})
      } else {
        const path = Active.workspace.attrs.path + "/" + name + ".zed"
        const text = Active.snapshot.attrs.value
        const meta = {}
        await NamedQuery.create({path, name, text, meta})
      }
    }
    this.dispatch(Layout.hideTitleForm())
  }

  onReset() {
    this.dispatch(Layout.hideTitleForm())
  }

  onBlur(e) {
    if (this.select(Layout.getIsEditingTitle)) {
      this.onSubmit(e)
    }
  }

  onKeyUp(e) {
    switch (e.key) {
      case "Escape":
        this.onReset()
        break
      case "Enter":
        this.onSubmit(e)
        break
    }
  }

  get hasNamedQuery() {
    return !!this.props.namedQuery
  }

  get isModified() {
    return this.props.isModified
  }

  get namedQueryId() {
    return this.props.namedQuery?.id
  }

  get title() {
    if (this.props.namedQuery) {
      return this.props.namedQuery.name + (this.isModified ? "*" : "")
    } else {
      return "Untitled"
    }
  }
}
