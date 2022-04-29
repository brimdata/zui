import React from "react"
import styled from "styled-components"

import Pins from "./pins"
import Error from "./error"
import Input, {hasNewLine} from "./Input"
import FromPinPicker from "./from-pin-picker"
import {useSelector} from "react-redux"
import SearchBar from "src/js/state/SearchBar"
import Current from "src/js/state/Current"

const Group = styled.div<{flex: number; multiline: boolean}>`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
  padding: ${(p) => (p.multiline ? "0" : "0 16px 10px")};
`

export default function SearchArea() {
  const value = useSelector(SearchBar.getSearchBarInputValue)
  const multiline = hasNewLine(value)
  const query = useSelector(Current.getQuery)

  return (
    <>
      <FromPinPicker isDisabled={query.isReadOnly} />
      <Group multiline={multiline} flex={1}>
        <Input
          value={value}
          multiline={multiline}
          disabled={query.isReadOnly}
        />
        <Error />
        <Pins />
      </Group>
    </>
  )
}
