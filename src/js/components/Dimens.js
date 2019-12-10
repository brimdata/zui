/* @flow */

import React, {type Node} from "react"

import {useResizeObserver} from "./hooks/useResizeObserver"

type Props = {
  render: (DOMRectReadOnly) => Node
}

export default function Dimens({render, ...props}: Props) {
  let {rect, ref} = useResizeObserver()
  return (
    <div {...props} ref={ref}>
      {render(rect)}
    </div>
  )
}
