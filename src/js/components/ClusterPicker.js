/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {disconnectCluster, switchCluster} from "../state/clusters/thunks"
import {getCurrentCluster, getSavedClusters} from "../state/clusters/selectors"
import MenuBarButton from "./MenuBarButton"
import PopMenuPointy from "./PopMenu/PopMenuPointy"

export default function CluterPicker() {
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
    label: "New connection...",
    click: () => {
      dispatch(disconnectCluster())
    }
  })

  return (
    <div className="cluster-picker">
      <PopMenuPointy template={template} position="bottom center">
        <div>
          <MenuBarButton dropdown>
            <strong>{current.host}</strong>:{current.port}
          </MenuBarButton>
        </div>
      </PopMenuPointy>
    </div>
  )
}
