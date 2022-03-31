import React, {MutableRefObject, useLayoutEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
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
`

export function Dialog(props: DialogProps) {
  const ref = useRef()
  const style = useDialogPosition(ref, props)

  return createPortal(
    <BG open={props.open} style={style} ref={ref}>
      {props.children}
    </BG>,
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
      const widthLimit = document.documentElement.clientWidth
      const heightLimit = document.documentElement.clientHeight
      const anchor = props.anchor.getBoundingClientRect()
      if (props.origin.includes("left")) left = anchor.left
      if (props.origin.includes("right")) left = anchor.left + anchor.width
      if (props.origin.includes("top")) top = anchor.top
      if (props.origin.includes("bottom")) top = anchor.top + anchor.height
      if (props.top) top += props.top
      if (props.left) left += props.left

      // If you overflow it to the right, back up
      // then If you overflow to the left, set at left limit
      // If you overflow on the bottom, back up
      // then If you overflow on the top, set at top limit

      setPosition((s) => ({...s, left, top}))
    }
  }, [props.anchor, props.origin, props.open, props.top, props.left])

  return position
}
