/* @flow */
import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import {ipcRenderer} from "electron"

import lib from "../lib"

export default function HTMLContextMenu() {
  let [template, setTemplate] = useState(null)

  useEffect(() => {
    const name = "nativeContextMenu"
    const handler = (e) => setTemplate(e.detail)

    // $FlowFixMe
    document.addEventListener(name, handler, false)
    document.addEventListener("click", () => setTemplate(null), false)
    // $FlowFixMe
    return () => document.removeEventListener(name, handler, false)
  }, [])

  if (!template) return null

  function onClick(item) {
    item.click(item, {
      webContents: {
        send: (name, ...args) => {
          ipcRenderer.emit(name, null, ...args)
        }
      }
    })
  }
  return ReactDOM.createPortal(
    <div className="html-context-menu">
      <ul>
        {template.map((item, i) => {
          if (item.type === "separator") return <hr key={i} />
          else
            return (
              <li
                key={i}
                onClick={() => onClick(item)}
                className={classNames({disabled: !item.enabled})}
              >
                {item.label}
              </li>
            )
        })}
      </ul>
    </div>,
    lib.doc.id("tooltip-root")
  )
}
