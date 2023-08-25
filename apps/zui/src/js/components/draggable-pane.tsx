import React, {ReactNode} from "react"
import styled from "styled-components"
import DragAnchor from "src/components/drag-anchor"

type Props = {
  onDrag: (e: MouseEvent, args: {dx: number; dy: number}) => void
  dragAnchor: "right" | "left" | "top" | "bottom"
  children: ReactNode
}

const Pane = styled.div<any>`
  position: relative;
`

export function DraggablePane({onDrag, dragAnchor, children, ...props}: Props) {
  return (
    <Pane {...props}>
      {children}
      <DragAnchor onDrag={onDrag} position={dragAnchor} />
    </Pane>
  )
}
