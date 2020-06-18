/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React, {type ComponentType} from "react"

import {disconnectCluster, switchCluster} from "../state/Clusters/flows"
import Clusters from "../state/Clusters"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import Tab from "../state/Tab"
import styled from "styled-components"
import DropdownArrow from "../icons/DropdownArrow"

const ClusterPickerWrapper = (styled.div`
  display: flex;
  flex-direction: column;
  margin: 11px 12px;

  label {
    ${(props) => props.theme.typography.labelBold};
    color: ${(props) => props.theme.colors.aqua};
  }

  svg {
    height: 11px;
    width: 11px;
    stroke: ${(props) => props.theme.colors.slate};
    margin-left: 6px;
  }
`: ComponentType<*>)

export default function ClusterPicker() {
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
    <ClusterPickerWrapper>
      <PopMenuPointy template={template} position="bottom center">
        <div>
          <label>
            {current.host}:{current.port}
          </label>
          <DropdownArrow />
        </div>
      </PopMenuPointy>
    </ClusterPickerWrapper>
  )
}
