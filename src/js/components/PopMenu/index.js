/* @flow */
// The pointy part of the wrapper always gets positioned
// in the center of the anchor.

import React, {useEffect, useRef, useState} from "react"
import ReactDOM from "react-dom"

import {id} from "../../lib/Doc"

export function TestPopMenus() {
  let template = [{label: "Hello"}, {label: "World"}]

  return (
    <div className="body-content">
      <h1>Testing Pop Menus</h1>
      <ul>
        <li>
          The pointy part of the wrapper always gets positioned in the center of
          the anchor.
        </li>
      </ul>

      <PopMenuPointy template={template} align="center" animate="bounce-down">
        <a>Click Me</a>
      </PopMenuPointy>
    </div>
  )
}

function usePopMenu(children) {
  let anchorRef = useRef()
  let child = React.Children.only(children)
  let anchor = React.cloneElement(child, {ref: anchorRef})
  let [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  useEffect(() => {
    let a = anchorRef.current

    a && a.addEventListener("click", open)
    return () => {
      a && a.removeEventListener("click", open)
    }
  }, [])

  return {anchor, open, close, isOpen}
}

function PopMenuPointy({children, template}) {
  let menu = usePopMenu(children)

  return (
    <>
      <PopMenuWrapper onClose={menu.close} isOpen={menu.isOpen}>
        <PopMenuPointer />
        <PopMenuList template={template} />
      </PopMenuWrapper>
      {menu.anchor}
    </>
  )
}

function PopMenuWrapper({children, onClose, isOpen}) {
  if (!isOpen) return null
  return ReactDOM.createPortal(
    <div className="pop-menu-overlay" onClick={onClose}>
      <div className="pop-menu-wrapper">{children}</div>
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

function PopMenuPointer() {
  return (
    <svg className="pop-menu-pointer" viewBox="0 0 100 50">
      <path d="M0,50 C25,50 40,0 50,0 C60,0 75,50 100,50 Z" />
    </svg>
  )
}
