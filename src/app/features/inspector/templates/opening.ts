import {ContainerView} from "../views/container-view"
import {key} from "./key"
import * as container from "./container"
import {space} from "./space"

export function opening(view: ContainerView) {
  const nodes = []
  if (view.args.key) {
    nodes.push(key(view))
  }
  nodes.push(container.icon(view))
  nodes.push(space())
  nodes.push(container.open(view))
  return nodes
}
