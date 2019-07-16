/* @flow */
import React, {useEffect, useLayoutEffect, useRef, useState} from "react"

import {layoutPopMenu} from "./layout"

export function usePopMenu(children: *, position: string = "left bottom") {
  let anchorRef = useRef()
  let menuRef = useRef<HTMLElement | null>(null)
  let [isOpen, setIsOpen] = useState(false)
  let [style, setStyle] = useState({})
  let [pointerStyle, setPointerStyle] = useState({})

  let child = React.Children.only(children)
  let anchor = React.cloneElement(child, {ref: anchorRef})

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  useEffect(() => {
    let a = anchorRef.current
    if (!a) return

    a.addEventListener("click", open)
    return () => a.removeEventListener("click", open)
  }, [])

  useLayoutEffect(() => {
    let anchor = anchorRef.current
    let menu = menuRef.current
    if (!anchor || !menu) return

    let pop = layoutPopMenu(anchor, menu, position)
    setStyle(pop.wrapperStyle)
    setPointerStyle(pop.pointerStyle)
    pop.animate()
  }, [isOpen])

  return {anchor, open, close, isOpen, ref: menuRef, style, pointerStyle}
}
