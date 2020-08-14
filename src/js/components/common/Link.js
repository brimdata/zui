/* @flow */
import React from "react"

import {shell} from "electron"

type Props = {|href: string, children: *|}

export default function Link({href, children}: Props) {
  const click = (e) => {
    e.preventDefault()
    shell.openExternal(href)
  }
  return (
    <a href={"" /* triggers underline style */} onClick={click} tabIndex="0">
      {children}
    </a>
  )
}
