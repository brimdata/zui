/* @flow */
import {useSelector} from "react-redux"
import React from "react"
import ReactDom from "react-dom"

import {getBackendError} from "../backend"
import {id} from "../lib/Doc"

export default function ClusterError() {
  let error = useSelector(getBackendError)

  if (!error) return null

  return ReactDom.createPortal(
    <p className="notice">{error.message()}</p>,
    id("notification-root")
  )
}
