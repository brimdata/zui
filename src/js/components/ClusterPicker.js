/* @flow */
import {useSelector} from "react-redux"
import React, {type ComponentType} from "react"
import styled from "styled-components"

import Current from "../state/Current"

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
  const current = useSelector(Current.getConnection)

  return (
    <ClusterPickerWrapper>
      <label>
        {current.host}:{current.port}
      </label>
    </ClusterPickerWrapper>
  )
}
