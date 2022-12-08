import React from "react"
import Icon from "src/app/core/icon-temp"
import styled from "styled-components"

const Select = styled.select`
  display: block;
  width: 100%;
  border: 1px solid #c0c0c0;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.14);
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 14px;
  line-height: 20px;
  appearance: none;
`

const BG = styled.div`
  position: relative;
  i {
    position: absolute;
    right: 10px;
    top: 6px;
  }
`

export default function SelectInput(props: JSX.IntrinsicElements["select"]) {
  return (
    <BG>
      {/* @ts-ignore */}
      <Select {...props} />
      <Icon name="chevron-down" size={16} />
    </BG>
  )
}
