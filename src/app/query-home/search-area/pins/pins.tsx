import React, {useEffect} from "react"
import styled from "styled-components"
import Editor from "src/js/state/Editor"
import {useSelector} from "react-redux"
import {GenericQueryPin, QueryPin} from "src/js/state/Editor/types"
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

  useEffect(() => {
    dispatch(Editor.addPin({type: "generic", value: "ABC"} as GenericQueryPin))
    dispatch(Editor.addPin({type: "generic", value: "DEF"} as GenericQueryPin))
    dispatch(Editor.addPin({type: "generic", value: "GHI"} as GenericQueryPin))
    dispatch(Editor.addPin({type: "generic", value: "JKL"} as GenericQueryPin))
    dispatch(Editor.addPin({type: "generic", value: "MNO"} as GenericQueryPin))
  }, [])

  return <Container>{pins.map(renderPin)}</Container>
}
