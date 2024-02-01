import {MouseEventHandler, forwardRef} from "react"
import {useOpener} from "./use-opener"
import {useOutsideClick} from "./use-outside-click"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {omit} from "lodash"
import {useFixedPosition} from "src/util/hooks/use-fixed-position"
import mergeRefs from "src/app/core/utils/merge-refs"
import useListener from "src/js/components/hooks/useListener"
import {call} from "src/util/call"

export type DialogProps = {
  isOpen: boolean
  onClose?: (e: any) => any
  onCancel?: (e: any) => any
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

export const Dialog = forwardRef(function Dialog(props: DialogProps, ref) {
  const [node, setNode] = useCallbackRef<HTMLDialogElement>()
  useOpener(node, props) // Make sure we open it before positioning it
  useOutsideClick(node, props)

  // Get this out of here
  const style = useFixedPosition({
    anchor: props.anchor,
    anchorPoint: props.anchorPoint,
    target: node && props.isOpen ? node : null,
    targetPoint: props.dialogPoint,
    targetMargin: props.dialogMargin,
  })

  // When you click escape, "cancel" is fired, then close
  useListener(node, "cancel", (e) => {
    call(props.onCancel, e)
  })

  // When you call .close() "close" fires
  useListener(node, "close", (e) => {
    call(props.onClose, e)
  })

  return (
    <dialog
      ref={mergeRefs(setNode, ref)}
      style={{...style, position: "fixed"}}
      {...omit(props, ...nonHTMLProps)}
    >
      {props.children}
    </dialog>
  )
})
