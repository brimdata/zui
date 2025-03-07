import React from "react"
import {invoke} from "src/core/invoke"

type Props = {href?: string; children: any; onClick?: Function}

export function Link({href, onClick, children}: Props) {
  // Anchors can be passed through
  if (href?.startsWith("#")) return <a href={href}>{children}</a>

  const click = (e) => {
    e.preventDefault()
    if (href) {
      invoke("openLinkOp", href)
    } else if (onClick) {
      onClick(e)
    }
  }
  return (
    <a
      href={
        ""
        /* triggers underline style */
      }
      onClick={click}
      tabIndex={0}
    >
      {children}
    </a>
  )
}
