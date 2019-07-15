/* @flow */

import {batch, useDispatch, useSelector} from "react-redux"
import React from "react"

import {attemptLogin} from "../state/clusters/thunks"
import {disconnect} from "../state/thunks/disconnect"
import {getCurrentCluster, getSavedClusters} from "../state/clusters/selectors"
import PopMenuPointy from "./PopMenu/PopMenuPointy"

export default function TitleBar() {
  const {host, port} = useSelector(getCurrentCluster)
  const clusters = useSelector(getSavedClusters)
  const dispatch = useDispatch()

  let template = clusters.map((cluster) => ({
    label: cluster.host + ":" + cluster.port,
    click() {
      batch(() => {
        dispatch(disconnect())
        dispatch(attemptLogin(cluster))
      })
    }
  }))

  return (
    <div className="title-bar">
      <PopMenuPointy template={template} position="bottom center">
        <a className="thin-button host">
          {host}:{port}
        </a>
      </PopMenuPointy>
    </div>
  )
}
