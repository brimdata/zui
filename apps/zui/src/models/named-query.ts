import {DomainModel} from "src/core/domain-model"
import {EditorSnapshot} from "./editor-snapshot"

type Attrs = {
  text: string
  meta: any
  path: string
  name: string
  id: string
}

export class NamedQuery extends DomainModel<Attrs> {
  static async read(path: string) {
    const {content, meta, name} = await this.request("files#show", {path})
    return new NamedQuery({id: path, text: content, name, meta, path})
  }

  static async create(attrs: Omit<Attrs, "id">) {
    await this.request("files#create", attrs)
    return await this.read(attrs.path)
  }

  get id() {
    return this.attrs.id
  }

  get name() {
    return this.attrs.name
  }

  get text() {
    return this.attrs.text
  }

  get pins() {
    return this.attrs.meta?.pins || []
  }

  get snapshot() {
    return new EditorSnapshot({
      pins: this.pins,
      value: this.text,
    })
  }
}
