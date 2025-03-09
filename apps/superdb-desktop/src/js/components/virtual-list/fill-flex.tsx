import React from "react"
import useResizeObserver from "use-resize-observer"

const style = {
  flex: 1,
  width: "100%",
  height: "100%",
}

export function FillFlex(props: {children: any}) {
  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>()
  return (
    <div ref={ref} style={style}>
      {props.children({width, height})}
    </div>
  )
}
