import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import {createPortal} from "react-dom"

export type DialogProps = {
  anchor: HTMLElement | null
  origin: string
  children: any
  open: boolean
  top: number
  left: number
}

export function Dialog(props: DialogProps) {
  const ref = useRef()
  const style = useDialogPosition(ref, props)

  return createPortal(
    <dialog open={props.open} style={style} ref={ref}>
      {props.children}
    </dialog>,
    document.getElementById("modal-root")
  )
}

function useDialogPosition(
  ref: MutableRefObject<HTMLDialogElement>,
  props: DialogProps
) {
  const [position, setPosition] = useState({
    top: 10,
    left: 10,
    width: props.width
  })

  useLayoutEffect(() => {
    if (!props.open) return
    if (props.anchor) {
      let left = 10
      let top = 10
      const anchor = props.anchor.getBoundingClientRect()
      if (props.origin.includes("left")) left = anchor.left
      if (props.origin.includes("right")) left = anchor.left + anchor.width
      if (props.origin.includes("top")) top = anchor.top
      if (props.origin.includes("bottom")) top = anchor.top + anchor.height
      if (props.top) top += props.top
      if (props.left) left += props.left
      setPosition((s) => ({...s, left, top}))
    }
  }, [props.anchor, props.origin, props.open, props.top, props.left])

  return position
}
