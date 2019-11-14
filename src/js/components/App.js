/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {XLatestError} from "./LatestError"
import {getTimeZone} from "../state/reducers/view"
import ClusterGate from "./Login/ClusterGate"
import brim from "../brim"

export default function App() {
  brim.time.setZone(useSelector(getTimeZone))
  return (
    <div className="app-wrapper">
      <div className="title-bar-drag-area" />
      <XLatestError />
      <ClusterGate />
    </div>
  )
}
