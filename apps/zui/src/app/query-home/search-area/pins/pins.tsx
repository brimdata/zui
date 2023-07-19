import React from "react"
import styled from "styled-components"
import Editor from "src/js/state/Editor"
import {useSelector} from "react-redux"
import {QueryPin} from "src/js/state/Editor/types"
import FromPin from "./from-pin/from-pin"
import GenericPin from "./generic-pin/generic-pin"
import TimeRangePin from "./time-range-pin/time-range-pin"
import {NewPinButton} from "./new-pin-button"
import {compact, isEmpty} from "lodash"
import {PlaceholderFromPin} from "./placeholder-pin"

const Container = styled.section`
  display: flex;
  padding: 16px 16px 4px 16px;
  flex-wrap: wrap;
  background: var(--editor-background);
  align-items: center;
  z-index: 1;
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
  return (
    <Container>
      <NewPinButton />
      {pins.map(renderPin)}
      {isEmpty(compact(pins)) && <PlaceholderFromPin />}
    </Container>
  )
}
