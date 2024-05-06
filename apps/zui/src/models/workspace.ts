import {nanoid} from "@reduxjs/toolkit"
import {DomainModel} from "src/core/domain-model"
import Workspaces, {WorkspaceEntity} from "src/js/state/Workspaces"
import {basename} from "src/util/basename"

type Attrs = WorkspaceEntity

export class Workspace extends DomainModel<Attrs> {
  static find(id: string) {
    const attrs = this.select(Workspaces.find(id))
    if (attrs) return new Workspace(attrs)
    throw new Error(`WorkspaceNotFound id=${id}`)
  }

  static get all() {
    return this.select(Workspaces.all).map((attrs) => new Workspace(attrs))
  }

  static create(attrs: Partial<Attrs>) {
    const attributes = {...Workspace.defaultAttrs, ...attrs}
    this.dispatch(Workspaces.create(attributes))
    return new Workspace(attributes)
  }

  static get default() {
    return new Workspace(Workspace.defaultAttrs)
  }

  static get defaultAttrs(): Attrs {
    return {
      id: nanoid(),
      openedAt: new Date().toISOString(),
      path: "/dev/null",
    }
  }

  get name() {
    return basename(this.attrs.path)
  }

  destroy() {
    this.dispatch(Workspaces.delete(this.attrs.id))
  }
}
