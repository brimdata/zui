import React from "react"
import {GenericQueryPin} from "src/js/state/Editor/types"
import {BasePin} from "../base-pin"
import {Form} from "./form"

export default function GenericPin(props: {
  pin: GenericQueryPin
  index: number
}) {
  return (
    <BasePin
      pin={props.pin}
      index={props.index}
      label={props.pin.label || props.pin.value || "Empty pin..."}
      form={Form}
    />
  )
}
