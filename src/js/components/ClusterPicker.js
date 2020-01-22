/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {disconnectCluster, switchCluster} from "../state/Clusters/flows"
import Clusters from "../state/Clusters"
import MenuBarButton from "./MenuBarButton"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import Tab from "../state/Tab"

export default function CluterPicker() {
  const current = useSelector(Tab.cluster)
  const clusters = useSelector(Clusters.all)
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
