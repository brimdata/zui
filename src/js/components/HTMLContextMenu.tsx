/* 
  This is a component only used for integration tests. Since Playwright cannot
  interact with the native right click menus, this component creates an
  html version of the right click menus with the same labels and click handlers
  that the native menu will recieve.

  Usually, when a native menu is clicked, it sends an event to the originating
  renderer process. This component simulates that simply by emiting the event
  here in the renderer. See the stubIpcSend() function below.
*/

import React, {useState} from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"
import useListener from "./hooks/useListener"
import doc from "../lib/doc"

export default function HTMLContextMenu() {
  const [template, setTemplate] = useState(null)
  const openMenu = (e) => setTemplate(e.detail)

  useListener(document, "nativeContextMenu", openMenu)

  if (!template) return null
  return ReactDOM.createPortal(
    <div className="html-context-menu" onClick={() => setTemplate(null)}>
      <ul>
        {template.map((item, i) => (
          <HTMLMenuItem item={item} key={i} />
        ))}
      </ul>
    </div>,
    doc.id("tooltip-root")
  )
}

function HTMLMenuItem({item}) {
  if (item.type === "separator") {
    return <hr />
  } else {
    return (
      <li
        onClick={() => item.click(item)}
        className={classNames({disabled: item.enabled === false})}
      >
        {item.label}
      </li>
    )
  }
}
