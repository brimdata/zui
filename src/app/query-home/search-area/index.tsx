import React from "react"
import styled from "styled-components"

import Pins from "./pins"
import Error from "./error"
import Input, {hasNewLine} from "./Input"
import FromPinPicker from "./from-pin-picker"
import {useSelector} from "react-redux"
import SearchBar from "src/js/state/SearchBar"
import Current from "src/js/state/Current"

const Group = styled.div<{multiline: boolean}>`
  display: flex;
  flex-direction: column;
  padding: ${(p) => (p.multiline ? "0" : "0 16px 10px")};
`

const Wrap = styled.div<{isMultiLine: boolean}>`
  padding-top: 12px;
  ${(p) =>
    p.isMultiLine &&
    `
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.16);
    background: var(--editor-background);
  `}
`

export default function SearchArea() {
  const value = useSelector(SearchBar.getSearchBarInputValue)
  const multiline = hasNewLine(value)
  const query = useSelector(Current.getQuery)

  return (
    <Wrap isMultiLine={multiline}>
      <FromPinPicker isDisabled={query.isReadOnly} />
      <Group multiline={multiline}>
        <Input
          value={value}
          multiline={multiline}
          disabled={query.isReadOnly}
        />
        <Error />
        <Pins />
      </Group>
    </Wrap>
  )
}
