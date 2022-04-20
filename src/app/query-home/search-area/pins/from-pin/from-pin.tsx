import {isString} from "lodash"
import React from "react"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import {FromQueryPin} from "src/js/state/Editor/types"
import {BasePin} from "../base-pin"
import {showMenu} from "./show-menu"

export default function FromPin(props: {pin: FromQueryPin; index: number}) {
  const dispatch = useDispatch()
  return (
    <BasePin
      index={props.index}
      prefix="from"
      label={props.pin.value}
      showMenu={() => {
        dispatch(showMenu()).then((value: string) => {
          if (isString(value)) dispatch(Editor.updatePin({value}))
          else dispatch(Editor.cancelPinEdit())
        })
      }}
    />
  )
}
