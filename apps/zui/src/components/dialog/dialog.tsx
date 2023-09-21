import {HTMLAttributes, MouseEventHandler} from "react"
import {usePosition} from "./use-position"
import useListener from "src/js/components/hooks/useListener"
import {useOpener} from "./use-opener"
import {useOutsideClick} from "./use-outside-click"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {omit} from "lodash"
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
} & HTMLAttributes<HTMLDialogElement>

const nonHTMLProps: (keyof DialogProps)[] = [
  "isOpen",
  "onClose",
  "modal",
  "onOutsideClick",
  "anchor",
  "anchorPoint",
  "dialogMargin",
  "dialogPoint",
  "keepOnScreen",
]

export function Dialog(props: DialogProps) {
  const [node, setNode] = useCallbackRef<HTMLDialogElement>()
  const style = usePosition(node, props)
  useOpener(node, props)
  useOutsideClick(node, props)
  useListener(node, "close", props.onClose)
  return (
    <dialog ref={setNode} style={style} {...omit(props, ...nonHTMLProps)}>
      {props.children}
    </dialog>
  )
}
