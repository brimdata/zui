import React from "react"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import {GenericQueryPin} from "src/js/state/Editor/types"
import {BasePin} from "../base-pin"
import {Form} from "./form"

export default function GenericPin(props: {
  pin: GenericQueryPin
  index: number
}) {
  const dispatch = useDispatch()
  return (
    <BasePin
      disabled={props.pin.disabled}
      index={props.index}
      label={props.pin.label || props.pin.value || "New Generic Pin"}
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
