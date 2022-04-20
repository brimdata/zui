import React from "react"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import styled from "styled-components"
import {BasePin} from "../base-pin"
import Form, {encodeDate} from "./form"

const Sep = styled.span`
  padding: 0 10px;
  opacity: 0.5;
`

export default function TimeRangePin(props: {
  pin: TimeRangeQueryPin
  index: number
}) {
  const dispatch = useDispatch()
  return (
    <BasePin
      prefix="range"
      label={
        <>
          {formatDate(props.pin.from)}
          <Sep>—</Sep>
          {formatDate(props.pin.to)}
        </>
      }
      index={props.index}
      form={
        <Form
          pin={props.pin}
          onSubmit={(pin) => dispatch(Editor.updatePin(pin))}
          onReset={() => dispatch(Editor.cancelPinEdit())}
        />
      }
    />
  )
}

function formatDate(date: Date) {
  return date.toLocaleString()
}
