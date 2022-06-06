import React from "react"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import styled from "styled-components"
import {BasePin} from "../base-pin"
import Form from "./form"

const Sep = styled.span`
  padding: 0 10px;
  opacity: 0.5;
`

export default function TimeRangePin(props: {
  pin: TimeRangeQueryPin
  index: number
}) {
  const label = (
    <>
      {props.pin.from}
      <Sep>—</Sep>
      {props.pin.to}
    </>
  )
  return (
    <BasePin
      pin={props.pin}
      prefix="range"
      label={label}
      index={props.index}
      form={Form}
    />
  )
}
