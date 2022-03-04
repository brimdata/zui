import {zed} from "@brimdata/zealot"
import {View} from "../views/view"
import {item} from "./item"
import {key} from "./key"
import {typename} from "./typename"

export function field(view: View<zed.Any>) {
  const nodes = []
  if (view.args.key) {
    nodes.push(key(view))
  }

  nodes.push(item(view))

  if (zed.isTypeAlias(view.args.type)) {
    nodes.push(typename(view))
  }

  if (!view.args.last) {
    nodes.push(", ")
  }

  return nodes
}
