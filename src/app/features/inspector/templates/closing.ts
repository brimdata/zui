import {ContainerView} from "../views/container-view"
import * as container from "./container"
import {typename} from "./typename"
import {zed} from "@brimdata/zealot"

export function closing(view: ContainerView) {
  let nodes = []
  nodes.push(container.close(view))
  if (zed.isTypeAlias(view.args.type)) nodes.push(typename(view))
  if (!view.args.last) nodes.push(",")
  return nodes
}
