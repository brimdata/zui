import {nanoid} from "@reduxjs/toolkit"
import {DomainModel} from "src/core/domain-model"
import Workspaces, {WorkspaceEntity} from "src/js/state/Workspaces"
import {basename} from "src/util/basename"

type Attrs = WorkspaceEntity

export class Workspace extends DomainModel<Attrs> {
  static create(attrs: Partial<Attrs>) {
    const attributes = {...Workspace.defaultAttrs, ...attrs}
    this.dispatch(Workspaces.create(attributes))
    return new Workspace(attributes)
  }

  static get defaultAttrs(): Attrs {
    return {
      id: nanoid(),
      openedAt: new Date().toISOString(),
      path: "",
    }
  }

  get name() {
    return basename(this.attrs.path)
  }
}
