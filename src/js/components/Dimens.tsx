import React, {ReactNode, HTMLProps} from "react"

import {Rect, useResizeObserver} from "./hooks/useResizeObserver"

interface Props {
  render: (arg0: Rect) => ReactNode
}

export default function Dimens({
  render,
  ...props
}: Props & HTMLProps<HTMLDivElement>) {
  let {rect, ref} = useResizeObserver()
  return (
    <div {...props} ref={ref}>
      {render(rect)}
    </div>
  )
}
