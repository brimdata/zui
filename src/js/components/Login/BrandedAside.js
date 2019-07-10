/* @flow */
import * as React from "react"

import Brand from "./Brand"

type Props = {
  children: React.Node
}

export default function BrandedAside({children}: Props) {
  return (
    <aside>
      <Brand />
      {children}
    </aside>
  )
}
