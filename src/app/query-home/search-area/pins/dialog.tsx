import React, {
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {createPortal} from "react-dom"
import mergeRefs from "src/app/core/utils/merge-refs"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import useListener from "src/js/components/hooks/useListener"
import styled from "styled-components"

export type DialogProps = {
  anchor: HTMLElement | null
  origin: string
  children: any
  open: boolean
  top: number
  left: number
  width: number
}

const BG = styled.dialog`
  border: none;
  box-shadow: var(--shadow-elevation-medium);
  border-radius: 10px;
  &::backdrop {
    opacity: 0;
  }
`

const DialogContext = React.createContext(null)

export function useDialog(props: {onCancel?: any; onClose?: any}) {
  const el = React.useContext(DialogContext)
  useListener(el, "cancel", props.onCancel || (() => {}))
  useListener(el, "close", props.onClose || (() => {}))
  return el
}

function withinNode(node: HTMLElement, e: MouseEvent) {
  if (!e) return false
  var rect = node.getBoundingClientRect()

  return (
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width
  )
}

export function Dialog(props: DialogProps) {
  const [node, setNode] = useCallbackRef<any>()
  const style = useDialogPosition(node, props)
  const ref = useRef()
  const mouseDownEvent = useRef<MouseEvent | null>(null)

  useListener<MouseEvent>(node, "mousedown", (e) => {
    mouseDownEvent.current = e
  })

  useListener<MouseEvent>(node, "mouseup", (e) => {
    const dialog = e.currentTarget as HTMLElement
    const startedOut = !withinNode(dialog, mouseDownEvent.current)
    const finishedOut = !withinNode(dialog, e)
    if (startedOut && finishedOut) node.close()
  })

  useEffect(() => {
    if (!node) return
    if (props.open) {
      node.showModal()
    } else {
      node.close()
    }
  }, [node, props.open])

  return createPortal(
    <DialogContext.Provider value={node}>
      <BG style={style} ref={mergeRefs(ref, setNode)}>
        {props.children}
      </BG>
    </DialogContext.Provider>,
    document.getElementById("modal-root")
  )
}

function useDialogPosition(node: HTMLDialogElement, props: DialogProps) {
  const [position, setPosition] = useState({
    top: 10,
    left: 10,
    width: props.width,
  })

  const run = () => {
    if (!props.open) return
    if (!props.anchor) return
    if (!node) return
    const {width, height} = node.getBoundingClientRect()
    let left = 10
    let top = 10

    const leftMin = 10
    const leftMax = document.documentElement.clientWidth - leftMin
    const topMin = 10
    const topMax = document.documentElement.clientHeight - topMin

    const anchor = props.anchor.getBoundingClientRect()
    if (props.origin.includes("left")) left = anchor.left
    if (props.origin.includes("right")) left = anchor.left + anchor.width
    if (props.origin.includes("top")) top = anchor.top
    if (props.origin.includes("bottom")) top = anchor.top + anchor.height
    if (props.top) top += props.top
    if (props.left) left += props.left

    // If you overflow it to the right, back up
    if (left + width > leftMax) {
      const diff = left + props.width - leftMax
      left -= diff
    }
    // then If you overflow to the left, set at left limit
    if (left < leftMin) {
      left = leftMin
    }
    // If you overflow on the bottom, back up
    if (top + height > topMax) {
      const diff = top + height - topMax
      top -= diff
    }
    // then If you overflow on the top, set at top limit
    if (top < topMin) {
      top = topMin
    }

    setPosition((s) => ({...s, left, top}))
  }

  useLayoutEffect(() => {
    run()
  }, [
    node,
    // @ts-ignore
    node?.open,
    props.anchor,
    props.origin,
    props.open,
    props.top,
    props.left,
  ])

  useListener(global.window, "resize", run)

  return position
}
