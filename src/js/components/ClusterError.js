/* @flow */
import {useSelector} from "react-redux"
import React from "react"
import ReactDom from "react-dom"

import {getClusterError} from "../state/clusters/selectors"
import {id} from "../lib/Doc"

export default function ClusterError() {
  let error = useSelector(getClusterError)

  if (error.length === 0) return null

  return ReactDom.createPortal(
    <p className="notice">{error}</p>,
    id("notification-root")
  )
}
