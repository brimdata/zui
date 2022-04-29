import React from "react"
import {useTimeZone} from "src/app/core/format"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import styled from "styled-components"
import {BasePin} from "../base-pin"
import Form from "./form"
import {getTimeString} from "./get-time-preview"

const Sep = styled.span`
  padding: 0 10px;
  opacity: 0.5;
`

export default function TimeRangePin(props: {
  pin: TimeRangeQueryPin
  index: number
}) {
  const dispatch = useDispatch()
  const zone = useTimeZone()
  const form = (
    <Form
      pin={props.pin}
      onSubmit={(pin) => dispatch(Editor.updatePin(pin))}
      onReset={() => dispatch(Editor.cancelPinEdit())}
    />
  )
  const label = (
    <>
      {props.pin.from}
      <Sep>—</Sep>
      {props.pin.to}
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
