import {MouseEvent} from "react"

export type Provided = {
  resizeProps: {
    onMouseDown: (e: MouseEvent) => void
    style: object
  }
  toggleProps: {
    onClick: (e: MouseEvent) => void
  }
  style: object
}
