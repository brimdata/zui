/* @flow */

import {useSelector} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import {XLatestError} from "./LatestError"
import {getTimeZone} from "../state/reducers/view"
import ClusterGate from "./Login/ClusterGate"
import brim from "../brim"
import useListener from "./hooks/useListener"

export default function App() {
  brim.time.setZone(useSelector(getTimeZone))
  let [mouse, setMouse] = useState(true)

  useListener(document, "mousedown", () => setMouse(true))
  useListener(document, "keydown", () => setMouse(false))

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
    </div>
  )
}
