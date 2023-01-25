import {zed} from "@brimdata/zealot"
import {RenderMode} from "../types"
import {View} from "../views/view"
import {item} from "./item"
import {key} from "./key"
import {space} from "./space"
import {typename} from "./typename"

export function field(view: View, mode: RenderMode) {
  const nodes = []

  if (view.showKey) {
    nodes.push(key(view))
  }

  nodes.push(item(view, mode))

  if (zed.isTypeAlias(view.type) && view.showDecorator) {
    nodes.push(typename(view))
  }

  if (!view.isLast) {
    nodes.push(view.showSyntax ? ", " : space())
  }

  return nodes
}
