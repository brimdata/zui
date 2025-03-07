import {ContainerView} from "../views/container-view"
import * as container from "./container"
import {typename} from "./typename"

export function closing(view: ContainerView) {
  let nodes = []
  if (view.showSyntax) {
    nodes.push(container.close(view))
  }
  if (view.decorator && view.showDecorator) {
    nodes.push(typename(view.decorator))
  }
  if (!view.isLast && view.showSyntax) {
    nodes.push(",")
  }
  return nodes
}
