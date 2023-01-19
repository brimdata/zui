import {ContainerView} from "../views/container-view"
import * as container from "./container"
import {typename} from "./typename"
import {zed} from "@brimdata/zealot"

export function closing(view: ContainerView) {
  let nodes = []
  if (view.showSyntax) {
    nodes.push(container.close(view))
  }
  if (zed.isTypeAlias(view.type)) nodes.push(typename(view))
  if (!view.isLast && view.showSyntax) nodes.push(",")
  return nodes
}
