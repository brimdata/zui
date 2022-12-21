import React, {ReactNode} from "react"
import {ContainerView} from "../views/container-view"
import Icon from "src/app/core/icon-temp"
import classNames from "classnames"
import {zed} from "@brimdata/zealot"
import {note} from "./note"

export function open(view: ContainerView) {
  return (
    <span key={"open-token-" + view.key} className="zed-syntax">
      {view.openToken()}
    </span>
  )
}

export function close(view: ContainerView) {
  return (
    <span key={"close-token-" + view.key} className="zed-syntax">
      {view.closeToken()}
    </span>
  )
}

export function expandAnchor(view: ContainerView, children: ReactNode) {
  return (
    <a
      key="expand-anchor"
      onClick={(e) => {
        e.altKey ? view.toggleRecursive() : view.toggle()
      }}
    >
      {children}
    </a>
  )
}

export function nextPageAnchor(view: ContainerView, perPage: number) {
  return [
    <a
      key="render-more-anchor"
      className="render-more"
      onClick={() => {
        view.args.ctx.props.incValuePage(view.key)
      }}
    >
      Show next {perPage}
    </a>,
  ]
}

export function reachedLimitAnchor(_view: ContainerView, _perPage: number) {
  return [
    <a
      key="render-more-anchor"
      className="render-more"
      onClick={() => {
        // TODO
      }}
    >
      Show Full Value in the Detail Pane
    </a>,
  ]
}

export function name(view: ContainerView) {
  return (
    <span
      key={"view" + view.name()}
      className={classNames("zed-container", {
        "zed-type": zed.isType(view.args.value),
        "zed-error": view.args.value instanceof zed.Error,
      })}
    >
      {view.name()}
    </span>
  )
}

export function icon(view: ContainerView) {
  if (view.isExpanded()) {
    return <Icon name="chevron-down" key="arrow" size={16} />
  } else {
    return <Icon name="chevron-right" key="arrow" size={16} />
  }
}

export function tail(view: ContainerView, limit: number) {
  const n = view.count() - limit
  return note(" …+" + n + " ")
}
