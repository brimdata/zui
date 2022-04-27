import React, {ReactElement} from "react"
import {ContainerView} from "../views/container-view"
import Icon from "src/app/core/icon-temp"
import classNames from "classnames"
import {zed} from "@brimdata/zealot"

export function open(view: ContainerView) {
  return (
    <span
      key={"open-token-" + view.args.indexPath.join(",")}
      className="zed-syntax"
    >
      {view.openToken()}
    </span>
  )
}

export function close(view: ContainerView) {
  return (
    <span
      key={"close-token-" + view.args.indexPath.join(",")}
      className="zed-syntax"
    >
      {view.closeToken()}
    </span>
  )
}

export function anchor(view: ContainerView, children: ReactElement[]) {
  return (
    <a
      key="handle"
      onClick={() => {
        view.args.ctx.props.setExpanded(
          view.args.indexPath.join(","),
          !view.isExpanded()
        )
      }}
    >
      {children}
    </a>
  )
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
