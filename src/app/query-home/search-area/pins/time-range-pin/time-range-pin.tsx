import React from "react"
import Pin from "src/app/core/icons/pin"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
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
  const dispatch = useDispatch()
  const form = (
    <Form
      pin={props.pin}
      onSubmit={(pin) => dispatch(Editor.updatePin(pin))}
      onReset={() => dispatch(Editor.cancelPinEdit())}
    />
  )
  const label = (
    <>
      {formatDate(props.pin.from)}
      <Sep>—</Sep>
      {formatDate(props.pin.to)}
    </>
  )
  return (
    <BasePin
      disabled={props.pin.disabled}
      prefix="range"
      label={label}
      index={props.index}
      form={form}
    />
  )
}

function formatDate(date: Date) {
  return date.toLocaleString()
}
