import {MouseEventHandler, forwardRef} from "react"
import {useOpener} from "./use-opener"
import {useOutsideClick} from "./use-outside-click"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {omit} from "lodash"
import {useFixedPosition} from "src/util/hooks/use-fixed-position"
import {transitionsComplete} from "src/util/watch-transition"
import mergeRefs from "src/app/core/utils/merge-refs"

export type DialogProps = {
  isOpen: boolean
  onClose?: (e: HTMLDialogElement) => void | Promise<void>
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

  return (
    <dialog
      // @ts-ignore
      onClose={props.onClose}
      ref={mergeRefs(setNode, ref)}
      style={{...style, position: "fixed"}}
      {...omit(props, ...nonHTMLProps)}
    >
      {props.children}
    </dialog>
  )
})
