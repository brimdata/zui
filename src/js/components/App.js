/* @flow */

import {useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import {ipcRenderer} from "electron"

import {XLatestError} from "./LatestError"
import AboutModal from "./AboutModal"
import ClusterGate from "./Login/ClusterGate"
import ErrorNotice from "./ErrorNotice"
import SettingsModal from "./SettingsModal"
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
      <ClusterGate />

      {/* Global Modals */}
      <ErrorNotice />
      <SettingsModal />
      <AboutModal />
    </div>
  )
}
