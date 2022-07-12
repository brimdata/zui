import React, {ReactNode} from "react"
import styled from "styled-components"
import DragAnchor from "./DragAnchor"

type Props = {
  onDrag: (e: React.MouseEvent) => void
  dragAnchor: "right" | "left"
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
