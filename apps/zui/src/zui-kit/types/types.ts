import {Ref} from "react"

export type ReactAdapterProps = {
  width?: number
  height?: number
  className?: string
  innerRef?: Ref<HTMLDivElement>
  outerRef?: Ref<HTMLDivElement>
  initialScrollPosition?: {top?: number; left?: number}
}
