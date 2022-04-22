import React from "react"
import {useEffect} from "react"
import {useDispatch} from "src/app/core/state"
import styled from "styled-components"
import Editor from "src/js/state/Editor"
import {useSelector} from "react-redux"
import {QueryPin} from "src/js/state/Editor/types"
import FromPin from "./from-pin/from-pin"
import GenericPin from "./generic-pin/generic-pin"
import TimeRangePin from "./time-range-pin/time-range-pin"
import NewPin from "./new-pin"

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
  const dispatch = useDispatch()
  const pins = useSelector(Editor.getPins)

  useEffect(() => {
    dispatch(Editor.addPin({type: "from", value: "finance-data"}))
    dispatch(
      Editor.addPin({
        type: "generic",
        value: "has(ts)",
        label: "Has a timestamp"
      })
    )
    dispatch(
      Editor.addPin({
        type: "time-range",
        from: new Date(0),
        to: new Date()
      })
    )
  }, [])

  return (
    <Container>
      {pins.map(renderPin)}
      <NewPin />
    </Container>
  )
}
