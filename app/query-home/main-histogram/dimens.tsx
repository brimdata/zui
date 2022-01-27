import React, {ReactNode, HTMLProps} from "react"

import {
  Rect,
  useResizeObserver
} from "src/js/components/hooks/useResizeObserver"

interface Props {
  render: (arg0: Rect) => ReactNode
}

const Dimens = ({render, ...props}: Props & HTMLProps<HTMLDivElement>) => {
  const {rect, ref} = useResizeObserver()
  return (
    <div {...props} ref={ref}>
      {render(rect)}
    </div>
  )
}

export default Dimens
