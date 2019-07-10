/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {disconnect} from "../state/thunks/disconnect"
import {getCurrentCluster} from "../state/clusters/selectors"

export default function TitleBar() {
  const {host, port} = useSelector(getCurrentCluster)
  let dispatch = useDispatch()

  function onHostClick() {
    dispatch(disconnect())
  }

  return (
    <div className="title-bar">
      <a className="thin-button host" onClick={onHostClick}>
        {host}:{port}
      </a>
    </div>
  )
}
