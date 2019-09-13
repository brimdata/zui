/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {disconnectCluster, switchCluster} from "../state/clusters/thunks"
import {getCurrentCluster, getSavedClusters} from "../state/clusters/selectors"
import PopMenuPointy from "./PopMenu/PopMenuPointy"

export default function TitleBar() {
  const current = useSelector(getCurrentCluster)
  const clusters = useSelector(getSavedClusters)
  const dispatch = useDispatch()

  let template = clusters.map((cluster) => ({
    label: cluster.host + ":" + cluster.port,
    click: () => {
      dispatch(switchCluster(cluster))
    },
    disabled: isEqual(cluster, current)
  }))

  template.push({type: "divider"})
  template.push({
    label: "Other...",
    click: () => {
      dispatch(disconnectCluster())
    }
  })

  return (
    <div className="title-bar">
      <PopMenuPointy template={template} position="bottom center">
        <a className="thin-button host">
          {current.host}:{current.port}
        </a>
      </PopMenuPointy>
    </div>
  )
}
