import {HTMLAttributes, MouseEventHandler} from "react"
import {useOpener} from "./use-opener"
import {useOutsideClick} from "./use-outside-click"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {omit} from "lodash"
import {call} from "src/util/call"
import {useFixedPosition} from "src/util/hooks/use-fixed-position"

export type DialogProps = {
  isOpen: boolean
  onClose?: () => void
  onCancel?: () => void
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
  useOpener(node, props) // Make sure we open it before positioning it
  useOutsideClick(node, props)
  const style = useFixedPosition({
    anchor: props.anchor,
    anchorPoint: props.anchorPoint,
    target: node && props.isOpen ? node : null,
    targetPoint: props.dialogPoint,
    targetMargin: props.dialogMargin,
  })

  function onClose(e) {
    e.preventDefault()
    call(props.onClose)
  }

  function onCancel(e) {
    e.preventDefault()
    call(props.onCancel)
    call(props.onClose)
  }

  return (
    <dialog
      // @ts-ignore
      onClose={onClose}
      onCancel={onCancel}
      ref={setNode}
      style={{...style, position: "fixed"}}
      {...omit(props, ...nonHTMLProps)}
    >
      {props.children}
    </dialog>
  )
}
