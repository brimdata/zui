import React, {ReactNode} from "react"
import DragAnchor from "src/components/drag-anchor"
import classNames from "classnames"

type Props = {
  onDrag: (e: MouseEvent, args: {dx: number; dy: number}) => void
  dragAnchor: "right" | "left" | "top" | "bottom"
  children: ReactNode
  className?: string
} & React.HTMLAttributes<any>

export function DraggablePane({
  onDrag,
  dragAnchor,
  children,
  className,
  ...props
}: Props) {
  return (
    <div className={classNames("relative", className)} {...props}>
      {children}
      <DragAnchor onDrag={onDrag} position={dragAnchor} />
    </div>
  )
}
