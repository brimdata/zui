/* @flow */

import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import {ipcRenderer} from "electron"

import {XLatestError} from "./LatestError"
import SearchPage from "./SearchPage"
import View from "../state/View"
import brim from "../brim"
import useListener from "./hooks/useListener"

export default function App() {
  brim.time.setZone(useSelector(View.getTimeZone))
  let [mouse, setMouse] = useState(true)

  useListener(document, "mousedown", () => setMouse(true))
  useListener(document, "keydown", () => setMouse(false))

  useEffect(() => {
    ipcRenderer.invoke("windows:ready")
  }, [])

  return (
    <div
      className={classNames("app-wrapper", {
        "using-mouse": mouse,
        "using-keyboard": !mouse
      })}
    >
      <div className="title-bar-drag-area" />
      <XLatestError />
      <SearchPage />
    </div>
  )
}
