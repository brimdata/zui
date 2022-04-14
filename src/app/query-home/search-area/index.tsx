import React from "react"
import styled from "styled-components"

import Pins from "./pins"
import Error from "./error"
import Input, {hasNewLine} from "./Input"
import FromPinPicker from "./from-pin-picker"
import {useSelector} from "react-redux"
import SearchBar from "src/js/state/SearchBar"
import Current from "src/js/state/Current"

const Group = styled.div<{flex: number; isMultiLine: boolean}>`
  display: flex;
  flex: ${(p) => p.flex || "initial"};
  flex-direction: column;
  padding: ${(p) => (p.isMultiLine ? "0" : "0 16px 10px")};
`

export default function SearchArea() {
  const inputValue = useSelector(SearchBar.getSearchBarInputValue)
  const isMultiLine = hasNewLine(inputValue)
  const query = useSelector(Current.getQuery)

  return (
    <>
      <FromPinPicker isDisabled={query.isReadOnly} />
      <Group isMultiLine={isMultiLine} flex={1}>
        <Input
          inputValue={inputValue}
          isMultiLine={isMultiLine}
          isDisabled={query.isReadOnly}
        />
        <Error />
        <Pins />
      </Group>
    </>
  )
}
