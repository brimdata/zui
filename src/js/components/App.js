/* @flow */

import {useSelector} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import {XLatestError} from "./LatestError"
import {getTimeZone} from "../state/reducers/view"
import ClusterGate from "./Login/ClusterGate"
import brim from "../brim"

export default function App() {
  brim.time.setZone(useSelector(getTimeZone))
  let [mouse, setMouse] = useState(true)
  return (
    <div
      className={classNames("app-wrapper", {
        "using-mouse": mouse,
        "using-keyboard": !mouse
      })}
      onMouseDown={() => setMouse(true)}
      onKeyDown={() => setMouse(false)}
    >
      <div className="title-bar-drag-area" />
      <XLatestError />
      <ClusterGate />
    </div>
  )
}
