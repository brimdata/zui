import React, {useEffect} from "react"
import styled from "styled-components"
import Editor from "src/js/state/Editor"
import {useSelector} from "react-redux"
import {QueryPin} from "src/js/state/Editor/types"
import FromPin from "./from-pin/from-pin"
import GenericPin from "./generic-pin/generic-pin"
import TimeRangePin from "./time-range-pin/time-range-pin"
import {useDispatch} from "src/app/core/state"

const Container = styled.section`
  margin-top: 16px;
  margin-bottom: 6px;
  display: flex;
  padding: 0 16px;
  flex-wrap: wrap;
`

function renderPin(pin: QueryPin, index: number) {
  switch (pin.type) {
    case "from":
      return <FromPin pin={pin} index={index} key={index} />
    case "generic":
      return <GenericPin pin={pin} index={index} key={index} />
    case "time-range":
      return <TimeRangePin pin={pin} index={index} key={index} />
  }
}

export function Pins() {
  const pins = useSelector(Editor.getPins)
  const dispatch = useDispatch()
  useEffect(() => {}, [])
  return <Container>{pins.map(renderPin)}</Container>
}
