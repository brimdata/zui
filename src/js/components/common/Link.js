/* @flow */
import React from "react"

import {shell} from "electron"

type Props = {|href: string, children: *|}

export default function Link({href, children}: Props) {
  return <a onClick={() => shell.openExternal(href)}>{children}</a>
}
