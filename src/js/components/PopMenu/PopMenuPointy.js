/* @flow */
import React from "react"
import ReactDOM from "react-dom"

import {id} from "../../lib/Doc"
import {usePopMenu} from "./usePopMenu"

type Props = {
  children: *,
  template: Object[],
  position?: string
}

export default function PopMenuPointy({children, template, position}: Props) {
  let menu = usePopMenu(children, position)

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
        <PopMenuListItem item={item} key={i} />
      ))}
    </ul>
  )
}

function PopMenuListItem({item}) {
  switch (item.type) {
    case "divider":
      return <hr />
    default:
      return <li onClick={item.click}>{item.label}</li>
  }
}

function PopMenuPointer({style}) {
  return (
    <svg style={style} className="pop-menu-pointer" viewBox="0 0 100 50">
      <path d="M0,50 C25,50 40,0 50,0 C60,0 75,50 100,50 Z" />
    </svg>
  )
}
