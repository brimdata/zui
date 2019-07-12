/* @flow */

import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import ReactDOM from "react-dom"

import {id} from "../../lib/Doc"
import PopMenuStyler from "./PopMenuStyler"

export function TestPopMenus() {
  let template = [{label: "Hello world, I am long label"}, {label: "World"}]

  return (
    <div className="body-content">
      <h1>Testing Pop Menus</h1>
      <ul>
        <li>
          The pointy part of the wrapper always gets positioned in the center of
          the anchor.
        </li>
      </ul>

      <PopMenuPointy template={template}>
        <a className="test-anchor a" />
      </PopMenuPointy>

      <PopMenuPointy template={template}>
        <a className="test-anchor b" />
      </PopMenuPointy>

      <PopMenuPointy template={template}>
        <a className="test-anchor c" />
      </PopMenuPointy>

      <PopMenuPointy template={template}>
        <a className="test-anchor d" />
      </PopMenuPointy>

      <PopMenuPointy template={template} align="top center">
        <a className="test-anchor e" />
      </PopMenuPointy>

      <PopMenuPointy template={template} align="bottom center">
        <a className="test-anchor f" />
      </PopMenuPointy>
    </div>
  )
}

function usePopMenu(children, align = "left bottom") {
  let anchorRef = useRef()
  let wrapperRef = useRef()
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
    let wrapper = wrapperRef.current
    if (!anchor || !wrapper) return
    let a = anchor.getBoundingClientRect()
    let w = wrapper.getBoundingClientRect()

    let [wStyle, pStyle] = new PopMenuStyler(a, w, 20).getStyle(align)
    setStyle(wStyle)
    setPointerStyle(pStyle)
  }, [isOpen])

  return {anchor, open, close, isOpen, ref: wrapperRef, style, pointerStyle}
}

type Props = {
  children: *,
  template: Object[],
  align?: string
}

function PopMenuPointy({children, template, align}: Props) {
  let menu = usePopMenu(children, align)

  return (
    <>
      <PopMenuWrapper
        onClose={menu.close}
        isOpen={menu.isOpen}
        setRef={menu.ref}
        style={menu.style}
      >
        <PopMenuPointer style={menu.pointerStyle} />
        <PopMenuList template={template} />
      </PopMenuWrapper>
      {menu.anchor}
    </>
  )
}

function PopMenuWrapper({children, onClose, isOpen, setRef, style}) {
  if (!isOpen) return null
  return ReactDOM.createPortal(
    <div className="pop-menu-overlay" onClick={onClose}>
      <div className="pop-menu-wrapper" ref={setRef} style={style}>
        {children}
      </div>
    </div>,
    id("context-menu-root")
  )
}

function PopMenuList({template}) {
  return (
    <ul>
      {template.map((item, i) => (
        <li key={i}>{item.label}</li>
      ))}
    </ul>
  )
}

function PopMenuPointer({style}) {
  return (
    <svg style={style} className="pop-menu-pointer" viewBox="0 0 100 50">
      <path d="M0,50 C25,50 40,0 50,0 C60,0 75,50 100,50 Z" />
    </svg>
  )
}
