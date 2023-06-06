import {useRef, MouseEventHandler} from "react"
import {usePosition} from "./use-position"
import useListener from "src/js/components/hooks/useListener"
import {useOpener} from "./use-opener"
import {useOutsideClick} from "./use-outside-click"

export type DialogProps = {
  isOpen: boolean
  onClose: () => void
  modal?: boolean
  onOutsideClick?: (e: globalThis.MouseEvent) => void
  onClick?: MouseEventHandler<HTMLDialogElement>
  children?: any
  className?: string
  anchor?: HTMLElement
  anchorPoint?: string
  dialogPoint?: string
  dialogMargin?: string
  keepOnScreen?: boolean
}

export function Dialog(props: DialogProps) {
  const ref = useRef<HTMLDialogElement>()
  const style = usePosition(ref.current, props)
  useOpener(ref.current, props)
  useOutsideClick(ref.current, props)
  useListener(ref.current, "close", props.onClose)

  return (
    <dialog ref={ref} style={style} className={props.className}>
      {props.children}
    </dialog>
  )
}
