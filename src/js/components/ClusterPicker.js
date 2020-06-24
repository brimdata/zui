/* @flow */
import React, {type ComponentType} from "react"
import {useSelector} from "react-redux"
import Tab from "../state/Tab"
import styled from "styled-components"

const ClusterPickerWrapper = (styled.div`
  display: flex;
  flex-direction: column;
  margin: 11px 12px;
  user-select: none;

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

  return (
    <ClusterPickerWrapper>
      <label>
        {current.host}:{current.port}
      </label>
    </ClusterPickerWrapper>
  )
}
