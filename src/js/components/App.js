/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {XLatestError} from "./LatestError"
import {XNotifications} from "./Notifications"
import {getTimeZone} from "../state/reducers/view"
import ClusterGate from "./Login/ClusterGate"
import * as Time from "../lib/Time"

export default function App() {
  Time.setZone(useSelector(getTimeZone))
  return (
    <div className="app-wrapper">
      <XLatestError />
      <XNotifications />
      <ClusterGate />
    </div>
  )
}
